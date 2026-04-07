"use client"

import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  diseases,
  formatNumber,
  generateTimeSeriesData,
  vaccinationByRegion,
} from "@/lib/health-data"

interface DiseaseChartsProps {
  dateRange: { start: Date; end: Date }
}

export function DiseaseCharts({ dateRange }: DiseaseChartsProps) {
  const timeSeriesData = useMemo(() => {
    return generateTimeSeriesData(dateRange.start, dateRange.end)
  }, [dateRange.start, dateRange.end])

  const barChartData = diseases.map((d) => ({
    name: d.name,
    casos: d.cases,
    recuperados: d.recoveries,
    obitos: d.deaths,
  }))

  const formatXAxis = (value: string) => {
    const date = new Date(value)
    return date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })
  }

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
    if (!active || !payload) return null

    return (
      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
        <p className="mb-2 font-medium text-foreground">
          {label
            ? new Date(label).toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
              })
            : ""}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium text-foreground">
              {formatNumber(entry.value)}
            </span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Evolução Temporal de Casos</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dengue" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dengue">Dengue</TabsTrigger>
              <TabsTrigger value="hiv">HIV</TabsTrigger>
              <TabsTrigger value="malaria">Malária</TabsTrigger>
              <TabsTrigger value="all">Todos</TabsTrigger>
            </TabsList>

            <TabsContent value="dengue" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatXAxis}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="dengue"
                    name="Dengue"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="hiv" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatXAxis}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="hiv"
                    name="HIV/AIDS"
                    stroke="hsl(var(--chart-5))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="malaria" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatXAxis}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="malaria"
                    name="Malária"
                    stroke="hsl(var(--chart-4))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="all" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatXAxis}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="dengue"
                    name="Dengue"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="hiv"
                    name="HIV/AIDS"
                    stroke="hsl(var(--chart-5))"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="malaria"
                    name="Malária"
                    stroke="hsl(var(--chart-4))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Comparativo por Doença</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[380px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  type="number"
                  tickFormatter={(v) =>
                    v >= 1000000
                      ? `${(v / 1000000).toFixed(1)}M`
                      : `${(v / 1000).toFixed(0)}k`
                  }
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  width={70}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="casos"
                  name="Casos"
                  fill="hsl(var(--chart-1))"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="recuperados"
                  name="Recuperados"
                  fill="hsl(var(--chart-2))"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="obitos"
                  name="Óbitos"
                  fill="hsl(var(--chart-3))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Cobertura Vacinal por Região</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vaccinationByRegion}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="region"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 100]}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || !payload[0]) return null
                    const data = vaccinationByRegion.find(
                      (v) => v.region === label
                    )
                    return (
                      <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                        <p className="mb-2 font-medium text-foreground">{label}</p>
                        <p className="text-sm text-muted-foreground">
                          Cobertura:{" "}
                          <span className="font-medium text-foreground">
                            {data?.coverage}%
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Doses:{" "}
                          <span className="font-medium text-foreground">
                            {formatNumber(data?.doses || 0)}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Meta:{" "}
                          <span className="font-medium text-foreground">
                            {formatNumber(data?.target || 0)}
                          </span>
                        </p>
                      </div>
                    )
                  }}
                />
                <Bar
                  dataKey="coverage"
                  name="Cobertura"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
