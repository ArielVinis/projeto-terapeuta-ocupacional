"use client"

import { useId, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { FileIcon, ImageIcon } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Spinner } from "@/src/components/ui/spinner"
import { saveEbookAction } from "@/src/server/actions/ebooks"

export type EbookFormInitial = {
  id?: string
  slug?: string
  title?: string
  description?: string
  priceReais?: string
  coverUrl?: string
  active?: boolean
}

function FilePicker({
  name,
  accept,
  label,
  icon: Icon,
}: {
  name: string
  accept: string
  label: string
  icon: typeof FileIcon
}) {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          setFileName(event.target.files?.[0]?.name ?? null)
        }}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          onClick={() => inputRef.current?.click()}
        >
          <Icon data-icon="inline-start" />
          {label}
        </Button>
        <span className="text-sm text-muted-foreground truncate max-w-full">
          {fileName ?? "Nenhum arquivo escolhido"}
        </span>
      </div>
    </div>
  )
}

export function AdminEbookForm({
  initial,
  onSuccess,
}: {
  initial?: EbookFormInitial
  onSuccess?: () => void
}) {
  const router = useRouter()
  const [message, setMessage] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        startTransition(async () => {
          const result = await saveEbookAction(formData)
          if (result.success) {
            setMessage(`Salvo (${result.data.id})`)
            router.refresh()
            onSuccess?.()
          } else {
            setMessage(result.error)
          }
        })
      }}
    >
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}
      <label className="text-sm flex flex-col gap-1">
        Slug
        <input
          name="slug"
          required
          defaultValue={initial?.slug}
          className="h-10 rounded-lg border border-border px-3 bg-background"
        />
      </label>
      <label className="text-sm flex flex-col gap-1">
        Título
        <input
          name="title"
          required
          defaultValue={initial?.title}
          className="h-10 rounded-lg border border-border px-3 bg-background"
        />
      </label>
      <label className="text-sm flex flex-col gap-1">
        Descrição
        <textarea
          name="description"
          required
          defaultValue={initial?.description}
          className="min-h-24 rounded-lg border border-border px-3 py-2 bg-background"
        />
      </label>
      <label className="text-sm flex flex-col gap-1">
        Preço (R$)
        <input
          name="priceReais"
          type="number"
          step="0.01"
          min="0.5"
          required
          defaultValue={initial?.priceReais ?? "37"}
          className="h-10 rounded-lg border border-border px-3 bg-background"
        />
      </label>
      <div className="text-sm flex flex-col gap-1">
        <span>Capa (imagem → WebP)</span>
        <FilePicker
          name="cover"
          accept="image/*"
          label="Escolher imagem"
          icon={ImageIcon}
        />
      </div>
      {initial?.coverUrl ? (
        <p className="text-xs text-muted-foreground truncate">
          Capa atual: {initial.coverUrl}
        </p>
      ) : null}
      <label className="text-sm flex flex-col gap-1">
        Capa (URL alternativa)
        <input
          name="coverUrl"
          defaultValue={initial?.coverUrl}
          className="h-10 rounded-lg border border-border px-3 bg-background"
        />
      </label>
      <div className="text-sm flex flex-col gap-1">
        <span>PDF (compactado no servidor)</span>
        <FilePicker
          name="pdf"
          accept="application/pdf"
          label="Escolher PDF"
          icon={FileIcon}
        />
      </div>
      <label className="text-sm flex items-center gap-2">
        <input
          name="active"
          type="checkbox"
          value="true"
          defaultChecked={initial?.active ?? true}
        />
        Ativo
      </label>
      <Button type="submit" disabled={pending} className="rounded-full">
        {pending ? <Spinner data-icon="inline-start" /> : null}
        {pending ? "Salvando..." : initial?.id ? "Atualizar" : "Criar e-book"}
      </Button>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </form>
  )
}
