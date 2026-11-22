"use client"

import { useTransition } from "react"
import { getDownloadUrlAction } from "@/src/server/actions/ebooks"

export function DownloadButton({ ebookId }: { ebookId: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      disabled={pending}
      className="shrink-0 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm disabled:opacity-60"
      onClick={() => {
        startTransition(async () => {
          const result = await getDownloadUrlAction(ebookId)
          if (result.success) {
            window.open(result.data.url, "_blank", "noopener,noreferrer")
          } else {
            alert(result.error)
          }
        })
      }}
    >
      {pending ? "..." : "Baixar"}
    </button>
  )
}
