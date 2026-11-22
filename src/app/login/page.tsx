import { Suspense } from "react"
import { redirect } from "next/navigation"
import { safeCallbackUrl } from "@/src/lib/safe-callback-url"
import { Skeleton } from "@/src/components/ui/skeleton"
import { getSession, loggedInHomePath } from "@/src/server/auth/session"
import { LoginForm } from "./login-form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const session = await getSession()
  if (session) {
    const params = await searchParams
    const fallback = loggedInHomePath(session)
    redirect(safeCallbackUrl(params.callbackUrl, fallback))
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <Suspense
        fallback={
          <div className="w-full max-w-sm flex flex-col gap-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  )
}
