"use client"

import { useEffect, useState } from "react"
import { 
  Bug, 
  HeartPulse, 
  Skull, 
  TrendingUp, 
  TrendingDown,
  Minus,
  AlertTriangle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { diseaseData, formatNumber } from "@/lib/health-data"

const getTrendIcon = (trend) => {
  if (trend === "up") return { Icon: TrendingUp, color: "text-red-500", bg: "bg-red-500/10" }
  if (trend === "down") return { Icon: TrendingDown, color: "text-green-500", bg: "bg-green-500/10" }
  return { Icon: Minus, color: "text-gray-500", bg: "bg-gray-500/10" }
}

const diseaseIcons = {
  dengue: Bug,
  hiv: HeartPulse,
  malaria: AlertTriangle,
}

export function StatsSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const totalCases = Object.values(diseaseData).reduce((sum, d) => sum + d.cases, 0)
  const totalDeaths = Object.values(diseaseData).reduce((sum, d) => sum + d.deaths, 0)

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
            Acompanhe os principais indicadores de saúde pública do Brasil
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total de Casos
              </CardTitle>
              <Bug className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mounted ? formatNumber(totalCases) : "..."}
              </div>
              <p className="text-xs text-muted-foreground">
                Dengue, HIV/AIDS e Malária
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Óbitos Registrados
              </CardTitle>
              <Skull className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {mounted ? formatNumber(totalDeaths) : "..."}
              </div>
              <p className="text-xs text-muted-foreground">
                Últimos 12 meses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cobertura Vacinal
              </CardTitle>
              <HeartPulse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                78.5%
              </div>
              <p className="text-xs text-muted-foreground">
                Meta: 95%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Estados em Alerta
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                8
              </div>
              <p className="text-xs text-muted-foreground">
                Cobertura abaixo de 60%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Disease Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(diseaseData).map(([key, disease]) => {
            const { Icon: TrendIcon, color: trendColor, bg: trendBg } = getTrendIcon(disease.trend)
            const DiseaseIcon = diseaseIcons[key]

            return (
              <Card key={key} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${disease.color}20` }}
                      >
                        <DiseaseIcon 
                          className="h-5 w-5" 
                          style={{ color: disease.color }}
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{disease.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">Últimos 12 meses</p>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${trendColor} ${trendBg}`}>
                      <TrendIcon className="h-3 w-3" />
                      {disease.trend === "up" ? "Subindo" : disease.trend === "down" ? "Caindo" : "Estável"}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Casos</p>
                      <p className="text-2xl font-bold">
                        {mounted ? formatNumber(disease.cases) : "..."}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Óbitos</p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {mounted ? formatNumber(disease.deaths) : "..."}
                      </p>
                    </div>
                  </div>
                  {/* Mini Chart Preview */}
                  <div className="mt-4 flex items-end gap-1 h-12">
                    {disease.monthlyData.slice(-6).map((month, i) => {
                      const maxCases = Math.max(...disease.monthlyData.map(m => m.cases))
                      const height = (month.cases / maxCases) * 100
                      return (
                        <div
                          key={i}
                          className="flex-1 rounded-t transition-all hover:opacity-80"
                          style={{ 
                            height: `${height}%`,
                            backgroundColor: disease.color,
                            opacity: 0.6 + (i * 0.08)
                          }}
                          title={`${month.month}: ${formatNumber(month.cases)} casos`}
                        />
                      )
                    })}
                  </div>
                  <p className="mt-2 text-center text-xs text-muted-foreground">
                    Últimos 6 meses
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
