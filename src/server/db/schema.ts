import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);
export const purchaseStatusEnum = pgEnum("purchase_status", ["paid", "pending", "refunded"]);

export const user = pgTable("user", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 120 }).notNull(),
  email: varchar({ length: 254 }).notNull().unique(),
  emailVerified: boolean().default(false).notNull(),
  image: varchar({ length: 2048 }),
  role: roleEnum().default("user").notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: uuid().defaultRandom().primaryKey(),
    expiresAt: timestamp({ withTimezone: true }).notNull(),
    token: varchar({ length: 255 }).notNull().unique(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: varchar({ length: 45 }),
    userAgent: varchar({ length: 512 }),
    userId: uuid()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: uuid().defaultRandom().primaryKey(),
    accountId: varchar({ length: 255 }).notNull(),
    providerId: varchar({ length: 255 }).notNull(),
    userId: uuid()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: varchar({ length: 2048 }),
    refreshToken: varchar({ length: 2048 }),
    idToken: varchar({ length: 2048 }),
    accessTokenExpiresAt: timestamp({ withTimezone: true }),
    refreshTokenExpiresAt: timestamp({ withTimezone: true }),
    scope: varchar({ length: 1024 }),
    password: varchar({ length: 255 }),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_user_id_idx").on(table.userId)],
);

export const verification = pgTable("verification", {
  id: uuid().defaultRandom().primaryKey(),
  identifier: varchar({ length: 255 }).notNull(),
  value: varchar({ length: 255 }).notNull(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const ebook = pgTable(
  "ebook",
  {
    id: uuid().defaultRandom().primaryKey(),
    slug: varchar({ length: 120 }).notNull().unique(),
    title: varchar({ length: 200 }).notNull(),
    description: varchar({ length: 5000 }).notNull(),
    priceCents: integer().notNull(),
    coverUrl: varchar({ length: 2048 }),
    blobPath: varchar({ length: 2048 }),
    active: boolean().default(true).notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [check("ebook_price_cents_nonneg", sql`${table.priceCents} >= 0`)],
);

export const purchase = pgTable(
  "purchase",
  {
    id: uuid().defaultRandom().primaryKey(),
    userId: uuid()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    stripeSessionId: varchar({ length: 255 }).notNull(),
    amountCents: integer().notNull(),
    currency: varchar({ length: 3 }).default("brl").notNull(),
    status: purchaseStatusEnum().default("paid").notNull(),
    createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("purchase_stripe_session_uidx").on(table.stripeSessionId),
    index("purchase_user_id_idx").on(table.userId),
    check("purchase_amount_cents_nonneg", sql`${table.amountCents} >= 0`),
  ],
);

export const purchaseItem = pgTable(
  "purchase_item",
  {
    id: uuid().defaultRandom().primaryKey(),
    purchaseId: uuid()
      .notNull()
      .references(() => purchase.id, { onDelete: "cascade" }),
    ebookId: uuid()
      .notNull()
      .references(() => ebook.id, { onDelete: "restrict" }),
    priceCents: integer().notNull(),
  },
  (table) => [
    index("purchase_item_purchase_id_idx").on(table.purchaseId),
    check("purchase_item_price_cents_nonneg", sql`${table.priceCents} >= 0`),
  ],
);
