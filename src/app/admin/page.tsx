import { PATHS } from "@/src/constants/paths"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card"
import { getSalesStats, parseAdminPeriod } from "@/src/server/admin/stats"
import { PeriodFilter } from "./period-filter"
import { SalesChart } from "./sales-chart"

function formatBrl(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>
}) {
  const params = await searchParams
  const period = parseAdminPeriod(params.period)

  let stats = {
    revenueCents: 0,
    salesCount: 0,
    averageTicketCents: 0,
    series: [] as Awaited<ReturnType<typeof getSalesStats>>["series"],
  }
  try {
    stats = await getSalesStats(period)
  } catch {
    // DB offline
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Acompanhe as vendas dos e-books por período.
          </p>
        </div>
        <PeriodFilter basePath={PATHS.admin.root} period={period} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Receita</CardDescription>
            <CardTitle className="text-2xl">{formatBrl(stats.revenueCents)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Vendas</CardDescription>
            <CardTitle className="text-2xl">{stats.salesCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Ticket médio</CardDescription>
            <CardTitle className="text-2xl">
              {formatBrl(stats.averageTicketCents)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Receita diária</CardTitle>
          <CardDescription>Últimos {period} dias</CardDescription>
        </CardHeader>
        <CardContent>
          <SalesChart series={stats.series} />
        </CardContent>
      </Card>
    </>
  )
}
