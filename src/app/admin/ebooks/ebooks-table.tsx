"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Trash2Icon } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet"
import { Spinner } from "@/src/components/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { deleteEbookAction } from "@/src/server/actions/ebooks"
import { AdminEbookForm, type EbookFormInitial } from "../admin-ebook-form"

export type EbookRow = {
  id: string
  slug: string
  title: string
  description: string
  priceCents: number
  coverUrl: string | null
  active: boolean
  updatedAt: Date | string
}

export function EbooksTable({ ebooks }: { ebooks: EbookRow[] }) {
  const router = useRouter()
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<EbookFormInitial | null>(null)
  const [deleting, setDeleting] = useState<EbookRow | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function confirmDelete() {
    if (!deleting) return
    const id = deleting.id
    setDeleteError(null)
    startTransition(async () => {
      const result = await deleteEbookAction(id)
      if (result.success) {
        setDeleting(null)
        if (editing?.id === id) setEditing(null)
        router.refresh()
      } else {
        setDeleteError(result.error)
      }
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button className="rounded-full" onClick={() => setCreateOpen(true)}>
          Novo e-book
        </Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Capa</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Atualizado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ebooks.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="relative size-12 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={item.coverUrl || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized={Boolean(item.coverUrl?.includes("blob.vercel-storage.com"))}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium max-w-48 truncate">
                  {item.title}
                </TableCell>
                <TableCell className="text-muted-foreground">{item.slug}</TableCell>
                <TableCell>
                  R$ {(item.priceCents / 100).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge variant={item.active ? "default" : "secondary"}>
                    {item.active ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground whitespace-nowrap">
                  {new Date(item.updatedAt).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditing({
                          id: item.id,
                          slug: item.slug,
                          title: item.title,
                          description: item.description,
                          priceReais: (item.priceCents / 100).toString(),
                          coverUrl: item.coverUrl ?? "",
                          active: item.active,
                        })
                      }
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setDeleteError(null)
                        setDeleting(item)
                      }}
                    >
                      <Trash2Icon data-icon="inline-start" />
                      Excluir
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Sheet open={createOpen} onOpenChange={setCreateOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Novo e-book</SheetTitle>
            <SheetDescription>
              A capa é convertida para WebP e o PDF é compactado no servidor.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-4">
            <AdminEbookForm onSuccess={() => setCreateOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <SheetContent className="overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Editar e-book</SheetTitle>
            <SheetDescription>
              Atualize os dados, a capa ou o PDF deste e-book.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-4">
            {editing ? (
              <AdminEbookForm
                key={editing.id}
                initial={editing}
                onSuccess={() => setEditing(null)}
              />
            ) : null}
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open && !pending) {
            setDeleting(null)
            setDeleteError(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir e-book?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso remove permanentemente &quot;{deleting?.title}&quot; da loja,
              apaga a capa e o PDF no armazenamento e remove o acesso de quem já
              comprou este título. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError ? (
            <p className="text-sm text-destructive">{deleteError}</p>
          ) : null}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={pending}
              onClick={(event) => {
                event.preventDefault()
                confirmDelete()
              }}
            >
              {pending ? <Spinner data-icon="inline-start" /> : null}
              {pending ? "Excluindo..." : "Excluir tudo"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
