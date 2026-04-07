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
import { diseaseData, vaccinationData, formatNumber } from "@/lib/health-data"
import { Calendar, Filter, TrendingUp, TrendingDown, X, Activity, Bug, HeartPulse, AlertTriangle } from "lucide-react"

// Gerar dados completos com datas reais - usando seed fixo para evitar problemas de hidratacao
const generateFullData = () => {
  const months = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ]
  const years = [2024, 2025, 2026]
  const data = []

  // Seed fixo para gerar numeros consistentes
  const seedMultipliers = [
    [0.95, 0.98, 1.02, 0.97, 1.01, 0.99, 0.96, 1.03, 0.98, 1.00, 0.97, 1.02],
    [1.01, 0.97, 0.99, 1.02, 0.98, 1.00, 0.96, 0.99, 1.01, 0.98, 1.00, 0.97],
    [0.98, 1.01, 0.97, 1.00, 0.99, 0.98, 1.02, 0.97, 1.00, 0.99, 0.98, 1.01]
  ]

  years.forEach((year, yearIndex) => {
    months.forEach((month, monthIndex) => {
      // Nao incluir meses futuros de 2026
      if (year === 2026 && monthIndex > 3) return

      // Variacoes sazonais para dengue (mais casos no verao)
      const summerMultiplier = [1.8, 2.0, 1.9, 1.5, 1.0, 0.7, 0.5, 0.5, 0.6, 0.8, 1.2, 1.5][monthIndex]
      // Tendencia de queda ao longo dos anos
      const yearTrend = year === 2024 ? 1.2 : year === 2025 ? 1.0 : 0.85

      const multiplier = seedMultipliers[yearIndex][monthIndex]

      data.push({
        date: `${year}-${String(monthIndex + 1).padStart(2, '0')}`,
        label: `${month} ${year}`,
        month,
        year,
        monthIndex,
        dengue: Math.round(diseaseData.dengue.monthlyData[monthIndex].cases * summerMultiplier * yearTrend * multiplier),
        hiv: Math.round(diseaseData.hiv.monthlyData[monthIndex].cases * yearTrend * multiplier),
        malaria: Math.round(diseaseData.malaria.monthlyData[monthIndex].cases * yearTrend * multiplier),
      })
    })
  })

  return data
}

const fullData = generateFullData()

