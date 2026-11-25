import { PATHS } from "@/src/constants/paths";
import { env } from "@/src/env";
import { getSession } from "@/src/server/auth/session";
import { findEbookInDb, userOwnsEbook } from "@/src/server/ebook/queries";
import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    return NextResponse.redirect(
      new URL(
        `${PATHS.auth.login}?callbackUrl=${encodeURIComponent(PATHS.profile.ebooks)}`,
        env.appUrl,
      ),
    );
  }

  const { id } = await params;
  if (!z.uuid().safeParse(id).success) {
    return NextResponse.json({ error: "E-book inválido" }, { status: 400 });
  }
  const owns = await userOwnsEbook(session.user.id, id);
  if (!owns) {
    return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
  }

  const row = await findEbookInDb(id);
  if (!row?.blobPath) {
    return NextResponse.json({ error: "Arquivo indisponível" }, { status: 404 });
  }

  if (!env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Blob não configurado" }, { status: 500 });
  }

  const result = await get(row.blobPath, {
    access: "private",
    token: env.BLOB_READ_WRITE_TOKEN,
  });

  if (!result || result.statusCode !== 200 || !result.stream) {
    return NextResponse.json({ error: "Arquivo não encontrado" }, { status: 404 });
  }

  const filename = `${row.slug || id}.pdf`;
  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType ?? "application/pdf",
      "Content-Disposition": result.blob.contentDisposition || `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
