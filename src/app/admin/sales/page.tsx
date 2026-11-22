import { ReceiptIcon } from "lucide-react"
import { PATHS } from "@/src/constants/paths"
import { Badge } from "@/src/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/src/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table"
import { listSalesAdmin, parseAdminPeriod } from "@/src/server/admin/stats"
import { PeriodFilter } from "../period-filter"

function formatBrl(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

export default async function AdminSalesPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>
}) {
  const params = await searchParams
  const period = parseAdminPeriod(params.period)

  let sales: Awaited<ReturnType<typeof listSalesAdmin>> = []
  try {
    sales = await listSalesAdmin(period)
  } catch {
    sales = []
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl mb-2">Vendas</h1>
          <p className="text-muted-foreground">
            Compras pagas via Stripe nos últimos {period} dias.
          </p>
        </div>
        <PeriodFilter basePath={PATHS.admin.sales} period={period} />
      </div>

      {sales.length === 0 ? (
        <Empty className="border border-dashed border-border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ReceiptIcon />
            </EmptyMedia>
            <EmptyTitle>Sem vendas neste período</EmptyTitle>
            <EmptyDescription>
              Quando houver checkouts pagos, eles aparecerão aqui.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>E-books</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="whitespace-nowrap">
                    {sale.createdAt.toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{sale.userName}</span>
                      <span className="text-muted-foreground text-xs">
                        {sale.userEmail}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-64">
                    {sale.items.length
                      ? sale.items.map((item) => item.title).join(", ")
                      : "—"}
                  </TableCell>
                  <TableCell>{formatBrl(sale.amountCents)}</TableCell>
                  <TableCell>
                    <Badge>{sale.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  )
}
