"use client"

import { useState, type SubmitEvent } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { PATHS } from "@/src/constants/paths"
import { authClient } from "@/src/server/auth/client"

export function ChangePasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const formElement = event.currentTarget
    const form = new FormData(formElement)
    const currentPassword = String(form.get("currentPassword") ?? "")
    const newPassword = String(form.get("newPassword") ?? "")
    const confirmPassword = String(form.get("confirmPassword") ?? "")

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem")
      setLoading(false)
      return
    }

    if (newPassword === currentPassword) {
      setError("A nova senha deve ser diferente da atual")
      setLoading(false)
      return
    }

    try {
      const { error: changeError } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      })

      if (changeError) {
        setError(changeError.message ?? "Não foi possível alterar a senha")
        setLoading(false)
        return
      }

      formElement.reset()
      setSuccess("Senha alterada com sucesso")
      setLoading(false)
    } catch {
      setError("Erro inesperado")
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-card rounded-2xl p-8 vivi-shadow">
      <h1 className="font-serif text-3xl mb-2">Alterar senha</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Digite a senha atual e escolha uma nova.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <PasswordField
          label="Senha atual"
          name="currentPassword"
          autoComplete="current-password"
          show={showCurrent}
          onToggle={() => setShowCurrent((v) => !v)}
        />
        <PasswordField
          label="Nova senha"
          name="newPassword"
          autoComplete="new-password"
          show={showNew}
          onToggle={() => setShowNew((v) => !v)}
        />
        <PasswordField
          label="Confirmar nova senha"
          name="confirmPassword"
          autoComplete="new-password"
          show={showConfirm}
          onToggle={() => setShowConfirm((v) => !v)}
        />

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        {success && (
          <p role="status" className="text-sm text-foreground">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-11 rounded-full bg-primary text-primary-foreground font-medium disabled:opacity-60"
        >
          {loading ? "Aguarde..." : "Salvar nova senha"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground text-center">
        <Link
          href={PATHS.profile.ebooks}
          className="text-primary hover:underline"
        >
          Voltar para meus e-books
        </Link>
      </p>
    </div>
  )
}

function PasswordField({
  label,
  name,
  autoComplete,
  show,
  onToggle,
}: {
  label: string
  name: string
  autoComplete: string
  show: boolean
  onToggle: () => void
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label}
      <span className="relative block">
        <input
          name={name}
          type={show ? "text" : "password"}
          required
          minLength={8}
          autoComplete={autoComplete}
          className="h-11 w-full rounded-xl border border-border bg-background px-3 pr-11"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
          aria-label={show ? `Ocultar ${label.toLowerCase()}` : `Mostrar ${label.toLowerCase()}`}
        >
          {show ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </span>
    </label>
  )
}
