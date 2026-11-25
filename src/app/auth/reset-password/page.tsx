import { resolveResetPasswordPageState } from "@/src/lib/reset-password-page-state"
import { ResetPasswordError } from "./reset-password-error"
import { ResetPasswordForm } from "./reset-password-form"

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[]; error?: string | string[] }>
}) {
  const params = await searchParams
  const token = firstParam(params.token)
  const error = firstParam(params.error)
  const state = resolveResetPasswordPageState(token, error)

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      {state.kind === "error" ? (
        <ResetPasswordError message={state.message} />
      ) : (
        <ResetPasswordForm token={state.token} />
      )}
    </main>
  )
}

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0]
  return value
}
