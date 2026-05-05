"use client"

import { useState, useMemo, useEffect } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { realDiseaseData, monthKeys, monthNames, getDiseaseSummary, formatNumber } from "@/lib/health-data"
import { Calendar, Filter, TrendingUp, TrendingDown, X, Activity, Bug, HeartPulse, AlertTriangle, Virus } from "lucide-react"

// Gerar dados para graficos a partir dos dados reais
const generateChartData = () => {
  const data = []
  const years = [2024, 2025]

  years.forEach(year => {
    monthKeys.forEach((monthKey, idx) => {
      const dengueRecord = realDiseaseData.find(d => d.doenca === "Dengue" && d.ano === year)
      const hivRecord = realDiseaseData.find(d => d.doenca === "HIV" && d.ano === year)
      const aidsRecord = realDiseaseData.find(d => d.doenca === "AIDS" && d.ano === year)
      const malariaRecord = realDiseaseData.find(d => d.doenca === "Malaria" && d.ano === year)

      data.push({
        date: `${year}-${String(idx + 1).padStart(2, '0')}`,
        label: `${monthNames[idx].substring(0, 3)} ${year}`,
        month: monthNames[idx],
        year,
        monthIndex: idx,
        dengue: dengueRecord ? dengueRecord[monthKey] : 0,
        hiv: hivRecord ? hivRecord[monthKey] : 0,
        aids: aidsRecord ? aidsRecord[monthKey] : 0,
        malaria: malariaRecord ? malariaRecord[monthKey] : 0,
      })
    })
  })

  return data
}

const fullData = generateChartData()

// Opcoes de filtro predefinidas
const presetFilters = [
  { label: "2024", value: "2024" },
  { label: "2025", value: "2025" },
  { label: "Todo o periodo", value: "all" },
]

const diseaseColors = {
  dengue: "#ef4444",
  hiv: "#8b5cf6",
  aids: "#3b82f6",
  malaria: "#f59e0b",
}

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

