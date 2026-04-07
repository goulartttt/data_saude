"use client"

import { useState, useMemo } from "react"
import { 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  X,
  Building2,
  Phone,
  Navigation,
  Thermometer
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
  { value: "deaths", label: "Obitos" },
]

// Componente do Mapa SVG de Sao Paulo
function SaoPauloMap({ selectedZone, onZoneClick, zoneSummary, selectedMetric }) {
  const getZoneHeatColor = (zone) => {
    const zoneData = zoneSummary.find(z => z.zone === zone)
    if (!zoneData) return "#e5e7eb"
    
    const coverage = zoneData.coverage
    // Cores de mapa de calor - vermelho (baixo) a verde (alto)
    if (coverage >= 80) return "#22c55e" // verde
    if (coverage >= 75) return "#84cc16" // verde-limao
    if (coverage >= 70) return "#eab308" // amarelo
    if (coverage >= 65) return "#f97316" // laranja
    return "#ef4444" // vermelho
  }

  const isSelected = (zone) => selectedZone === zone

  return (
    <svg 
      viewBox="0 0 400 350" 
      className="w-full h-auto max-h-[400px]"
      style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
    >
      {/* Fundo do mapa */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="heatGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="25%" stopColor="#f97316" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="75%" stopColor="#84cc16" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>

      {/* Zona Norte */}
      <path
        d="M 100 30 L 200 20 L 280 50 L 300 100 L 250 140 L 200 150 L 150 130 L 100 100 Z"
        fill={getZoneHeatColor("Zona Norte")}
        stroke={isSelected("Zona Norte") ? "#1e40af" : "#374151"}
        strokeWidth={isSelected("Zona Norte") ? 4 : 2}
        className="cursor-pointer transition-all duration-300 hover:opacity-80"
        onClick={() => onZoneClick("Zona Norte")}
        filter={isSelected("Zona Norte") ? "url(#glow)" : ""}
      />
      <text x="190" y="85" textAnchor="middle" className="fill-gray-800 dark:fill-gray-100 text-xs font-semibold pointer-events-none">
        Zona Norte
      </text>
      <text x="190" y="100" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300 text-[10px] pointer-events-none">
        {zoneSummary.find(z => z.zone === "Zona Norte")?.coverage}%
      </text>

      {/* Zona Oeste */}
      <path
        d="M 20 120 L 100 100 L 150 130 L 150 200 L 120 250 L 60 230 L 30 180 Z"
        fill={getZoneHeatColor("Zona Oeste")}
        stroke={isSelected("Zona Oeste") ? "#1e40af" : "#374151"}
        strokeWidth={isSelected("Zona Oeste") ? 4 : 2}
        className="cursor-pointer transition-all duration-300 hover:opacity-80"
        onClick={() => onZoneClick("Zona Oeste")}
        filter={isSelected("Zona Oeste") ? "url(#glow)" : ""}
      />
      <text x="90" y="170" textAnchor="middle" className="fill-gray-800 dark:fill-gray-100 text-xs font-semibold pointer-events-none">
        Zona Oeste
      </text>
      <text x="90" y="185" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300 text-[10px] pointer-events-none">
        {zoneSummary.find(z => z.zone === "Zona Oeste")?.coverage}%
      </text>

      {/* Centro */}
      <path
        d="M 150 130 L 200 150 L 250 140 L 260 180 L 240 220 L 200 230 L 160 210 L 150 200 Z"
        fill={getZoneHeatColor("Centro")}
        stroke={isSelected("Centro") ? "#1e40af" : "#374151"}
        strokeWidth={isSelected("Centro") ? 4 : 2}
        className="cursor-pointer transition-all duration-300 hover:opacity-80"
        onClick={() => onZoneClick("Centro")}
        filter={isSelected("Centro") ? "url(#glow)" : ""}
      />
      <text x="200" y="180" textAnchor="middle" className="fill-gray-800 dark:fill-gray-100 text-xs font-semibold pointer-events-none">
        Centro
      </text>
      <text x="200" y="195" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300 text-[10px] pointer-events-none">
        {zoneSummary.find(z => z.zone === "Centro")?.coverage}%
      </text>

      {/* Zona Leste */}
      <path
        d="M 250 140 L 300 100 L 370 120 L 380 180 L 350 250 L 280 260 L 240 220 L 260 180 Z"
        fill={getZoneHeatColor("Zona Leste")}
        stroke={isSelected("Zona Leste") ? "#1e40af" : "#374151"}
        strokeWidth={isSelected("Zona Leste") ? 4 : 2}
        className="cursor-pointer transition-all duration-300 hover:opacity-80"
        onClick={() => onZoneClick("Zona Leste")}
        filter={isSelected("Zona Leste") ? "url(#glow)" : ""}
      />
      <text x="310" y="175" textAnchor="middle" className="fill-gray-800 dark:fill-gray-100 text-xs font-semibold pointer-events-none">
        Zona Leste
      </text>
      <text x="310" y="190" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300 text-[10px] pointer-events-none">
        {zoneSummary.find(z => z.zone === "Zona Leste")?.coverage}%
      </text>

      {/* Zona Sul */}
      <path
        d="M 120 250 L 160 210 L 200 230 L 240 220 L 280 260 L 300 310 L 240 340 L 160 330 L 100 290 Z"
        fill={getZoneHeatColor("Zona Sul")}
        stroke={isSelected("Zona Sul") ? "#1e40af" : "#374151"}
        strokeWidth={isSelected("Zona Sul") ? 4 : 2}
        className="cursor-pointer transition-all duration-300 hover:opacity-80"
        onClick={() => onZoneClick("Zona Sul")}
        filter={isSelected("Zona Sul") ? "url(#glow)" : ""}
      />
      <text x="200" y="280" textAnchor="middle" className="fill-gray-800 dark:fill-gray-100 text-xs font-semibold pointer-events-none">
        Zona Sul
      </text>
      <text x="200" y="295" textAnchor="middle" className="fill-gray-600 dark:fill-gray-300 text-[10px] pointer-events-none">
        {zoneSummary.find(z => z.zone === "Zona Sul")?.coverage}%
      </text>

      {/* Barra de Legenda do Gradiente de Calor */}
      <rect x="50" y="320" width="300" height="12" rx="6" fill="url(#heatGradient)" />
      <text x="50" y="345" className="fill-gray-500 dark:fill-gray-400 text-[9px]">Baixa cobertura</text>
      <text x="350" y="345" textAnchor="end" className="fill-gray-500 dark:fill-gray-400 text-[9px]">Alta cobertura</text>
    </svg>
  )
}

export function HeatmapSection() {
  const [selectedZone, setSelectedZone] = useState("Todas")
  const [selectedMetric, setSelectedMetric] = useState("coverage")
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null)

  const handleZoneClick = (zone) => {
    setSelectedZone(selectedZone === zone ? "Todas" : zone)
    setSelectedNeighborhood(null)
  }

  const filteredNeighborhoods = useMemo(() => {
    let neighborhoods = [...zonesData]
    
    if (selectedZone !== "Todas") {
      neighborhoods = neighborhoods.filter(n => n.zone === selectedZone)
    }

    // Ordenar por metrica
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
      if (coverage >= 75) return "bg-lime-500"
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
      if (ratio >= 0.2) return "bg-lime-500"
      return "bg-green-500"
    }
  }

  const getMetricTextColor = (neighborhood) => {
    if (selectedMetric === "coverage") {
      const coverage = neighborhood.coverage
      if (coverage >= 80) return "text-green-700 dark:text-green-300"
      if (coverage >= 70) return "text-lime-700 dark:text-lime-300"
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

  // Calcular estatisticas
  const stats = useMemo(() => {
    const critical = zonesData.filter(n => n.coverage < 55).length
    const alert = zonesData.filter(n => n.coverage >= 55 && n.coverage < 70).length
    const ok = zonesData.filter(n => n.coverage >= 70).length
    const avgCoverage = Math.round(zonesData.reduce((sum, n) => sum + n.coverage, 0) / zonesData.length)
    const totalCases = zonesData.reduce((sum, n) => sum + n.cases, 0)
    
    return { critical, alert, ok, avgCoverage, totalCases }
  }, [])

  // UBS mais proxima da zona selecionada
  const nearestUBS = useMemo(() => {
    if (!selectedNeighborhood) return null
    return awarenessContent.ubsList.find(ubs => ubs.zone === selectedNeighborhood.zone)
  }, [selectedNeighborhood])

  return (
    <section id="mapa" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <Badge variant="outline" className="mb-4 gap-2">
            <Thermometer className="h-3 w-3" />
            Mapa de Calor
          </Badge>
          <h2 
            className="mb-3 text-3xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Situacao por Zona e Bairro
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Visualize a situacao de saude publica em cada bairro de Sao Paulo. Clique nas zonas do mapa para filtrar.
          </p>
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
                <p className="text-sm text-muted-foreground">Bairros Criticos</p>
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
                <p className="text-sm text-muted-foreground">Media SP Capital</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Mapa Visual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Mapa de Sao Paulo
              </CardTitle>
              <CardDescription>
                Clique em uma zona para ver os bairros. As cores indicam a cobertura vacinal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SaoPauloMap 
                selectedZone={selectedZone}
                onZoneClick={handleZoneClick}
                zoneSummary={zoneSummary}
                selectedMetric={selectedMetric}
              />
              
              {/* Resumo das Zonas */}
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {zoneSummary.map((zone) => {
                  const riskLevel = getRiskLevel(zone.coverage)
                  const isActive = selectedZone === zone.zone
                  return (
                    <button
                      key={zone.zone}
                      onClick={() => handleZoneClick(zone.zone)}
                      className={`rounded-lg border p-3 text-left transition-all hover:shadow-md ${
                        isActive ? 'ring-2 ring-primary border-primary' : 'border-border'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: zone.color }}
                        />
                        <span className="text-xs font-medium truncate">{zone.zone.replace("Zona ", "")}</span>
                      </div>
                      <p className={`text-lg font-bold ${riskLevel.textColor}`}>{zone.coverage}%</p>
                      <p className="text-[10px] text-muted-foreground">{zone.criticalAreas} areas criticas</p>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Lista de Bairros / Detalhes */}
          <div className="space-y-6">
            {/* Filtros e Lista de Bairros */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {selectedZone === "Todas" ? "Todos os Bairros" : selectedZone}
                    </CardTitle>
                    <CardDescription>
                      {filteredNeighborhoods.length} bairros encontrados
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Select value={selectedZone} onValueChange={setSelectedZone}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Zona" />
                      </SelectTrigger>
                      <SelectContent>
                        {zones.map(zone => (
                          <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Metrica" />
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
                <div className="mb-4 flex flex-wrap items-center gap-3 text-xs">
                  <span className="text-muted-foreground">Legenda:</span>
                  <div className="flex items-center gap-1">
                    <div className="h-2.5 w-2.5 rounded bg-red-500" />
                    <span>Critico</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2.5 w-2.5 rounded bg-orange-400" />
                    <span>Alto</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2.5 w-2.5 rounded bg-yellow-400" />
                    <span>Medio</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2.5 w-2.5 rounded bg-lime-500" />
                    <span>Bom</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2.5 w-2.5 rounded bg-green-500" />
                    <span>Excelente</span>
                  </div>
                </div>

                {/* Grid de Bairros */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 max-h-[320px] overflow-y-auto pr-1">
                  {filteredNeighborhoods.map(neighborhood => {
                    const isSelected = selectedNeighborhood?.id === neighborhood.id
                    const metricValue = getMetricValue(neighborhood)
                    
                    return (
                      <button
                        key={neighborhood.id}
                        onClick={() => setSelectedNeighborhood(isSelected ? null : neighborhood)}
                        className={`group relative flex flex-col items-center justify-center rounded-lg border p-2.5 transition-all hover:shadow-md ${
                          isSelected 
                            ? 'border-primary bg-primary/5 ring-2 ring-primary' 
                            : 'border-border bg-card hover:border-primary/50'
                        }`}
                      >
                        <div className={`mb-1.5 h-2 w-full rounded-full ${getMetricColor(neighborhood)}`} />
                        <span className="text-xs font-medium truncate max-w-full text-center leading-tight">
                          {neighborhood.name}
                        </span>
                        <span className={`text-base font-bold ${getMetricTextColor(neighborhood)}`}>
                          {selectedMetric === "coverage" ? `${metricValue}%` : formatNumber(metricValue)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Detalhes do Bairro Selecionado */}
            {selectedNeighborhood && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    {selectedNeighborhood.name}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => setSelectedNeighborhood(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
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
                    <Badge 
                      variant="outline" 
                      className={`${getRiskLevel(selectedNeighborhood.coverage).textColor} ${getRiskLevel(selectedNeighborhood.coverage).bgLight}`}
                    >
                      Risco {getRiskLevel(selectedNeighborhood.coverage).level}
                    </Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Cobertura Vacinal */}
                    <div>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Cobertura Vacinal</span>
                        <span className={`font-bold ${getRiskLevel(selectedNeighborhood.coverage).textColor}`}>
                          {selectedNeighborhood.coverage}%
                        </span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all ${getRiskLevel(selectedNeighborhood.coverage).color}`}
                          style={{ width: `${selectedNeighborhood.coverage}%` }}
                        />
                      </div>
                      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                        <span>0%</span>
                        <span className="text-primary font-medium">Meta: 95%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* Estatisticas */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-muted/50 p-2.5">
                        <p className="text-[10px] text-muted-foreground">Casos Totais</p>
                        <p className="text-lg font-bold">{formatNumber(selectedNeighborhood.cases)}</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2.5">
                        <p className="text-[10px] text-muted-foreground">Obitos</p>
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">
                          {formatNumber(selectedNeighborhood.deaths)}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2.5">
                        <p className="text-[10px] text-muted-foreground">Populacao</p>
                        <p className="text-lg font-bold">{formatNumber(selectedNeighborhood.population)}</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2.5">
                        <p className="text-[10px] text-muted-foreground">Casos/1000 hab.</p>
                        <p className="text-lg font-bold">
                          {Math.round(selectedNeighborhood.cases / selectedNeighborhood.population * 1000)}
                        </p>
                      </div>
                    </div>

                    {/* UBS Proxima */}
                    {nearestUBS && (
                      <div className="rounded-lg border bg-primary/5 p-3">
                        <div className="flex items-start gap-2.5">
                          <Building2 className="h-4 w-4 text-primary mt-0.5" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{nearestUBS.name}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {nearestUBS.address}
                            </p>
                            <div className="flex items-center gap-1 mt-1.5 text-xs text-primary">
                              <Phone className="h-3 w-3" />
                              <span>{nearestUBS.phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Recomendacao */}
                    {selectedNeighborhood.coverage < 70 && (
                      <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-900 dark:bg-orange-950/30">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-sm text-orange-800 dark:text-orange-200">
                              Atencao Recomendada
                            </p>
                            <p className="mt-0.5 text-xs text-orange-700 dark:text-orange-300">
                              Este bairro esta abaixo da meta. Procure uma UBS para se vacinar.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
