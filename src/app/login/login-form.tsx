"use client"

import { useState, type SubmitEvent } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { PATHS } from "@/src/constants/paths"
import { safeCallbackUrl } from "@/src/lib/safe-callback-url"
import { authClient } from "@/src/server/auth/client"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawCallback = searchParams.get("callbackUrl")
  const callbackUrl = safeCallbackUrl(rawCallback)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<"login" | "register">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  function postLoginPath(user?: { role?: string | null } | null) {
    if (rawCallback) return callbackUrl
    return user?.role === "admin" ? PATHS.admin.root : PATHS.meusEbooks
  }

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)
    const form = new FormData(event.currentTarget)
    const email = String(form.get("email") ?? "")
    const password = String(form.get("password") ?? "")
    const confirmPassword = String(form.get("confirmPassword") ?? "")
    const name = String(form.get("name") ?? "")

    try {
      if (mode === "register") {
        if (password !== confirmPassword) {
          setError("As senhas não coincidem")
          setLoading(false)
          return
        }
        const result = await authClient.signUp.email({ email, password, name })
        if (result.error) {
          setError(result.error.message ?? "Falha no cadastro")
          setLoading(false)
          return
        }
        router.push(postLoginPath(result.data?.user as { role?: string } | undefined))
      } else {
        const result = await authClient.signIn.email({ email, password })
        if (result.error) {
          setError(result.error.message ?? "Falha no login")
          setLoading(false)
          return
        }
        router.push(postLoginPath(result.data?.user as { role?: string } | undefined))
      }
      router.refresh()
    } catch {
      setError("Erro inesperado")
      setLoading(false)
    }
  }

  async function signInGoogle() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: rawCallback
        ? callbackUrl
        : PATHS.meusEbooks,
    })
  }

  return (
    <div className="w-full max-w-md bg-card rounded-2xl p-8 vivi-shadow">
      <h1 className="font-serif text-3xl mb-2">
        {mode === "login" ? "Entrar" : "Criar conta"}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        Login obrigatório para comprar e baixar e-books.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {mode === "register" && (
          <label className="flex flex-col gap-1 text-sm">
            Nome
            <input
              name="name"
              required
              className="h-11 rounded-xl border border-border bg-background px-3"
            />
          </label>
        )}
        <label className="flex flex-col gap-1 text-sm">
          E-mail
          <input
            name="email"
            type="email"
            required
            className="h-11 rounded-xl border border-border bg-background px-3"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Senha
          <span className="relative block">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete={
                mode === "register" ? "new-password" : "current-password"
              }
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

        {mode === "register" && (
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
        )}

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
          {loading
            ? "Aguarde..."
            : mode === "login"
              ? "Entrar"
              : "Criar conta"}
        </button>
      </form>

      <button
        type="button"
        onClick={signInGoogle}
        className="mt-4 w-full h-11 rounded-full border border-border font-medium hover:bg-muted"
      >
        Continuar com Google
      </button>

      <p className="mt-6 text-sm text-muted-foreground text-center">
        {mode === "login" ? "Não tem conta?" : "Já tem conta?"}{" "}
        <button
          type="button"
          className="text-primary hover:underline"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Registre-se" : "Entrar"}
        </button>
      </p>

      <p className="mt-4 text-xs text-center text-muted-foreground">
        Ao continuar, você aceita os{" "}
        <Link href={PATHS.termos} className="underline">
          Termos
        </Link>{" "}
        e a{" "}
        <Link href={PATHS.privacidade} className="underline">
          Privacidade
        </Link>
        .
      </p>
    </div>
  )
}