// Componente de filtro de data
function DateRangeFilter({ selectedYear, onYearChange, onClear }) {
  const hasFilter = selectedYear && selectedYear !== "all"

  return (
    <div className="space-y-4">
      {/* Filtros predefinidos */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground mr-1 self-center">Periodo:</span>
        {presetFilters.map((preset) => (
          <Button
            key={preset.value}
            variant={selectedYear === preset.value ? "default" : "outline"}
            size="sm"
            onClick={() => onYearChange(preset.value)}
            className="h-7 text-xs"
          >
            {preset.label}
          </Button>
        ))}
        {hasFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      {/* Indicador de filtro ativo */}
      {hasFilter && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1.5">
            <Calendar className="h-3 w-3" />
            Ano: {selectedYear}
          </Badge>
        </div>
      )}
    </div>
  )
}

export function ChartsSection() {
  const [selectedYear, setSelectedYear] = useState("all")
  const summary = getDiseaseSummary()

  // Aplicar filtro de ano
  const filteredData = useMemo(() => {
    if (selectedYear === "all") return fullData
    return fullData.filter(item => item.year === parseInt(selectedYear))
  }, [selectedYear])

  // Calcular estatisticas do periodo filtrado
  const periodStats = useMemo(() => {
    const totalDengue = filteredData.reduce((sum, item) => sum + item.dengue, 0)
    const totalHiv = filteredData.reduce((sum, item) => sum + item.hiv, 0)
    const totalAids = filteredData.reduce((sum, item) => sum + item.aids, 0)
    const totalMalaria = filteredData.reduce((sum, item) => sum + item.malaria, 0)
    
    // Calcular tendencia (comparar primeira metade com segunda metade)
    const mid = Math.floor(filteredData.length / 2)
    const firstHalf = filteredData.slice(0, mid)
    const secondHalf = filteredData.slice(mid)
    const firstAvg = firstHalf.length > 0 ? firstHalf.reduce((sum, item) => sum + item.dengue, 0) / firstHalf.length : 0
    const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((sum, item) => sum + item.dengue, 0) / secondHalf.length : 0
    const trend = firstAvg > 0 ? ((secondAvg - firstAvg) / firstAvg * 100).toFixed(1) : 0

    return {
      totalDengue,
      totalHiv,
      totalAids,
      totalMalaria,
      trend: Number(trend),
      periodLabel: filteredData.length > 0 
        ? `${filteredData[0].label} - ${filteredData[filteredData.length - 1].label}`
        : "Sem dados"
    }
  }, [filteredData])

  const handleClearFilter = () => {
    setSelectedYear("all")
  }

  // Dados para grafico de barras comparativo
  const comparisonData = useMemo(() => {
    return [
      {
        doenca: "Dengue",
        "2024": summary.Dengue?.total2024 || 0,
        "2025": summary.Dengue?.total2025 || 0,
        variacao: summary.Dengue?.variacao || 0,
      },
      {
        doenca: "HIV",
        "2024": summary.HIV?.total2024 || 0,
        "2025": summary.HIV?.total2025 || 0,
        variacao: summary.HIV?.variacao || 0,
      },
      {
        doenca: "AIDS",
        "2024": summary.AIDS?.total2024 || 0,
        "2025": summary.AIDS?.total2025 || 0,
        variacao: summary.AIDS?.variacao || 0,
      },
      {
        doenca: "Malaria",
        "2024": summary.Malaria?.total2024 || 0,
        "2025": summary.Malaria?.total2025 || 0,
        variacao: summary.Malaria?.variacao || 0,
      },
    ]
  }, [summary])

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <Badge variant="outline" className="mb-4 gap-2">
            <TrendingUp className="h-3 w-3" />
            Analise de Dados
          </Badge>
          <h2 
            className="mb-3 text-3xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Analise Temporal
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Evolucao dos casos de doencas infecciosas - Dados reais de 2024 e 2025
          </p>
        </div>

        {/* Filtro de Data */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Filtrar por Periodo</CardTitle>
            </div>
            <CardDescription>
              Selecione um ano para analisar os dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DateRangeFilter
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              onClear={handleClearFilter}
            />
          </CardContent>
        </Card>

        {/* Cards de Resumo do Periodo */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Dengue</p>
                  <p className="text-2xl font-bold text-red-600">{formatNumber(periodStats.totalDengue)}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className={summary.Dengue?.variacao < 0 ? "text-green-600" : "text-red-600"}>
                      {summary.Dengue?.variacao > 0 ? "+" : ""}{summary.Dengue?.variacao}%
                    </span> vs ano anterior
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <Bug className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">HIV</p>
                  <p className="text-2xl font-bold text-purple-600">{formatNumber(periodStats.totalHiv)}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className={summary.HIV?.variacao < 0 ? "text-green-600" : "text-red-600"}>
                      {summary.HIV?.variacao > 0 ? "+" : ""}{summary.HIV?.variacao}%
                    </span> vs ano anterior
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <HeartPulse className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">AIDS</p>
                  <p className="text-2xl font-bold text-blue-600">{formatNumber(periodStats.totalAids)}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className={summary.AIDS?.variacao < 0 ? "text-green-600" : "text-red-600"}>
                      {summary.AIDS?.variacao > 0 ? "+" : ""}{summary.AIDS?.variacao}%
                    </span> vs ano anterior
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Virus className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Malaria</p>
                  <p className="text-2xl font-bold text-amber-600">{formatNumber(periodStats.totalMalaria)}</p>
                  <p className="text-xs text-muted-foreground">
                    <span className={summary.Malaria?.variacao < 0 ? "text-green-600" : "text-red-600"}>
                      {summary.Malaria?.variacao > 0 ? "+" : ""}{summary.Malaria?.variacao}%
                    </span> vs ano anterior
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-l-4 hover:shadow-md transition-shadow ${periodStats.trend < 0 ? 'border-l-green-500' : 'border-l-red-500'}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tendencia Dengue</p>
                  <p className={`text-2xl font-bold ${periodStats.trend < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {periodStats.trend > 0 ? '+' : ''}{periodStats.trend}%
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {periodStats.trend < 0 ? 'Queda' : 'Aumento'} no periodo
                  </p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-full ${periodStats.trend < 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                  {periodStats.trend < 0 ? (
                    <TrendingDown className="h-6 w-6 text-green-600" />
                  ) : (
                    <TrendingUp className="h-6 w-6 text-red-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="evolucao" className="space-y-6">
          <TabsList className="mx-auto flex w-fit">
            <TabsTrigger value="evolucao">Evolucao de Casos</TabsTrigger>
            <TabsTrigger value="dengue">Foco em Dengue</TabsTrigger>
            <TabsTrigger value="comparativo">Comparativo Anual</TabsTrigger>
          </TabsList>

          {/* Evolucao de Casos */}
          <TabsContent value="evolucao">
            <Card>
              <CardHeader>
                <CardTitle>Evolucao Mensal de Casos</CardTitle>
                <CardDescription>
                  Numero de casos registrados por mes para cada doenca
                  {selectedYear !== "all" ? ` (${selectedYear})` : " (2024-2025)"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredData.length > 0 ? (
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="label" 
                          className="text-xs"
                          tick={{ fill: 'var(--muted-foreground)' }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          interval={Math.ceil(filteredData.length / 12)}
                        />
                        <YAxis 
                          className="text-xs"
                          tick={{ fill: 'var(--muted-foreground)' }}
                          tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="dengue"
                          name="Dengue"
                          stroke="#ef4444"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="hiv"
                          name="HIV"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="aids"
                          name="AIDS"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="malaria"
                          name="Malaria"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex h-[400px] items-center justify-center text-muted-foreground">
                    Nenhum dado disponivel para o periodo selecionado
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Foco em Dengue */}
          <TabsContent value="dengue">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bug className="h-5 w-5 text-red-500" />
                    Dengue - Evolucao Mensal
                  </CardTitle>
                  <CardDescription>
                    Casos de dengue com destaque para sazonalidade
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="label" 
                          className="text-xs"
                          tick={{ fill: 'var(--muted-foreground)' }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          interval={Math.ceil(filteredData.length / 8)}
                        />
                        <YAxis 
                          className="text-xs"
                          tick={{ fill: 'var(--muted-foreground)' }}
                          tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="dengue"
                          name="Dengue"
                          stroke="#ef4444"
                          fill="#ef4444"
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>HIV e AIDS - Evolucao</CardTitle>
                  <CardDescription>
                    Comparativo de casos de HIV e AIDS ao longo do tempo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="label" 
                          className="text-xs"
                          tick={{ fill: 'var(--muted-foreground)' }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          interval={Math.ceil(filteredData.length / 8)}
                        />
                        <YAxis 
                          className="text-xs"
                          tick={{ fill: 'var(--muted-foreground)' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="hiv"
                          name="HIV"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.3}
                          stackId="1"
                        />
                        <Area
                          type="monotone"
                          dataKey="aids"
                          name="AIDS"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.3}
                          stackId="2"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Comparativo Anual */}
          <TabsContent value="comparativo">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Comparativo 2024 vs 2025</CardTitle>
                  <CardDescription>
                    Total de casos por doenca em cada ano
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          type="number"
                          className="text-xs"
                          tick={{ fill: 'var(--muted-foreground)' }}
                          tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
                        />
                        <YAxis 
                          type="category"
                          dataKey="doenca"
                          className="text-xs"
                          tick={{ fill: 'var(--muted-foreground)' }}
                          width={80}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar dataKey="2024" name="2024" fill="#6366f1" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="2025" name="2025" fill="#22c55e" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Variacao Percentual</CardTitle>
                  <CardDescription>
                    Mudanca percentual de 2024 para 2025
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 py-4">
                    {comparisonData.map((item) => {
                      const isNegative = item.variacao < 0
                      return (
                        <div key={item.doenca} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{item.doenca}</span>
                            <span className={`font-bold ${isNegative ? 'text-green-600' : 'text-red-600'}`}>
                              {item.variacao > 0 ? '+' : ''}{item.variacao}%
                            </span>
                          </div>
                          <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${isNegative ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ 
                                width: `${Math.min(Math.abs(item.variacao) * 2, 100)}%`,
                              }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>2024: {formatNumber(item["2024"])}</span>
                            <span>2025: {formatNumber(item["2025"])}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabela de Resumo */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Resumo Estatistico</CardTitle>
                <CardDescription>
                  Dados consolidados por doenca
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Doenca</th>
                        <th className="text-right py-3 px-4 font-semibold">Total 2024</th>
                        <th className="text-right py-3 px-4 font-semibold">Total 2025</th>
                        <th className="text-right py-3 px-4 font-semibold">Total Geral</th>
                        <th className="text-right py-3 px-4 font-semibold">Variacao</th>
                        <th className="text-center py-3 px-4 font-semibold">Tendencia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(summary).map(([key, data]) => (
                        <tr key={key} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{data.nome}</td>
                          <td className="text-right py-3 px-4">{formatNumber(data.total2024)}</td>
                          <td className="text-right py-3 px-4">{formatNumber(data.total2025)}</td>
                          <td className="text-right py-3 px-4 font-semibold">{formatNumber(data.totalGeral)}</td>
                          <td className={`text-right py-3 px-4 font-semibold ${data.variacao < 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {data.variacao > 0 ? '+' : ''}{data.variacao}%
                          </td>
                          <td className="text-center py-3 px-4">
                            <Badge variant={data.tendencia === "queda" ? "default" : "destructive"} className="gap-1">
                              {data.tendencia === "queda" ? (
                                <TrendingDown className="h-3 w-3" />
                              ) : (
                                <TrendingUp className="h-3 w-3" />
                              )}
                              {data.tendencia}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
