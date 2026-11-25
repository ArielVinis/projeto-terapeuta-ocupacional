"use server";

import { PATHS } from "@/src/constants/paths";
import { env } from "@/src/env";
import { requireAdmin, requireSession } from "@/src/server/auth/session";
import { deleteBlobBestEffort, uploadEbookCover, uploadEbookPdf } from "@/src/server/blob";
import { deleteEbookById, upsertEbook } from "@/src/server/ebook/mutations";
import { findEbookInDb, userOwnsEbook } from "@/src/server/ebook/queries";
import { createEbookCheckoutSession } from "@/src/server/stripe/checkout";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ActionResult } from "./result";

const coverUrlSchema = z
  .string()
  .max(2048)
  .refine(
    (value) => value.startsWith("https://") || /^\/[a-zA-Z0-9/_.-]*$/.test(value),
    "URL de capa inválida",
  );

const ebookSchema = z.object({
  id: z.uuid().optional(),
  slug: z
    .string()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug inválido"),
  title: z.string().min(2).max(200),
  description: z.string().min(2).max(5000),
  priceReais: z.coerce.number().positive(),
  coverUrl: z
    .union([z.null(), z.literal(""), coverUrlSchema])
    .optional()
    .nullable()
    .transform((v) => (v === "" || v == null ? null : v)),
  active: z.coerce.boolean().optional(),
});

function revalidateEbookPaths() {
  revalidatePath(PATHS.admin.root);
  revalidatePath(PATHS.admin.ebooks);
  revalidatePath(PATHS.admin.sales);
  revalidatePath(PATHS.shop);
  revalidatePath(PATHS.home);
}

export async function saveEbookAction(formData: FormData): Promise<ActionResult<{ id: string }>> {
  await requireAdmin(PATHS.admin.ebooks);

  const parsed = ebookSchema.safeParse({
    id: formData.get("id") || undefined,
    slug: formData.get("slug"),
    title: formData.get("title"),
    description: formData.get("description"),
    priceReais: formData.get("priceReais"),
    coverUrl: formData.get("coverUrl") || null,
    active: formData.get("active") === "true" || formData.get("active") === "on",
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const existing = parsed.data.id ? await findEbookInDb(parsed.data.id) : null;

  let coverUrl = parsed.data.coverUrl ?? null;
  const coverFile = formData.get("cover");
  let replacedCover = false;
  if (coverFile instanceof File && coverFile.size > 0) {
    const isImage =
      coverFile.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|avif)$/i.test(coverFile.name);
    if (!isImage) {
      return { success: false, error: "A capa deve ser uma imagem" };
    }
    try {
      const uploaded = await uploadEbookCover(coverFile);
      coverUrl = uploaded.url;
      replacedCover = true;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Falha no upload da capa",
      };
    }
  } else if (parsed.data.id && !coverUrl) {
    coverUrl = existing?.coverUrl ?? null;
  }

  let blobPath: string | null | undefined;
  let replacedPdf = false;
  const file = formData.get("pdf");
  if (file instanceof File && file.size > 0) {
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      return { success: false, error: "Apenas arquivos PDF são permitidos" };
    }
    try {
      const uploaded = await uploadEbookPdf(file.name, file);
      blobPath = uploaded.url;
      replacedPdf = true;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Falha no upload do PDF",
      };
    }
  } else if (parsed.data.id) {
    blobPath = existing?.blobPath ?? null;
  }

  const id = await upsertEbook({
    id: parsed.data.id,
    slug: parsed.data.slug,
    title: parsed.data.title,
    description: parsed.data.description,
    priceCents: Math.round(parsed.data.priceReais * 100),
    coverUrl,
    blobPath,
    active: parsed.data.active ?? true,
  });

  if (replacedCover) {
    await deleteBlobBestEffort(existing?.coverUrl);
  }
  if (replacedPdf) {
    await deleteBlobBestEffort(existing?.blobPath);
  }

  revalidateEbookPaths();
  return { success: true, data: { id } };
}

export async function deleteEbookAction(id: string): Promise<ActionResult> {
  await requireAdmin(PATHS.admin.ebooks);

  if (!z.uuid().safeParse(id).success) {
    return { success: false, error: "E-book inválido" };
  }

  try {
    const deleted = await deleteEbookById(id);
    if (!deleted) {
      return { success: false, error: "E-book não encontrado" };
    }

    await deleteBlobBestEffort(deleted.coverUrl);
    await deleteBlobBestEffort(deleted.blobPath);

    revalidateEbookPaths();
    revalidatePath(PATHS.profile.ebooks);
    return { success: true, data: undefined };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Falha ao excluir e-book",
    };
  }
}

const checkoutIdsSchema = z.array(z.string().min(1).max(120)).min(1).max(20);

export async function startCheckoutAction(
  ebookIds: string[],
): Promise<ActionResult<{ url: string }>> {
  const session = await requireSession(PATHS.shop);
  const idsParsed = checkoutIdsSchema.safeParse(ebookIds);
  if (!idsParsed.success) {
    return { success: false, error: "Carrinho inválido" };
  }

  const items = [];
  for (const id of idsParsed.data) {
    const row = await findEbookInDb(id);
    if (!row || !row.active) {
      return {
        success: false,
        error: "Um ou mais e-books do carrinho não estão disponíveis para compra",
      };
    }
    if (!z.uuid().safeParse(row.id).success) {
      return {
        success: false,
        error: "Um ou mais e-books do carrinho não estão disponíveis para compra",
      };
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
      successUrl: `${baseUrl}${PATHS.profile.ebooks}?checkout=success`,
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
  const session = await requireSession(PATHS.profile.ebooks);
  if (!z.uuid().safeParse(ebookId).success) {
    return { success: false, error: "E-book inválido" };
  }
  const owns = await userOwnsEbook(session.user.id, ebookId);
  if (!owns) {
    return { success: false, error: "Sem permissão para este e-book" };
  }

  const row = await findEbookInDb(ebookId);
  if (!row?.blobPath) {
    return { success: false, error: "Arquivo ainda não disponível" };
  }

  return { success: true, data: { url: PATHS.api.ebookDownload(row.id) } };
}
