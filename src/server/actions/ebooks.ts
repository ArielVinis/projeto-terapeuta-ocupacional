"use server";

import { PATHS } from "@/src/constants/paths";
import { env } from "@/src/env";
import { requireAdmin, requireSession } from "@/src/server/auth/session";
import { uploadEbookPdf } from "@/src/server/blob";
import { upsertEbook } from "@/src/server/ebook/mutations";
import { getEbookByIdOrSlug, userOwnsEbook } from "@/src/server/ebook/queries";
import { createEbookCheckoutSession } from "@/src/server/stripe/checkout";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ActionResult } from "./result";

const ebookSchema = z.object({
  id: z.string().optional(),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug inválido"),
  title: z.string().min(2),
  description: z.string().min(2),
  priceReais: z.coerce.number().positive(),
  coverUrl: z.string().optional().nullable(),
  active: z.coerce.boolean().optional(),
});

export async function saveEbookAction(formData: FormData): Promise<ActionResult<{ id: string }>> {
  await requireAdmin(PATHS.admin);

  const parsed = ebookSchema.safeParse({
    id: formData.get("id") || undefined,
    slug: formData.get("slug"),
    title: formData.get("title"),
    description: formData.get("description"),
    priceReais: formData.get("priceReais"),
    coverUrl: formData.get("coverUrl") || null,
    active: formData.get("active") !== "false",
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  let blobPath: string | null | undefined;
  const file = formData.get("pdf");
  if (file instanceof File && file.size > 0) {
    const maxBytes = 20 * 1024 * 1024;
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      return { success: false, error: "Apenas ficheiros PDF são permitidos" };
    }
    if (file.size > maxBytes) {
      return { success: false, error: "PDF demasiado grande (máx. 20 MB)" };
    }
    const uploaded = await uploadEbookPdf(file.name, file);
    blobPath = uploaded.url;
  } else if (parsed.data.id) {
    const existing = await getEbookByIdOrSlug(parsed.data.id);
    blobPath = existing?.blobPath ?? null;
  }

  const id = await upsertEbook({
    id: parsed.data.id,
    slug: parsed.data.slug,
    title: parsed.data.title,
    description: parsed.data.description,
    priceCents: Math.round(parsed.data.priceReais * 100),
    coverUrl: parsed.data.coverUrl,
    blobPath,
    active: parsed.data.active ?? true,
  });

  revalidatePath(PATHS.admin);
  revalidatePath(PATHS.shop);
  revalidatePath(PATHS.home);
  return { success: true, data: { id } };
}

export async function startCheckoutAction(
  ebookIds: string[],
): Promise<ActionResult<{ url: string }>> {
  const session = await requireSession(PATHS.shop);
  if (!ebookIds.length) {
    return { success: false, error: "Carrinho vazio" };
  }

  const items = [];
  for (const id of ebookIds) {
    const row = await getEbookByIdOrSlug(id);
    if (!row || row.active === false) {
      return { success: false, error: `E-book não encontrado: ${id}` };
    }
    items.push({
      id: row.id,
      name: row.title,
      priceCents: row.priceCents,
    });
  }

  const baseUrl = env.appUrl;

  try {
    const checkout = await createEbookCheckoutSession({
      userId: session.user.id,
      userEmail: session.user.email,
      items,
      successUrl: `${baseUrl}${PATHS.meusEbooks}?checkout=success`,
      cancelUrl: `${baseUrl}${PATHS.shop}?checkout=cancel`,
    });
    if (!checkout.url) {
      return { success: false, error: "Não foi possível iniciar o checkout" };
    }
    return { success: true, data: { url: checkout.url } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro no Stripe",
    };
  }
}

export async function getDownloadUrlAction(
  ebookId: string,
): Promise<ActionResult<{ url: string }>> {
  const session = await requireSession(PATHS.meusEbooks);
  const owns = await userOwnsEbook(session.user.id, ebookId);
  if (!owns) {
    return { success: false, error: "Sem permissão para este e-book" };
  }

  const row = await getEbookByIdOrSlug(ebookId);
  if (!row?.blobPath) {
    return { success: false, error: "Ficheiro ainda não disponível" };
  }

  // Private blobs are streamed via authenticated API route (not a public URL).
  return { success: true, data: { url: PATHS.apiEbookDownload(row.id) } };
}
