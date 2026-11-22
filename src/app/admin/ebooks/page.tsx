import { BookOpenIcon } from "lucide-react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/src/components/ui/empty"
import { listAllEbooksAdmin } from "@/src/server/ebook/queries"
import { EbooksTable } from "./ebooks-table"

export default async function AdminEbooksPage() {
  let ebooks: Awaited<ReturnType<typeof listAllEbooksAdmin>> = []
  try {
    ebooks = await listAllEbooksAdmin()
  } catch {
    ebooks = []
  }

  return (
    <>
      <div>
        <h1 className="font-serif text-3xl mb-2">E-books</h1>
        <p className="text-muted-foreground">
          Gerencie o catálogo, capas WebP e PDFs.
        </p>
      </div>

      {ebooks.length === 0 ? (
        <div className="flex flex-col gap-4">
          <Empty className="border border-dashed border-border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BookOpenIcon />
              </EmptyMedia>
              <EmptyTitle>Nenhum e-book na base</EmptyTitle>
              <EmptyDescription>
                Crie o primeiro e-book para aparecer na loja.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent />
          </Empty>
          <EbooksTable ebooks={[]} />
        </div>
      ) : (
        <EbooksTable
          ebooks={ebooks.map((item) => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
            description: item.description,
            priceCents: item.priceCents,
            coverUrl: item.coverUrl,
            active: item.active,
            updatedAt: item.updatedAt,
          }))}
        />
      )}
    </>
  )
}
