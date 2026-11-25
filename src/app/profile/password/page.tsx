import { PATHS } from "@/src/constants/paths"
import { requireSession } from "@/src/server/auth/session"
import { ChangePasswordForm } from "./change-password-form"

export default async function ChangePasswordPage() {
  await requireSession(PATHS.profile.password)

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <ChangePasswordForm />
    </main>
  )
}
