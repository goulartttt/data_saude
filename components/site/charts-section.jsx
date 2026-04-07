"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { diseaseData, vaccinationData, formatNumber } from "@/lib/health-data"

// Combinar dados mensais para gráfico de linha
const monthlyTrendData = diseaseData.dengue.monthlyData.map((item, index) => ({
  month: item.month,
  dengue: item.cases,
  hiv: diseaseData.hiv.monthlyData[index].cases,
  malaria: diseaseData.malaria.monthlyData[index].cases,
}))

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <p className="mb-2 font-semibold">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatNumber(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function ChartsSection() {
  const [selectedDisease, setSelectedDisease] = useState("all")

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 
            className="mb-3 text-3xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Análise Temporal
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Evolução dos casos e cobertura vacinal ao longo do tempo
          </p>
        </div>

        <Tabs defaultValue="evolucao" className="space-y-6">
          <TabsList className="mx-auto flex w-fit">
            <TabsTrigger value="evolucao">Evolução de Casos</TabsTrigger>
            <TabsTrigger value="vacinacao">Cobertura Vacinal</TabsTrigger>
            <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
          </TabsList>

          {/* Evolução de Casos */}
          <TabsContent value="evolucao">
            <Card>
              <CardHeader>
                <CardTitle>Evolução Mensal de Casos</CardTitle>
                <CardDescription>
                  Número de casos registrados por mês para cada doença
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="month" 
                        className="text-xs"
                        tick={{ fill: 'var(--muted-foreground)' }}
                      />
                      <YAxis 
                        className="text-xs"
                        tick={{ fill: 'var(--muted-foreground)' }}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="dengue"
                        name="Dengue"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="hiv"
                        name="HIV/AIDS"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="malaria"
                        name="Malária"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cobertura Vacinal */}
          <TabsContent value="vacinacao">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cobertura por Região</CardTitle>
                  <CardDescription>
                    Percentual de cobertura vacinal em cada região
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={vaccinationData.byRegion} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          type="number" 
                          domain={[0, 100]}
                          tick={{ fill: 'var(--muted-foreground)' }}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <YAxis 
                          dataKey="region" 
                          type="category" 
                          width={100}
                          tick={{ fill: 'var(--muted-foreground)' }}
                        />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload
                              return (
                                <div className="rounded-lg border bg-background p-3 shadow-lg">
                                  <p className="font-semibold">{data.region}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Cobertura: <span className="font-medium text-foreground">{data.coverage}%</span>
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Doses: <span className="font-medium text-foreground">{formatNumber(data.doses)}</span>
                                  </p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                        <Bar 
                          dataKey="coverage" 
                          name="Cobertura"
                          radius={[0, 4, 4, 0]}
                          fill="var(--primary)"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cobertura por Vacina</CardTitle>
                  <CardDescription>
                    Percentual de cobertura por tipo de vacina
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vaccinationData.byVaccine.map((vaccine) => (
                      <div key={vaccine.name}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-medium">{vaccine.name}</span>
                          <span className={`font-semibold ${
                            vaccine.coverage >= 80 ? 'text-green-600 dark:text-green-400' :
                            vaccine.coverage >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {vaccine.coverage}%
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full transition-all ${
                              vaccine.coverage >= 80 ? 'bg-green-500' :
                              vaccine.coverage >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${vaccine.coverage}%` }}
                          />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatNumber(vaccine.doses)} doses aplicadas
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Comparativo */}
          <TabsContent value="comparativo">
            <Card>
              <CardHeader>
                <CardTitle>Comparativo de Doenças</CardTitle>
                <CardDescription>
                  Total de casos e óbitos por doença no período
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={Object.entries(diseaseData).map(([key, disease]) => ({
                        name: disease.name,
                        casos: disease.cases,
                        obitos: disease.deaths,
                        color: disease.color,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="name"
                        tick={{ fill: 'var(--muted-foreground)' }}
                      />
                      <YAxis 
                        yAxisId="left"
                        tick={{ fill: 'var(--muted-foreground)' }}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        tick={{ fill: 'var(--muted-foreground)' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar 
                        yAxisId="left"
                        dataKey="casos" 
                        name="Casos"
                        fill="var(--primary)"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        yAxisId="right"
                        dataKey="obitos" 
                        name="Óbitos"
                        fill="#ef4444"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
