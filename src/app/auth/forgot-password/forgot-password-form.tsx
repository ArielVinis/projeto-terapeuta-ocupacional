"use client"

import { useState, type SubmitEvent } from "react"
import Link from "next/link"
import { PATHS } from "@/src/constants/paths"
import { authClient } from "@/src/server/auth/client"

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const formElement = event.currentTarget
    const form = new FormData(formElement)
    const email = String(form.get("email") ?? "").trim()

    try {
      const { error: resetError } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}${PATHS.auth.resetPassword}`,
      })

      if (resetError) {
        setError(resetError.message ?? "Não foi possível enviar o e-mail")
        setLoading(false)
        return
      }

      setSuccess(
        "Se o e-mail existir, você receberá um link para redefinir sua senha.",
      )
      formElement.reset()
      setLoading(false)
    } catch {
      setError("Erro inesperado")
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-card rounded-2xl p-8 vivi-shadow">
      <h1 className="font-serif text-3xl mb-2">Esqueceu a senha?</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Digite seu e-mail para receber o link de redefinição.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          E-mail
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="h-11 rounded-xl border border-border bg-background px-3"
          />
        </label>

        <p className="text-sm text-muted-foreground">
          Se o e-mail existir, enviaremos as instruções para redefinir sua senha.
        </p>

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
          {loading ? "Aguarde..." : "Enviar link de redefinição"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground text-center">
        Lembrou da senha?{" "}
        <Link href={PATHS.auth.login} className="text-primary hover:underline">
          Voltar para login
        </Link>
      </p>
    </div>
  )
}
