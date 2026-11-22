import { Suspense } from "react"
import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <Suspense fallback={<div className="text-muted-foreground">A carregar…</div>}>
        <LoginForm />
      </Suspense>
    </main>
  )
}
