import { PATHS } from "@/src/constants/paths"
import { requireAdmin } from "@/src/server/auth/session"
import { listAllEbooksAdmin } from "@/src/server/ebook/queries"
import { AdminEbookForm } from "./admin-ebook-form"

export default async function AdminPage() {
  await requireAdmin(PATHS.admin)
  let ebooks: Awaited<ReturnType<typeof listAllEbooksAdmin>> = []
  try {
    ebooks = await listAllEbooksAdmin()
  } catch {
    ebooks = []
  }

  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        <div>
          <h1 className="font-serif text-4xl mb-2">Admin · E-books</h1>
          <p className="text-muted-foreground">
            Criar e atualizar e-books e PDFs (Vercel Blob).
          </p>
        </div>

        <AdminEbookForm />

        <section className="flex flex-col gap-4">
          <h2 className="font-serif text-2xl">Existentes</h2>
          {ebooks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum e-book na base ainda (ou DB offline).
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {ebooks.map((item) => (
                <li
                  key={item.id}
                  className="rounded-xl border border-border p-4 flex flex-col gap-1"
                >
                  <span className="font-medium">{item.title}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.slug} · R$ {(item.priceCents / 100).toFixed(2)} ·{" "}
                    {item.active ? "ativo" : "inativo"}
                  </span>
                  <AdminEbookForm
                    initial={{
                      id: item.id,
                      slug: item.slug,
                      title: item.title,
                      description: item.description,
                      priceReais: (item.priceCents / 100).toString(),
                      coverUrl: item.coverUrl ?? "",
                      active: item.active,
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
