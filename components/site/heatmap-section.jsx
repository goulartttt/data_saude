"use client"

import { useState, useMemo } from "react"
import { 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  ChevronDown,
  X,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { statesData, formatNumber, getRiskLevel } from "@/lib/health-data"

const regions = ["Todas", "Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"]

const metricOptions = [
  { value: "coverage", label: "Cobertura Vacinal" },
  { value: "cases", label: "Casos por 100k hab." },
  { value: "deaths", label: "Óbitos" },
]

export function HeatmapSection() {
  const [selectedRegion, setSelectedRegion] = useState("Todas")
  const [selectedMetric, setSelectedMetric] = useState("coverage")
  const [selectedState, setSelectedState] = useState(null)

  const filteredStates = useMemo(() => {
    let states = [...statesData]
    
    if (selectedRegion !== "Todas") {
      states = states.filter(s => s.region === selectedRegion)
    }

    // Ordenar por métrica
    if (selectedMetric === "coverage") {
      states.sort((a, b) => a.coverage - b.coverage) // Menor cobertura primeiro (mais crítico)
    } else if (selectedMetric === "cases") {
      states.sort((a, b) => (b.cases / b.population * 100000) - (a.cases / a.population * 100000))
    } else {
      states.sort((a, b) => b.deaths - a.deaths)
    }

    return states
  }, [selectedRegion, selectedMetric])

  const getMetricValue = (state) => {
    if (selectedMetric === "coverage") return state.coverage
    if (selectedMetric === "cases") return Math.round(state.cases / state.population * 100000)
    return state.deaths
  }

  const getMetricColor = (state) => {
    if (selectedMetric === "coverage") {
      const coverage = state.coverage
      if (coverage >= 80) return "bg-green-500"
      if (coverage >= 70) return "bg-green-400"
      if (coverage >= 60) return "bg-yellow-400"
      if (coverage >= 50) return "bg-orange-400"
      return "bg-red-500"
    } else {
      const value = getMetricValue(state)
      const max = Math.max(...statesData.map(s => getMetricValue(s)))
      const ratio = value / max
      if (ratio >= 0.8) return "bg-red-500"
      if (ratio >= 0.6) return "bg-orange-400"
      if (ratio >= 0.4) return "bg-yellow-400"
      if (ratio >= 0.2) return "bg-green-400"
      return "bg-green-500"
    }
  }

  const getMetricTextColor = (state) => {
    if (selectedMetric === "coverage") {
      const coverage = state.coverage
      if (coverage >= 80) return "text-green-700 dark:text-green-300"
      if (coverage >= 70) return "text-green-600 dark:text-green-400"
      if (coverage >= 60) return "text-yellow-700 dark:text-yellow-300"
      if (coverage >= 50) return "text-orange-700 dark:text-orange-300"
      return "text-red-700 dark:text-red-300"
    } else {
      const value = getMetricValue(state)
      const max = Math.max(...statesData.map(s => getMetricValue(s)))
      const ratio = value / max
      if (ratio >= 0.6) return "text-red-700 dark:text-red-300"
      if (ratio >= 0.3) return "text-yellow-700 dark:text-yellow-300"
      return "text-green-700 dark:text-green-300"
    }
  }

  // Calcular estatísticas
  const stats = useMemo(() => {
    const critical = statesData.filter(s => s.coverage < 60).length
    const alert = statesData.filter(s => s.coverage >= 60 && s.coverage < 70).length
    const ok = statesData.filter(s => s.coverage >= 70).length
    const avgCoverage = Math.round(statesData.reduce((sum, s) => sum + s.coverage, 0) / statesData.length)
    
    return { critical, alert, ok, avgCoverage }
  }, [])

  return (
    <section id="mapa" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 
            className="mb-3 text-3xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Mapa de Risco por Estado
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Visualize a situação de saúde pública em cada estado brasileiro
          </p>
        </div>

        {/* Resumo */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.critical}</p>
                <p className="text-sm text-muted-foreground">Estados Críticos</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30">
                <Info className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.alert}</p>
                <p className="text-sm text-muted-foreground">Estados em Alerta</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.ok}</p>
                <p className="text-sm text-muted-foreground">Estados OK</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.avgCoverage}%</p>
                <p className="text-sm text-muted-foreground">Média Nacional</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Filtros e Lista */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>Estados Brasileiros</CardTitle>
                    <CardDescription>
                      Clique em um estado para ver mais detalhes
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Região" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map(region => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Métrica" />
                      </SelectTrigger>
                      <SelectContent>
                        {metricOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Legenda */}
                <div className="mb-4 flex flex-wrap items-center gap-4 text-sm">
                  <span className="text-muted-foreground">Legenda:</span>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded bg-red-500" />
                    <span>Crítico</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded bg-orange-400" />
                    <span>Alto</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded bg-yellow-400" />
                    <span>Médio</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded bg-green-400" />
                    <span>Baixo</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded bg-green-500" />
                    <span>Ótimo</span>
                  </div>
                </div>

                {/* Grid de Estados */}
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                  {filteredStates.map(state => {
                    const isSelected = selectedState?.uf === state.uf
                    const metricValue = getMetricValue(state)
                    
                    return (
                      <button
                        key={state.uf}
                        onClick={() => setSelectedState(isSelected ? null : state)}
                        className={`group relative flex flex-col items-center justify-center rounded-lg border p-3 transition-all hover:shadow-md ${
                          isSelected 
                            ? 'border-primary bg-primary/5 ring-2 ring-primary' 
                            : 'border-border bg-card hover:border-primary/50'
                        }`}
                      >
                        <div className={`mb-1 flex h-8 w-8 items-center justify-center rounded-full ${getMetricColor(state)}`}>
                          <span className="text-xs font-bold text-white">{state.uf}</span>
                        </div>
                        <span className={`text-sm font-semibold ${getMetricTextColor(state)}`}>
                          {selectedMetric === "coverage" ? `${metricValue}%` : formatNumber(metricValue)}
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate max-w-full">
                          {state.name.split(" ")[0]}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detalhes do Estado */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {selectedState ? selectedState.name : "Detalhes do Estado"}
                  {selectedState && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setSelectedState(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
                {selectedState && (
                  <CardDescription>
                    Região {selectedState.region}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {selectedState ? (
                  <div className="space-y-6">
                    {/* Badge de Risco */}
                    <div className="flex justify-center">
                      <Badge 
                        variant="outline" 
                        className={`px-4 py-2 text-lg ${getRiskLevel(selectedState.coverage).textColor}`}
                      >
                        Risco {getRiskLevel(selectedState.coverage).level}
                      </Badge>
                    </div>

                    {/* Cobertura Vacinal */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Cobertura Vacinal</span>
                        <span className={`text-lg font-bold ${getRiskLevel(selectedState.coverage).textColor}`}>
                          {selectedState.coverage}%
                        </span>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${getRiskLevel(selectedState.coverage).color}`}
                          style={{ width: `${selectedState.coverage}%` }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span className="text-primary">Meta: 95%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Estatísticas */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">Casos Totais</p>
                        <p className="text-xl font-bold">{formatNumber(selectedState.cases)}</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">Óbitos</p>
                        <p className="text-xl font-bold text-red-600 dark:text-red-400">
                          {formatNumber(selectedState.deaths)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">População</p>
                        <p className="text-xl font-bold">{formatNumber(selectedState.population)}</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">Casos/100k hab.</p>
                        <p className="text-xl font-bold">
                          {formatNumber(Math.round(selectedState.cases / selectedState.population * 100000))}
                        </p>
                      </div>
                    </div>

                    {/* Recomendação */}
                    {selectedState.coverage < 70 && (
                      <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950/30">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-orange-800 dark:text-orange-200">
                              Atenção Recomendada
                            </p>
                            <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
                              Este estado está abaixo da meta de cobertura vacinal. 
                              Recomenda-se intensificar as campanhas de vacinação.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <MapPin className="mb-4 h-12 w-12 text-muted-foreground/50" />
                    <p className="text-muted-foreground">
                      Selecione um estado no mapa para ver informações detalhadas
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
