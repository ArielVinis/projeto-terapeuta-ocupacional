import { db } from "@/src/server/db";
import { ebook, purchase, purchaseItem, user } from "@/src/server/db/schema";
import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";

export const ADMIN_PERIODS = [7, 30, 90] as const;
export type AdminPeriod = (typeof ADMIN_PERIODS)[number];

export function parseAdminPeriod(value: string | undefined): AdminPeriod {
  const n = Number(value);
  if (n === 7 || n === 30 || n === 90) return n;
  return 30;
}

function periodStart(days: AdminPeriod) {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() - (days - 1));
  return start;
}

export async function getSalesStats(days: AdminPeriod) {
  const start = periodStart(days);

  const [totals] = await db
    .select({
      revenueCents: sql<number>`coalesce(sum(${purchase.amountCents}), 0)::int`,
      salesCount: sql<number>`count(*)::int`,
    })
    .from(purchase)
    .where(and(eq(purchase.status, "paid"), gte(purchase.createdAt, start)));

  const revenueCents = totals?.revenueCents ?? 0;
  const salesCount = totals?.salesCount ?? 0;
  const averageTicketCents = salesCount > 0 ? Math.round(revenueCents / salesCount) : 0;

  const dailyRows = await db
    .select({
      date: sql<string>`to_char(date_trunc('day', ${purchase.createdAt} at time zone 'UTC'), 'YYYY-MM-DD')`,
      amountCents: sql<number>`coalesce(sum(${purchase.amountCents}), 0)::int`,
      count: sql<number>`count(*)::int`,
    })
    .from(purchase)
    .where(and(eq(purchase.status, "paid"), gte(purchase.createdAt, start)))
    .groupBy(sql`date_trunc('day', ${purchase.createdAt} at time zone 'UTC')`)
    .orderBy(sql`date_trunc('day', ${purchase.createdAt} at time zone 'UTC')`);

  const byDate = new Map(dailyRows.map((row) => [row.date, row]));
  const series: Array<{ date: string; amountCents: number; count: number; label: string }> = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setUTCDate(start.getUTCDate() + i);
    const key = d.toISOString().slice(0, 10);
    const row = byDate.get(key);
    series.push({
      date: key,
      amountCents: row?.amountCents ?? 0,
      count: row?.count ?? 0,
      label: `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`,
    });
  }

  return {
    revenueCents,
    salesCount,
    averageTicketCents,
    series,
  };
}

export async function listSalesAdmin(days: AdminPeriod) {
  const start = periodStart(days);

  const purchases = await db
    .select({
      id: purchase.id,
      amountCents: purchase.amountCents,
      currency: purchase.currency,
      status: purchase.status,
      createdAt: purchase.createdAt,
      stripeSessionId: purchase.stripeSessionId,
      userName: user.name,
      userEmail: user.email,
    })
    .from(purchase)
    .innerJoin(user, eq(purchase.userId, user.id))
    .where(and(eq(purchase.status, "paid"), gte(purchase.createdAt, start)))
    .orderBy(desc(purchase.createdAt));

  if (purchases.length === 0) return [];

  const items = await db
    .select({
      purchaseId: purchaseItem.purchaseId,
      title: ebook.title,
      priceCents: purchaseItem.priceCents,
    })
    .from(purchaseItem)
    .innerJoin(ebook, eq(purchaseItem.ebookId, ebook.id))
    .where(
      inArray(
        purchaseItem.purchaseId,
        purchases.map((p) => p.id),
      ),
    );

  const itemsByPurchase = new Map<string, Array<{ title: string; priceCents: number }>>();
  for (const item of items) {
    const list = itemsByPurchase.get(item.purchaseId) ?? [];
    list.push({ title: item.title, priceCents: item.priceCents });
    itemsByPurchase.set(item.purchaseId, list);
  }

  return purchases.map((row) => ({
    ...row,
    items: itemsByPurchase.get(row.id) ?? [],
  }));
}
