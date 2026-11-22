"use client"

import { useState, useTransition } from "react"
import { saveEbookAction } from "@/src/server/actions/ebooks"

type Initial = {
  id?: string
  slug?: string
  title?: string
  description?: string
  priceReais?: string
  coverUrl?: string
  active?: boolean
}

export function AdminEbookForm({ initial }: { initial?: Initial }) {
  const [message, setMessage] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  return (
    <form
      className="flex flex-col gap-3 rounded-xl border border-border p-4 bg-card"
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        startTransition(async () => {
          const result = await saveEbookAction(formData)
          setMessage(
            result.success
              ? `Guardado (${result.data.id})`
              : result.error,
          )
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
      <label className="text-sm flex flex-col gap-1">
        Capa (URL)
        <input
          name="coverUrl"
          defaultValue={initial?.coverUrl}
          className="h-10 rounded-lg border border-border px-3 bg-background"
        />
      </label>
      <label className="text-sm flex flex-col gap-1">
        PDF
        <input name="pdf" type="file" accept="application/pdf" />
      </label>
      <label className="text-sm flex items-center gap-2">
        <input
          name="active"
          type="checkbox"
          value="true"
          defaultChecked={initial?.active ?? true}
        />
        Ativo
      </label>
      <button
        type="submit"
        disabled={pending}
        className="h-10 rounded-full bg-primary text-primary-foreground disabled:opacity-60"
      >
        {pending ? "A guardar..." : initial?.id ? "Atualizar" : "Criar e-book"}
      </button>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </form>
  )
}
