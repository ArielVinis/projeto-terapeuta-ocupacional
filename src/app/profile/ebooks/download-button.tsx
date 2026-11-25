"use client"

import { useTransition } from "react"
import { Button } from "@/src/components/ui/button"
import { Spinner } from "@/src/components/ui/spinner"
import { getDownloadUrlAction } from "@/src/server/actions/ebooks"

export function DownloadButton({ ebookId }: { ebookId: string }) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      type="button"
      disabled={pending}
      className="shrink-0 rounded-full"
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
      {pending ? <Spinner data-icon="inline-start" /> : null}
      {pending ? "Baixando..." : "Baixar"}
    </Button>
  )
}
