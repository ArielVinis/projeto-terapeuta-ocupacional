import { Skeleton } from "@/src/components/ui/skeleton"

export default function MeusEbooksLoading() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto flex max-w-3xl flex-col gap-8">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-2xl border border-border p-4"
            >
              <Skeleton className="size-16 shrink-0 rounded-lg" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Skeleton className="h-5 w-48 max-w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-9 w-20 shrink-0 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
