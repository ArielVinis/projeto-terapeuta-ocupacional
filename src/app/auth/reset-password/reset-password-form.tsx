"use client"

import { useState, type SubmitEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { PATHS } from "@/src/constants/paths"
import { authClient } from "@/src/server/auth/client"

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const form = new FormData(event.currentTarget)
    const newPassword = String(form.get("newPassword") ?? "")
    const confirmPassword = String(form.get("confirmPassword") ?? "")

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem")
      setLoading(false)
      return
    }

    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword,
        token,
      })

      if (resetError) {
        setError(resetError.message ?? "Não foi possível redefinir a senha")
        setLoading(false)
        return
      }

      router.push(PATHS.auth.login)
      router.refresh()
    } catch {
      setError("Erro inesperado")
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-card rounded-2xl p-8 vivi-shadow">
      <h1 className="font-serif text-3xl mb-2">Redefinir senha</h1>
      <p className="text-sm text-muted-foreground mb-8">Digite sua nova senha.</p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Nova senha
          <span className="relative block">
            <input
              name="newPassword"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              className="h-11 w-full rounded-xl border border-border bg-background px-3 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </span>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Confirmar senha
          <span className="relative block">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
              className="h-11 w-full rounded-xl border border-border bg-background px-3 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
              aria-label={
                showConfirmPassword
                  ? "Ocultar confirmação de senha"
                  : "Mostrar confirmação de senha"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </span>
        </label>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-11 rounded-full bg-primary text-primary-foreground font-medium disabled:opacity-60"
        >
          {loading ? "Aguarde..." : "Redefinir senha"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground text-center">
        <Link href={PATHS.auth.login} className="text-primary hover:underline">
          Voltar para login
        </Link>
      </p>
    </div>
  )
}