// Opcoes de filtro predefinidas
const presetFilters = [
  { label: "Ultimos 3 meses", value: "3m" },
  { label: "Ultimos 6 meses", value: "6m" },
  { label: "Ultimo ano", value: "1y" },
  { label: "Todo o periodo", value: "all" },
]

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
function DateRangeFilter({ startDate, endDate, onStartChange, onEndChange, onPresetSelect, onClear }) {
  const years = [2024, 2025, 2026]
  const months = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Marco" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ]

  const startYear = startDate ? startDate.split("-")[0] : ""
  const startMonth = startDate ? startDate.split("-")[1] : ""
  const endYear = endDate ? endDate.split("-")[0] : ""
  const endMonth = endDate ? endDate.split("-")[1] : ""

  const handleStartYearChange = (year) => {
    onStartChange(year && startMonth ? `${year}-${startMonth}` : year ? `${year}-01` : "")
  }

  const handleStartMonthChange = (month) => {
    onStartChange(startYear && month ? `${startYear}-${month}` : "")
  }

  const handleEndYearChange = (year) => {
    onEndChange(year && endMonth ? `${year}-${endMonth}` : year ? `${year}-12` : "")
  }

  const handleEndMonthChange = (month) => {
    onEndChange(endYear && month ? `${endYear}-${month}` : "")
  }

  const hasFilter = startDate || endDate

  return (
    <div className="space-y-4">
      {/* Filtros predefinidos */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground mr-1 self-center">Rapido:</span>
        {presetFilters.map((preset) => (
          <Button
            key={preset.value}
            variant="outline"
            size="sm"
            onClick={() => onPresetSelect(preset.value)}
            className="h-7 text-xs"
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Filtro personalizado */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Data Inicial</label>
          <div className="flex gap-1.5">
            <Select value={startMonth} onValueChange={handleStartMonthChange}>
              <SelectTrigger className="w-[100px] h-8 text-xs">
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                {months.map(m => (
                  <SelectItem key={m.value} value={m.value} className="text-xs">
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={startYear} onValueChange={handleStartYearChange}>
              <SelectTrigger className="w-[80px] h-8 text-xs">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map(y => (
                  <SelectItem key={y} value={String(y)} className="text-xs">
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <span className="text-muted-foreground pb-1">ate</span>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Data Final</label>
          <div className="flex gap-1.5">
            <Select value={endMonth} onValueChange={handleEndMonthChange}>
              <SelectTrigger className="w-[100px] h-8 text-xs">
                <SelectValue placeholder="Mes" />
              </SelectTrigger>
              <SelectContent>
                {months.map(m => (
                  <SelectItem key={m.value} value={m.value} className="text-xs">
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={endYear} onValueChange={handleEndYearChange}>
              <SelectTrigger className="w-[80px] h-8 text-xs">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map(y => (
                  <SelectItem key={y} value={String(y)} className="text-xs">
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
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
            {startDate && endDate 
              ? `${months.find(m => m.value === startMonth)?.label || ''} ${startYear} - ${months.find(m => m.value === endMonth)?.label || ''} ${endYear}`
              : startDate 
                ? `A partir de ${months.find(m => m.value === startMonth)?.label || ''} ${startYear}`
                : `Ate ${months.find(m => m.value === endMonth)?.label || ''} ${endYear}`
            }
          </Badge>
        </div>
      )}
    </div>
  )
}

export function ChartsSection() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Aplicar filtro de data
  const filteredData = useMemo(() => {
    let data = [...fullData]

    if (startDate) {
      data = data.filter(item => item.date >= startDate)
    }

    if (endDate) {
      data = data.filter(item => item.date <= endDate)
    }

    return data
  }, [startDate, endDate])

  // Calcular estatisticas do periodo filtrado
  const periodStats = useMemo(() => {
    const totalDengue = filteredData.reduce((sum, item) => sum + item.dengue, 0)
    const totalHiv = filteredData.reduce((sum, item) => sum + item.hiv, 0)
    const totalMalaria = filteredData.reduce((sum, item) => sum + item.malaria, 0)
    const avgDengue = Math.round(totalDengue / filteredData.length)
    
    // Calcular tendencia (comparar primeira metade com segunda metade)
    const mid = Math.floor(filteredData.length / 2)
    const firstHalf = filteredData.slice(0, mid)
    const secondHalf = filteredData.slice(mid)
    const firstAvg = firstHalf.reduce((sum, item) => sum + item.dengue, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, item) => sum + item.dengue, 0) / secondHalf.length
    const trend = ((secondAvg - firstAvg) / firstAvg * 100).toFixed(1)

    return {
      totalDengue,
      totalHiv,
      totalMalaria,
      avgDengue,
      trend: Number(trend),
      periodLabel: filteredData.length > 0 
        ? `${filteredData[0].label} - ${filteredData[filteredData.length - 1].label}`
        : "Sem dados"
    }
  }, [filteredData])

  const handlePresetSelect = (preset) => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1

    // Ajustar para dados disponiveis (ate abril 2026)
    const maxDate = "2026-04"
    
    switch (preset) {
      case "3m":
        setEndDate(maxDate)
        setStartDate("2026-02")
        break
      case "6m":
        setEndDate(maxDate)
        setStartDate("2025-11")
        break
      case "1y":
        setEndDate(maxDate)
        setStartDate("2025-05")
        break
      case "all":
        setStartDate("")
        setEndDate("")
        break
    }
  }

  const handleClearFilter = () => {
    setStartDate("")
    setEndDate("")
  }

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
            Evolucao dos casos e cobertura vacinal ao longo do tempo
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
              Selecione um intervalo de datas para analisar os dados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onStartChange={setStartDate}
              onEndChange={setEndDate}
              onPresetSelect={handlePresetSelect}
              onClear={handleClearFilter}
            />
          </CardContent>
        </Card>

        {/* Cards de Resumo do Periodo - Melhorados */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Dengue</p>
                  <p className="text-2xl font-bold text-red-600">{formatNumber(periodStats.totalDengue)}</p>
                  <p className="text-xs text-muted-foreground">{filteredData.length} meses analisados</p>
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
                  <p className="text-sm text-muted-foreground">Total HIV/AIDS</p>
                  <p className="text-2xl font-bold text-purple-600">{formatNumber(periodStats.totalHiv)}</p>
                  <p className="text-xs text-muted-foreground">{filteredData.length} meses analisados</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <HeartPulse className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Malaria</p>
                  <p className="text-2xl font-bold text-amber-600">{formatNumber(periodStats.totalMalaria)}</p>
                  <p className="text-xs text-muted-foreground">{filteredData.length} meses analisados</p>
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
            <TabsTrigger value="vacinacao">Cobertura Vacinal</TabsTrigger>
            <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
          </TabsList>

          {/* Evolucao de Casos */}
          <TabsContent value="evolucao">
            <Card>
              <CardHeader>
                <CardTitle>Evolucao Mensal de Casos</CardTitle>
                <CardDescription>
                  Numero de casos registrados por mes para cada doenca
                  {startDate || endDate ? ` (${periodStats.periodLabel})` : " (todo o periodo)"}
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
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="hiv"
                          name="HIV/AIDS"
                          stroke="#8b5cf6"
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

          {/* Cobertura Vacinal */}
          <TabsContent value="vacinacao">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cobertura por Regiao</CardTitle>
                  <CardDescription>
                    Percentual de cobertura vacinal em cada regiao
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
                            vaccine.coverage >= 80 ? 'text-green-600' :
                            vaccine.coverage >= 60 ? 'text-yellow-600' :
                            'text-red-600'
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
                <CardTitle>Comparativo de Doencas</CardTitle>
                <CardDescription>
                  Total de casos e obitos por doenca no periodo
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
                        name="Obitos"
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
