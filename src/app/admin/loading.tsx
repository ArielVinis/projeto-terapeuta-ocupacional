import { Skeleton } from "@/src/components/ui/skeleton"

export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="flex flex-col gap-3">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
      </div>
    </div>
  )
}
