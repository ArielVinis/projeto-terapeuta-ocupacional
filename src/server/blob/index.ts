import { env } from "@/src/env";
import { del, put } from "@vercel/blob";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";

const MAX_COVER_BYTES = 8 * 1024 * 1024;
const MAX_PDF_BYTES = 20 * 1024 * 1024;

function sanitizePdfFilename(filename: string): string {
  const base = filename.replace(/\\/g, "/").split("/").pop() ?? "ebook.pdf";
  const lower = base.toLowerCase();
  const withoutExt = lower.endsWith(".pdf") ? lower.slice(0, -4) : lower;
  const cleaned = withoutExt.replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "ebook";
  return `${cleaned}.pdf`;
}

export async function uploadEbookCover(file: File | Blob) {
  if (!env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }
  if (file.size > MAX_COVER_BYTES) {
    throw new Error("Capa muito grande (máx. 8 MB)");
  }

  const input = Buffer.from(await file.arrayBuffer());
  const webp = await sharp(input)
    .rotate()
    .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  return put(`covers/${Date.now()}.webp`, webp, {
    access: "public",
    addRandomSuffix: true,
    contentType: "image/webp",
    token: env.BLOB_READ_WRITE_TOKEN,
  });
}

export async function compressPdfBuffer(input: Buffer) {
  const pdf = await PDFDocument.load(input, { ignoreEncryption: true });
  const bytes = await pdf.save({ useObjectStreams: true });
  return Buffer.from(bytes);
}

export async function uploadEbookPdf(filename: string, file: File | Blob) {
  if (!env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }
  if (file.size > MAX_PDF_BYTES) {
    throw new Error("PDF muito grande (máx. 20 MB)");
  }

  const raw = Buffer.from(await file.arrayBuffer());
  let compressed: Buffer;
  try {
    compressed = await compressPdfBuffer(raw);
  } catch {
    compressed = raw;
  }

  if (compressed.length > MAX_PDF_BYTES) {
    throw new Error("PDF muito grande após compressão (máx. 20 MB)");
  }

  const safeName = sanitizePdfFilename(filename);
  return put(`ebooks/${safeName}`, compressed, {
    access: "private",
    addRandomSuffix: true,
    contentType: "application/pdf",
    token: env.BLOB_READ_WRITE_TOKEN,
  });
}

export async function deleteEbookPdf(url: string) {
  if (!env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }

  await del(url, { token: env.BLOB_READ_WRITE_TOKEN });
}

/** Best-effort delete for capa/PDF antigos — não propaga erro. */
export async function deleteBlobBestEffort(url: string | null | undefined) {
  if (!url || !env.BLOB_READ_WRITE_TOKEN) return;
  if (!url.includes("blob.vercel-storage.com") && !url.includes("public.blob.vercel-storage.com")) {
    return;
  }
  try {
    await del(url, { token: env.BLOB_READ_WRITE_TOKEN });
  } catch {
    // ignore
  }
}
