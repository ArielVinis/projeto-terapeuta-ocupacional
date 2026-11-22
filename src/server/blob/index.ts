import { env } from "@/src/env";
import { del, put } from "@vercel/blob";

export async function uploadEbookPdf(filename: string, file: File | Blob) {
  if (!env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }

  return put(`ebooks/${filename}`, file, {
    access: "private",
    addRandomSuffix: true,
    token: env.BLOB_READ_WRITE_TOKEN,
  });
}

export async function deleteEbookPdf(url: string) {
  if (!env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }

  await del(url, { token: env.BLOB_READ_WRITE_TOKEN });
}
