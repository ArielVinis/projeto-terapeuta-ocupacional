import Link from "next/link"
import { PATHS } from "@/src/constants/paths"

export function ResetPasswordError({ message }: { message: string }) {
  return (
    <div className="w-full max-w-md bg-card rounded-2xl p-8 vivi-shadow">
      <h1 className="font-serif text-3xl mb-2">Redefinir senha</h1>
      <p role="alert" className="text-sm text-destructive mb-8">
        {message}
      </p>

      <Link
        href={PATHS.auth.forgotPassword}
        className="flex h-11 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium"
      >
        Pedir novo link
      </Link>

      <p className="mt-6 text-sm text-muted-foreground text-center">
        <Link href={PATHS.auth.login} className="text-primary hover:underline">
          Voltar para login
        </Link>
      </p>
    </div>
  )
}
