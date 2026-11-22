import { Skeleton } from "@/src/components/ui/skeleton"

export default function ProductLoading() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-11 w-48 rounded-full" />
        </div>
      </div>
    </main>
  )
}
