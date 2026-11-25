import Image from "next/image"
import Link from "next/link"
import { BookOpenIcon } from "lucide-react"
import { PATHS } from "@/src/constants/paths"
import { Button } from "@/src/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/src/components/ui/empty"
import { requireSession } from "@/src/server/auth/session"
import { listUserEntitlements } from "@/src/server/ebook/queries"
import { DownloadButton } from "./download-button"

export default async function MeusEbooksPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>
}) {
  const session = await requireSession(PATHS.profile.ebooks)
  const params = await searchParams

  let items: Awaited<ReturnType<typeof listUserEntitlements>> = []
  try {
    items = await listUserEntitlements(session.user.id)
  } catch {
    items = []
  }

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="max-w-3xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-serif text-4xl mb-2">Meus e-books</h1>
            <p className="text-muted-foreground">
              Olá, {session.user.name}. Seus downloads aparecem aqui após o
              pagamento.
            </p>
            {params.checkout === "success" && (
              <p className="mt-3 text-sm text-primary">
                Pagamento recebido. Se o e-book ainda não aparecer, aguarde
                alguns segundos e atualize a página.
              </p>
            )}
          </div>
          <Link
            href={PATHS.profile.password}
            className="text-sm text-primary hover:underline shrink-0"
          >
            Alterar senha
          </Link>
        </div>

        {items.length === 0 ? (
          <Empty className="border border-dashed border-border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BookOpenIcon />
              </EmptyMedia>
              <EmptyTitle>Ainda sem e-books</EmptyTitle>
              <EmptyDescription>
                Seus downloads aparecem aqui depois do pagamento.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button render={<Link href={PATHS.shop} />}>Ir para a loja</Button>
            </EmptyContent>
          </Empty>
        ) : (
          <ul className="flex flex-col gap-4">
            {items.map((item) => (
              <li
                key={item.purchaseItemId}
                className="flex gap-4 items-center rounded-2xl border border-border p-4"
              >
                <div className="relative size-16 rounded-lg overflow-hidden bg-muted shrink-0">
                  <Image
                    src={item.coverUrl || "/placeholder.svg"}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-medium truncate">{item.title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <DownloadButton ebookId={item.ebookId} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
