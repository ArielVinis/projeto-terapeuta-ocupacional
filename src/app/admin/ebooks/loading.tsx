import { Skeleton } from "@/src/components/ui/skeleton"

export default function AdminEbooksLoading() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-9 w-40" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  )
}
