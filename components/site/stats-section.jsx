"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"
import { 
  Bug, 
  HeartPulse, 
  Skull, 
  TrendingUp, 
  TrendingDown,
  Minus,
  AlertTriangle,
  Activity,
  ShieldAlert
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatNumber, monthKeys } from "@/lib/health-data"

// Estados em alerta com cobertura abaixo de 60%
const estadosEmAlerta = [
  { nome: "Amazonas", cobertura: 52 },
  { nome: "Roraima", cobertura: 48 },
  { nome: "Amapa", cobertura: 55 },
  { nome: "Para", cobertura: 58 },
  { nome: "Maranhao", cobertura: 54 },
  { nome: "Piaui", cobertura: 57 },
  { nome: "Acre", cobertura: 51 },
  { nome: "Rondonia", cobertura: 59 },
]

const getTrendIcon = (trend) => {
  if (trend === "aumento") return { Icon: TrendingUp, color: "text-red-500", bg: "bg-red-500/10", label: "Subindo" }
  if (trend === "queda") return { Icon: TrendingDown, color: "text-green-500", bg: "bg-green-500/10", label: "Caindo" }
  return { Icon: Minus, color: "text-gray-500", bg: "bg-gray-500/10", label: "Estavel" }
}

const diseaseConfig = {
  Dengue: { icon: Bug, color: "#ef4444" },
  HIV: { icon: HeartPulse, color: "#8b5cf6" },
  AIDS: { icon: ShieldAlert, color: "#3b82f6" },
  Malaria: { icon: AlertTriangle, color: "#f59e0b" },
}

const fetcher = (url) => fetch(url).then(res => res.json())

export function StatsSection() {
  const [mounted, setMounted] = useState(false)

  // Buscar dados do banco de dados
  const { data: summaryResponse, isLoading } = useSWR('/api/disease-data?type=summary', fetcher)
  const { data: allDataResponse } = useSWR('/api/disease-data?type=all', fetcher)

  const summary = summaryResponse?.success ? summaryResponse.data : {}
  const allData = allDataResponse?.success ? allDataResponse.data : []

  useEffect(() => {
    setMounted(true)
  }, [])

  // Calcular totais reais
  const totalCases = Object.values(summary).reduce((sum, d) => sum + (d?.totalGeral || 0), 0)

  return (
    <section id="dashboard" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 
            className="mb-3 text-3xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Panorama Geral
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Acompanhe os principais indicadores de saude publica do Brasil - Dados reais de 2024 e 2025
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Casos
              </CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mounted && !isLoading ? formatNumber(totalCases) : "..."}
              </div>
              <p className="text-xs text-muted-foreground">
                Dengue, HIV, AIDS e Malaria (2024-2025)
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Dengue Total
              </CardTitle>
              <Bug className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {mounted && !isLoading ? formatNumber(summary.Dengue?.totalGeral || 0) : "..."}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className={summary.Dengue?.variacao < 0 ? "text-green-600" : "text-red-600"}>
                  {summary.Dengue?.variacao > 0 ? "+" : ""}{summary.Dengue?.variacao || 0}%
                </span> vs 2024
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cobertura Vacinal
              </CardTitle>
              <HeartPulse className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                78.5%
              </div>
              <p className="text-xs text-muted-foreground">
                Meta: 95%
              </p>
            </CardContent>
          </Card>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Estados em Alerta
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      8
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Passe o mouse para ver detalhes
                    </p>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="w-64 p-0">
                <div className="p-3">
                  <p className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Estados com cobertura abaixo de 60%
                  </p>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {estadosEmAlerta.map((estado, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span>{estado.nome}</span>
                        <span className="font-medium text-orange-600">{estado.cobertura}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Disease Cards - Dados Reais */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(summary).map(([key, disease]) => {
            const config = diseaseConfig[key]
            if (!config || !disease) return null
            
            const { Icon: TrendIcon, color: trendColor, bg: trendBg, label: trendLabel } = getTrendIcon(disease.tendencia)
            const DiseaseIcon = config.icon

            // Obter dados mensais para o mini grafico
            const diseaseRecord2025 = allData.find(d => d.doenca === key && d.ano === 2025)
            
            const last6Months = [
              { month: "Jul", value: diseaseRecord2025?.jul || 0 },
              { month: "Ago", value: diseaseRecord2025?.ago || 0 },
              { month: "Set", value: diseaseRecord2025?.setem || 0 },
              { month: "Out", value: diseaseRecord2025?.outu || 0 },
              { month: "Nov", value: diseaseRecord2025?.nove || 0 },
              { month: "Dez", value: diseaseRecord2025?.deze || 0 },
            ]

            return (
              <Card key={key} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${config.color}20` }}
                      >
                        <DiseaseIcon 
                          className="h-5 w-5" 
                          style={{ color: config.color }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{key}</CardTitle>
                        <p className="text-xs text-muted-foreground">2024-2025</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${trendColor} ${trendBg}`}>
                      <TrendIcon className="h-3 w-3" />
                      {trendLabel}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">2024</p>
                      <p className="text-xl font-bold">
                        {mounted && !isLoading ? formatNumber(disease.total2024) : "..."}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">2025</p>
                      <p className="text-xl font-bold">
                        {mounted && !isLoading ? formatNumber(disease.total2025) : "..."}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-lg font-bold" style={{ color: config.color }}>
                        {mounted && !isLoading ? formatNumber(disease.totalGeral) : "..."}
                      </p>
                    </div>
                  </div>
                  {/* Mini Chart Preview */}
                  <div className="mt-4 flex items-end gap-1 h-12">
                    {last6Months.map((month, i) => {
                      const maxValue = Math.max(...last6Months.map(m => m.value))
                      const height = maxValue > 0 ? (month.value / maxValue) * 100 : 10
                      return (
                        <div
                          key={i}
                          className="flex-1 rounded-t transition-all hover:opacity-80"
                          style={{ 
                            height: `${Math.max(height, 5)}%`,
                            backgroundColor: config.color,
                            opacity: 0.6 + (i * 0.08)
                          }}
                          title={`${month.month}: ${formatNumber(month.value)} casos`}
                        />
                      )
                    })}
                  </div>
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    Ultimos 6 meses de 2025
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
