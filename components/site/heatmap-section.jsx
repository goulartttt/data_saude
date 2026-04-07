"use client"

import { useState, useMemo } from "react"
import { 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  X,
  Building2,
  Users,
  Phone,
  Navigation
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
import { zonesData, zoneSummary, awarenessContent, formatNumber, getRiskLevel } from "@/lib/health-data"

const zones = ["Todas", "Zona Norte", "Zona Sul", "Zona Leste", "Zona Oeste", "Centro"]

const metricOptions = [
  { value: "coverage", label: "Cobertura Vacinal" },
  { value: "cases", label: "Casos por 1000 hab." },
  { value: "deaths", label: "Óbitos" },
]

export function HeatmapSection() {
  const [selectedZone, setSelectedZone] = useState("Todas")
  const [selectedMetric, setSelectedMetric] = useState("coverage")
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null)

  const filteredNeighborhoods = useMemo(() => {
    let neighborhoods = [...zonesData]
    
    if (selectedZone !== "Todas") {
      neighborhoods = neighborhoods.filter(n => n.zone === selectedZone)
    }

    // Ordenar por métrica
    if (selectedMetric === "coverage") {
      neighborhoods.sort((a, b) => a.coverage - b.coverage)
    } else if (selectedMetric === "cases") {
      neighborhoods.sort((a, b) => (b.cases / b.population * 1000) - (a.cases / a.population * 1000))
    } else {
      neighborhoods.sort((a, b) => b.deaths - a.deaths)
    }

    return neighborhoods
  }, [selectedZone, selectedMetric])

  const getMetricValue = (neighborhood) => {
    if (selectedMetric === "coverage") return neighborhood.coverage
    if (selectedMetric === "cases") return Math.round(neighborhood.cases / neighborhood.population * 1000)
    return neighborhood.deaths
  }

  const getMetricColor = (neighborhood) => {
    if (selectedMetric === "coverage") {
      const coverage = neighborhood.coverage
      if (coverage >= 85) return "bg-green-500"
      if (coverage >= 75) return "bg-green-400"
      if (coverage >= 65) return "bg-yellow-400"
      if (coverage >= 55) return "bg-orange-400"
      return "bg-red-500"
    } else {
      const value = getMetricValue(neighborhood)
      const max = Math.max(...zonesData.map(n => getMetricValue(n)))
      const ratio = value / max
      if (ratio >= 0.8) return "bg-red-500"
      if (ratio >= 0.6) return "bg-orange-400"
      if (ratio >= 0.4) return "bg-yellow-400"
      if (ratio >= 0.2) return "bg-green-400"
      return "bg-green-500"
    }
  }

  const getMetricTextColor = (neighborhood) => {
    if (selectedMetric === "coverage") {
      const coverage = neighborhood.coverage
      if (coverage >= 80) return "text-green-700 dark:text-green-300"
      if (coverage >= 70) return "text-green-600 dark:text-green-400"
      if (coverage >= 60) return "text-yellow-700 dark:text-yellow-300"
      if (coverage >= 50) return "text-orange-700 dark:text-orange-300"
      return "text-red-700 dark:text-red-300"
    } else {
      const value = getMetricValue(neighborhood)
      const max = Math.max(...zonesData.map(n => getMetricValue(n)))
      const ratio = value / max
      if (ratio >= 0.6) return "text-red-700 dark:text-red-300"
      if (ratio >= 0.3) return "text-yellow-700 dark:text-yellow-300"
      return "text-green-700 dark:text-green-300"
    }
  }

  const getZoneColor = (zone) => {
    const summary = zoneSummary.find(z => z.zone === zone)
    return summary?.color || "#6b7280"
  }

  // Calcular estatísticas
  const stats = useMemo(() => {
    const critical = zonesData.filter(n => n.coverage < 55).length
    const alert = zonesData.filter(n => n.coverage >= 55 && n.coverage < 70).length
    const ok = zonesData.filter(n => n.coverage >= 70).length
    const avgCoverage = Math.round(zonesData.reduce((sum, n) => sum + n.coverage, 0) / zonesData.length)
    const totalCases = zonesData.reduce((sum, n) => sum + n.cases, 0)
    
    return { critical, alert, ok, avgCoverage, totalCases }
  }, [])

  // UBS mais próxima da zona selecionada
  const nearestUBS = useMemo(() => {
    if (!selectedNeighborhood) return null
    return awarenessContent.ubsList.find(ubs => ubs.zone === selectedNeighborhood.zone)
  }, [selectedNeighborhood])

  return (
    <section id="mapa" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <Badge variant="outline" className="mb-4">Mapa de Calor</Badge>
          <h2 
            className="mb-3 text-3xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Situação por Zona e Bairro
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Visualize a situação de saúde pública em cada bairro de São Paulo
          </p>
        </div>

        {/* Resumo por Zona */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {zoneSummary.map((zone) => {
            const riskLevel = getRiskLevel(zone.coverage)
            return (
              <Card 
                key={zone.zone} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedZone === zone.zone ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedZone(selectedZone === zone.zone ? "Todas" : zone.zone)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="h-10 w-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${zone.color}20` }}
                    >
                      <Navigation className="h-5 w-5" style={{ color: zone.color }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{zone.zone}</p>
                      <p className="text-xs text-muted-foreground">{zone.neighborhoods} bairros</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cobertura</span>
                      <span className={`font-semibold ${riskLevel.textColor}`}>{zone.coverage}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${riskLevel.color}`}
                        style={{ width: `${zone.coverage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{formatNumber(zone.cases)} casos</span>
                      {zone.criticalAreas > 0 && (
                        <span className="text-red-500 font-medium">{zone.criticalAreas} áreas críticas</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Cards de Resumo */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.critical}</p>
                <p className="text-sm text-muted-foreground">Bairros Críticos</p>
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
                <p className="text-sm text-muted-foreground">Bairros em Alerta</p>
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
                <p className="text-sm text-muted-foreground">Bairros Adequados</p>
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
                <p className="text-sm text-muted-foreground">Média SP Capital</p>
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
                    <CardTitle>Bairros de São Paulo</CardTitle>
                    <CardDescription>
                      Clique em um bairro para ver mais detalhes
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select value={selectedZone} onValueChange={setSelectedZone}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Zona" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.map(zone => (
                          <SelectItem key={zone} value={zone}>{zone}</SelectItem>
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
                    <span>Bom</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded bg-green-500" />
                    <span>Excelente</span>
                  </div>
                </div>

                {/* Grid de Bairros */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {filteredNeighborhoods.map(neighborhood => {
                    const isSelected = selectedNeighborhood?.id === neighborhood.id
                    const metricValue = getMetricValue(neighborhood)
                    
                    return (
                      <button
                        key={neighborhood.id}
                        onClick={() => setSelectedNeighborhood(isSelected ? null : neighborhood)}
                        className={`group relative flex flex-col items-center justify-center rounded-lg border p-3 transition-all hover:shadow-md ${
                          isSelected 
                            ? 'border-primary bg-primary/5 ring-2 ring-primary' 
                            : 'border-border bg-card hover:border-primary/50'
                        }`}
                      >
                        <div className={`mb-2 h-3 w-full rounded-full ${getMetricColor(neighborhood)}`} />
                        <span className="text-sm font-medium truncate max-w-full text-center leading-tight">
                          {neighborhood.name}
                        </span>
                        <span className={`text-lg font-bold ${getMetricTextColor(neighborhood)}`}>
                          {selectedMetric === "coverage" ? `${metricValue}%` : formatNumber(metricValue)}
                        </span>
                        <Badge 
                          variant="secondary" 
                          className="mt-1 text-[10px] px-1.5 py-0"
                          style={{ 
                            backgroundColor: `${getZoneColor(neighborhood.zone)}15`,
                            color: getZoneColor(neighborhood.zone)
                          }}
                        >
                          {neighborhood.zone.replace("Zona ", "")}
                        </Badge>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detalhes do Bairro */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {selectedNeighborhood ? selectedNeighborhood.name : "Detalhes do Bairro"}
                  {selectedNeighborhood && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setSelectedNeighborhood(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
                {selectedNeighborhood && (
                  <CardDescription className="flex items-center gap-2">
                    <Badge 
                      variant="outline"
                      style={{ 
                        borderColor: getZoneColor(selectedNeighborhood.zone),
                        color: getZoneColor(selectedNeighborhood.zone)
                      }}
                    >
                      {selectedNeighborhood.zone}
                    </Badge>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {selectedNeighborhood ? (
                  <div className="space-y-6">
                    {/* Badge de Risco */}
                    <div className="flex justify-center">
                      <Badge 
                        variant="outline" 
                        className={`px-4 py-2 text-lg ${getRiskLevel(selectedNeighborhood.coverage).textColor} ${getRiskLevel(selectedNeighborhood.coverage).bgLight}`}
                      >
                        Risco {getRiskLevel(selectedNeighborhood.coverage).level}
                      </Badge>
                    </div>

                    {/* Cobertura Vacinal */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Cobertura Vacinal</span>
                        <span className={`text-lg font-bold ${getRiskLevel(selectedNeighborhood.coverage).textColor}`}>
                          {selectedNeighborhood.coverage}%
                        </span>
                      </div>
                      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${getRiskLevel(selectedNeighborhood.coverage).color}`}
                          style={{ width: `${selectedNeighborhood.coverage}%` }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span className="text-primary font-medium">Meta: 95%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Estatísticas */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">Casos Totais</p>
                        <p className="text-xl font-bold">{formatNumber(selectedNeighborhood.cases)}</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">Óbitos</p>
                        <p className="text-xl font-bold text-red-600 dark:text-red-400">
                          {formatNumber(selectedNeighborhood.deaths)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">População</p>
                        <p className="text-xl font-bold">{formatNumber(selectedNeighborhood.population)}</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">Casos/1000 hab.</p>
                        <p className="text-xl font-bold">
                          {Math.round(selectedNeighborhood.cases / selectedNeighborhood.population * 1000)}
                        </p>
                      </div>
                    </div>

                    {/* UBS Próxima */}
                    {nearestUBS && (
                      <div className="rounded-lg border bg-primary/5 p-4">
                        <div className="flex items-start gap-3">
                          <Building2 className="h-5 w-5 text-primary mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{nearestUBS.name}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {nearestUBS.address}
                            </p>
                            <div className="flex items-center gap-1 mt-2 text-xs text-primary">
                              <Phone className="h-3 w-3" />
                              <span>{nearestUBS.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Recomendação */}
                    {selectedNeighborhood.coverage < 70 && (
                      <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950/30">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-orange-800 dark:text-orange-200">
                              Atenção Recomendada
                            </p>
                            <p className="mt-1 text-sm text-orange-700 dark:text-orange-300">
                              Este bairro está abaixo da meta de cobertura vacinal. 
                              Procure a UBS mais próxima para se vacinar.
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
                      Selecione um bairro para ver informações detalhadas
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
