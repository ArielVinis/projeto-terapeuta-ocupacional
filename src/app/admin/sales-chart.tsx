"use client"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/src/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

const chartConfig = {
  revenue: {
    label: "Receita (R$)",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function SalesChart({
  series,
}: {
  series: Array<{ label: string; amountCents: number; count: number }>
}) {
  const data = series.map((row) => ({
    label: row.label,
    revenue: Math.round(row.amountCents) / 100,
    count: row.count,
  }))

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
      <BarChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={48}
          tickFormatter={(value) => `R$${value}`}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value, _name, item) => (
                <div className="flex flex-col gap-0.5">
                  <span>R$ {Number(value).toFixed(2)}</span>
                  <span className="text-muted-foreground">
                    {item.payload.count} venda(s)
                  </span>
                </div>
              )}
            />
          }
        />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={6} />
      </BarChart>
    </ChartContainer>
  )
}
