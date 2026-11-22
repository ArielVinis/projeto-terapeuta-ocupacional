import Link from "next/link"
import { ADMIN_PERIODS, type AdminPeriod } from "@/src/server/admin/stats"
import { cn } from "@/src/lib/utils"

export function PeriodFilter({
  basePath,
  period,
}: {
  basePath: string
  period: AdminPeriod
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {ADMIN_PERIODS.map((days) => (
        <Link
          key={days}
          href={`${basePath}?period=${days}`}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm transition-colors",
            period === days
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-muted-foreground hover:text-foreground",
          )}
        >
          {days} dias
        </Link>
      ))}
    </div>
  )
}
