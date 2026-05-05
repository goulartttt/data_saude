"use client"

import { useState, useMemo } from "react"
import { 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Building2,
  Phone,
  Navigation,
  Thermometer,
  Bug,
  HeartPulse,
  Skull,
  TrendingUp,
  TrendingDown,
  Users,
  Activity
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
import { zonesData, zoneSummary, awarenessContent, formatNumber, getRiskLevel, realDiseaseData } from "@/lib/health-data"

const zones = ["Todas", "Zona Norte", "Zona Sul", "Zona Leste", "Zona Oeste", "Centro"]

const diseaseOptions = [
  { value: "all", label: "Todas as Doencas", icon: Skull },
  { value: "dengue", label: "Dengue", icon: Bug },
  { value: "hiv", label: "HIV", icon: HeartPulse },
  { value: "aids", label: "AIDS", icon: Activity },
  { value: "malaria", label: "Malaria", icon: AlertTriangle },
]

const metricOptions = [
  { value: "coverage", label: "Cobertura Vacinal" },
  { value: "cases", label: "Casos por 1000 hab." },
  { value: "deaths", label: "Obitos" },
]

// Funcao para gerar dados de doencas por bairro (simulado com base nos dados existentes)
const generateDiseaseData = (neighborhood) => {
  const seed = neighborhood.name.length + neighborhood.population
  const dengueRatio = 0.65 + ((seed % 20) / 100)
  const hivRatio = 0.20 - ((seed % 15) / 100)
  const aidsRatio = 0.10 + ((seed % 8) / 100)
  const malariaRatio = 0.05 + ((seed % 5) / 100)
  
  return {
    dengue: {
      cases: Math.round(neighborhood.cases * dengueRatio),
      deaths: Math.round(neighborhood.deaths * dengueRatio),
    },
    hiv: {
      cases: Math.round(neighborhood.cases * hivRatio),
      deaths: Math.round(neighborhood.deaths * hivRatio),
    },
    aids: {
      cases: Math.round(neighborhood.cases * aidsRatio),
      deaths: Math.round(neighborhood.deaths * aidsRatio),
    },
    malaria: {
      cases: Math.round(neighborhood.cases * malariaRatio),
      deaths: Math.round(neighborhood.deaths * malariaRatio),
    },
  }
}

// Mapa simplificado de Sao Paulo com grid
function SaoPauloMap({ selectedZone, onZoneClick, zoneSummary }) {
  const [hoveredZone, setHoveredZone] = useState(null)

  const getZoneColor = (zone) => {
    const zoneData = zoneSummary.find(z => z.zone === zone)
    if (!zoneData) return "#d1d5db"
    
    const coverage = zoneData.coverage
    if (coverage >= 80) return "#10b981"
    if (coverage >= 70) return "#22c55e"
    if (coverage >= 60) return "#eab308"
    if (coverage >= 50) return "#f97316"
    return "#ef4444"
  }

  const isSelected = (zone) => selectedZone === zone
  const isHovered = (zone) => hoveredZone === zone

  const zoneInfo = (zone) => zoneSummary.find(z => z.zone === zone)

  const ZoneCard = ({ zone, x, y, width, height }) => {
    const info = zoneInfo(zone)
    const color = getZoneColor(zone)
    const selected = isSelected(zone)
    const hovered = isHovered(zone)
    
    return (
      <g 
        className="cursor-pointer"
        onClick={() => onZoneClick(zone)}
        onMouseEnter={() => setHoveredZone(zone)}
        onMouseLeave={() => setHoveredZone(null)}
      >
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx="12"
          fill={color}
          stroke={selected ? "#1e40af" : hovered ? "#3b82f6" : "#ffffff"}
          strokeWidth={selected ? 4 : hovered ? 3 : 2}
          style={{ 
            transition: "all 0.2s ease",
            filter: selected ? "drop-shadow(0 4px 12px rgba(0,0,0,0.25))" : "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
          }}
        />
        <text 
          x={x + width / 2} 
          y={y + height / 2 - 8} 
          textAnchor="middle" 
          className="fill-white text-sm font-semibold pointer-events-none"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
        >
          {zone}
        </text>
        <text 
          x={x + width / 2} 
          y={y + height / 2 + 12} 
          textAnchor="middle" 
          className="fill-white/90 text-xs font-medium pointer-events-none"
          style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
        >
          {info?.coverage}% cobertura
        </text>
      </g>
    )
  }

  return (
    <div className="relative w-full">
      <svg 
        viewBox="0 0 400 320" 
        className="w-full h-auto"
        style={{ maxHeight: "400px" }}
      >
        {/* Background */}
        <rect x="0" y="0" width="400" height="280" fill="#f8fafc" rx="16"/>
        
        {/* Layout em cruz representando SP */}
        {/* Zona Norte - topo */}
        <ZoneCard zone="Zona Norte" x={120} y={15} width={160} height={70} />
        
        {/* Zona Oeste - esquerda */}
        <ZoneCard zone="Zona Oeste" x={15} y={95} width={100} height={90} />
        
        {/* Centro - meio */}
        <ZoneCard zone="Centro" x={125} y={95} width={150} height={90} />
        
        {/* Zona Leste - direita */}
        <ZoneCard zone="Zona Leste" x={285} y={95} width={100} height={90} />
        
        {/* Zona Sul - baixo */}
        <ZoneCard zone="Zona Sul" x={120} y={195} width={160} height={70} />

        {/* Legenda */}
        <g transform="translate(40, 290)">
          <rect x="0" y="0" width="320" height="24" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
          <rect x="8" y="6" width="304" height="12" rx="6" fill="url(#legendGradientSimple)"/>
        </g>
        
        <defs>
          <linearGradient id="legendGradientSimple" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444"/>
            <stop offset="25%" stopColor="#f97316"/>
            <stop offset="50%" stopColor="#eab308"/>
            <stop offset="75%" stopColor="#22c55e"/>
            <stop offset="100%" stopColor="#10b981"/>
          </linearGradient>
        </defs>
      </svg>
      
      {/* Labels da legenda */}
      <div className="flex justify-between px-10 -mt-1 text-[10px] text-muted-foreground">
        <span>Baixa cobertura</span>
        <span>Alta cobertura</span>
      </div>

      {selectedZone !== "Todas" && (
        <Badge 
          variant="secondary" 
          className="absolute top-3 left-3 gap-1.5 bg-white/95 backdrop-blur-sm shadow-sm border text-xs"
        >
          <MapPin className="h-3 w-3 text-primary" />
          {selectedZone}
          <button 
            onClick={() => onZoneClick(selectedZone)}
            className="ml-0.5 hover:text-destructive transition-colors"
          >
            x
          </button>
        </Badge>
      )}
    </div>
  )
}

export function HeatmapSection() {
  const [selectedZone, setSelectedZone] = useState("Todas")
  const [selectedDisease, setSelectedDisease] = useState("all")
  const [selectedMetric, setSelectedMetric] = useState("coverage")
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null)

  const handleZoneClick = (zone) => {
    setSelectedZone(selectedZone === zone ? "Todas" : zone)
    setSelectedNeighborhood(null)
  }

  const getFilteredStats = (neighborhood) => {
    if (selectedDisease === "all") {
      return { cases: neighborhood.cases, deaths: neighborhood.deaths }
    }
    const diseaseData = generateDiseaseData(neighborhood)
    return diseaseData[selectedDisease]
  }

  const filteredNeighborhoods = useMemo(() => {
    let neighborhoods = [...zonesData]
    
    if (selectedZone !== "Todas") {
      neighborhoods = neighborhoods.filter(n => n.zone === selectedZone)
    }

    if (selectedMetric === "coverage") {
      neighborhoods.sort((a, b) => a.coverage - b.coverage)
    } else if (selectedMetric === "cases") {
      neighborhoods.sort((a, b) => {
        const aCases = getFilteredStats(a).cases
        const bCases = getFilteredStats(b).cases
        return (bCases / b.population * 1000) - (aCases / a.population * 1000)
      })
    } else {
      neighborhoods.sort((a, b) => {
        const aDeaths = getFilteredStats(a).deaths
        const bDeaths = getFilteredStats(b).deaths
        return bDeaths - aDeaths
      })
    }

    return neighborhoods
  }, [selectedZone, selectedMetric, selectedDisease])

  const getMetricValue = (neighborhood) => {
    const stats = getFilteredStats(neighborhood)
    if (selectedMetric === "coverage") return neighborhood.coverage
    if (selectedMetric === "cases") return Math.round(stats.cases / neighborhood.population * 1000)
    return stats.deaths
  }

  const getMetricColor = (neighborhood) => {
    if (selectedMetric === "coverage") {
      const coverage = neighborhood.coverage
      if (coverage >= 85) return "bg-emerald-500"
      if (coverage >= 75) return "bg-green-500"
      if (coverage >= 65) return "bg-yellow-500"
      if (coverage >= 55) return "bg-orange-500"
      return "bg-red-500"
    } else {
      const value = getMetricValue(neighborhood)
      const max = Math.max(...zonesData.map(n => getMetricValue(n)))
      const ratio = value / max
      if (ratio >= 0.8) return "bg-red-500"
      if (ratio >= 0.6) return "bg-orange-500"
      if (ratio >= 0.4) return "bg-yellow-500"
      if (ratio >= 0.2) return "bg-green-500"
      return "bg-emerald-500"
    }
  }

  const getMetricTextColor = (neighborhood) => {
    if (selectedMetric === "coverage") {
      const coverage = neighborhood.coverage
      if (coverage >= 80) return "text-emerald-600"
      if (coverage >= 70) return "text-green-600"
      if (coverage >= 60) return "text-yellow-600"
      if (coverage >= 50) return "text-orange-600"
      return "text-red-600"
    } else {
      const value = getMetricValue(neighborhood)
      const max = Math.max(...zonesData.map(n => getMetricValue(n)))
      const ratio = value / max
      if (ratio >= 0.6) return "text-red-600"
      if (ratio >= 0.3) return "text-yellow-600"
      return "text-green-600"
    }
  }

  const stats = useMemo(() => {
    const critical = zonesData.filter(n => n.coverage < 55).length
    const alert = zonesData.filter(n => n.coverage >= 55 && n.coverage < 70).length
    const ok = zonesData.filter(n => n.coverage >= 70).length
    const avgCoverage = Math.round(zonesData.reduce((sum, n) => sum + n.coverage, 0) / zonesData.length)
    const totalCases = zonesData.reduce((sum, n) => sum + n.cases, 0)
    const totalPopulation = zonesData.reduce((sum, n) => sum + n.population, 0)
    
    return { critical, alert, ok, avgCoverage, totalCases, totalPopulation }
  }, [])

  const nearestUBS = useMemo(() => {
    if (!selectedNeighborhood) return null
    return awarenessContent.ubsList.find(ubs => ubs.zone === selectedNeighborhood.zone)
  }, [selectedNeighborhood])

  // Totais de doencas reais
  const diseaseTotals = useMemo(() => {
    const dengue2024 = realDiseaseData.find(d => d.doenca === "Dengue" && d.ano === 2024)?.TOTAL_ANUAL || 0
    const dengue2025 = realDiseaseData.find(d => d.doenca === "Dengue" && d.ano === 2025)?.TOTAL_ANUAL || 0
    return {
      dengue: dengue2024 + dengue2025,
      hiv: (realDiseaseData.find(d => d.doenca === "HIV" && d.ano === 2024)?.TOTAL_ANUAL || 0) +
           (realDiseaseData.find(d => d.doenca === "HIV" && d.ano === 2025)?.TOTAL_ANUAL || 0),
      aids: (realDiseaseData.find(d => d.doenca === "AIDS" && d.ano === 2024)?.TOTAL_ANUAL || 0) +
            (realDiseaseData.find(d => d.doenca === "AIDS" && d.ano === 2025)?.TOTAL_ANUAL || 0),
      malaria: (realDiseaseData.find(d => d.doenca === "Malaria" && d.ano === 2024)?.TOTAL_ANUAL || 0) +
               (realDiseaseData.find(d => d.doenca === "Malaria" && d.ano === 2025)?.TOTAL_ANUAL || 0),
    }
  }, [])

  return (
    <section id="mapa" className="py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <Badge variant="outline" className="mb-4 gap-2 border-primary/30">
            <Thermometer className="h-3.5 w-3.5" />
            Mapa de Calor Interativo
          </Badge>
          <h2 
            className="mb-3 text-3xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Situacao por Zona e Bairro
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Visualize a situacao de saude publica em cada regiao de Sao Paulo. 
            Clique nas zonas do mapa para explorar os dados detalhados.
          </p>
        </div>

        {/* Cards de Resumo */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                <p className="text-sm text-muted-foreground">Bairros Criticos</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-yellow-500">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
                <Info className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.alert}</p>
                <p className="text-sm text-muted-foreground">Em Alerta</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.ok}</p>
                <p className="text-sm text-muted-foreground">Adequados</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.avgCoverage}%</p>
                <p className="text-sm text-muted-foreground">Cobertura Media</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{formatNumber(stats.totalPopulation)}</p>
                <p className="text-sm text-muted-foreground">Populacao Total</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Mapa de Sao Paulo */}
          <Card className="overflow-hidden shadow-lg">
            <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Mapa de Sao Paulo
              </CardTitle>
              <CardDescription>
                Clique em uma zona para ver detalhes dos bairros
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <SaoPauloMap 
                selectedZone={selectedZone}
                onZoneClick={handleZoneClick}
                zoneSummary={zoneSummary}
              />
            </CardContent>
          </Card>

          {/* Lista de Bairros */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Bairros {selectedZone !== "Todas" && `- ${selectedZone}`}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-2 mt-1">
                    <span>{filteredNeighborhoods.length} bairros encontrados</span>
                    {selectedDisease !== "all" && (
                      <Badge variant="secondary" className="text-xs">
                        {diseaseOptions.find(d => d.value === selectedDisease)?.label}
                      </Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Select value={selectedDisease} onValueChange={setSelectedDisease}>
                  <SelectTrigger className="w-[150px] h-9">
                    <SelectValue placeholder="Doenca" />
                  </SelectTrigger>
                  <SelectContent>
                    {diseaseOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <span className="flex items-center gap-2">
                          <opt.icon className="h-3.5 w-3.5" />
                          {opt.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedZone} onValueChange={setSelectedZone}>
                  <SelectTrigger className="w-[130px] h-9">
                    <SelectValue placeholder="Zona" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map(zone => (
                      <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="Metrica" />
                  </SelectTrigger>
                  <SelectContent>
                    {metricOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2">
                {filteredNeighborhoods.map((neighborhood, index) => (
                  <div
                    key={neighborhood.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all hover:bg-muted/50 hover:shadow-sm ${
                      selectedNeighborhood?.name === neighborhood.name ? 'bg-primary/5 ring-2 ring-primary shadow-md' : ''
                    }`}
                    onClick={() => setSelectedNeighborhood(
                      selectedNeighborhood?.name === neighborhood.name ? null : neighborhood
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-6 text-right font-mono">{index + 1}</span>
                      <div className={`w-3 h-3 rounded-full ${getMetricColor(neighborhood)} shadow-sm`} />
                      <div>
                        <p className="font-medium text-sm">{neighborhood.name}</p>
                        <p className="text-xs text-muted-foreground">{neighborhood.zone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${getMetricTextColor(neighborhood)}`}>
                        {getMetricValue(neighborhood)}{selectedMetric === "coverage" ? "%" : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {metricOptions.find(m => m.value === selectedMetric)?.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detalhes do Bairro Selecionado */}
        {selectedNeighborhood && (
          <Card className="mt-6 shadow-lg border-t-4 border-t-primary">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {selectedNeighborhood.name}
              </CardTitle>
              <CardDescription>{selectedNeighborhood.zone}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1 p-4 rounded-xl bg-muted/30">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Populacao
                  </p>
                  <p className="text-2xl font-bold">{formatNumber(selectedNeighborhood.population)}</p>
                </div>
                <div className="space-y-1 p-4 rounded-xl bg-muted/30">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Cobertura Vacinal
                  </p>
                  <p className={`text-2xl font-bold ${getMetricTextColor(selectedNeighborhood)}`}>
                    {selectedNeighborhood.coverage}%
                  </p>
                </div>
                <div className="space-y-1 p-4 rounded-xl bg-muted/30">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Casos {selectedDisease !== "all" ? `(${diseaseOptions.find(d => d.value === selectedDisease)?.label})` : "Registrados"}
                  </p>
                  <p className="text-2xl font-bold">{formatNumber(getFilteredStats(selectedNeighborhood).cases)}</p>
                </div>
                <div className="space-y-1 p-4 rounded-xl bg-muted/30">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Obitos {selectedDisease !== "all" ? `(${diseaseOptions.find(d => d.value === selectedDisease)?.label})` : ""}
                  </p>
                  <p className="text-2xl font-bold text-red-600">{getFilteredStats(selectedNeighborhood).deaths}</p>
                </div>
              </div>
              
              {selectedDisease === "all" && (
                <div className="mt-6 grid gap-3 sm:grid-cols-4">
                  {["dengue", "hiv", "aids", "malaria"].map((disease) => {
                    const diseaseInfo = diseaseOptions.find(d => d.value === disease)
                    const stats = generateDiseaseData(selectedNeighborhood)[disease]
                    const IconComponent = diseaseInfo?.icon
                    return (
                      <div key={disease} className="rounded-xl border p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-3">
                          {IconComponent && <IconComponent className="h-5 w-5 text-muted-foreground" />}
                          <span className="font-semibold text-sm">{diseaseInfo?.label}</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Casos:</span>
                            <strong>{formatNumber(stats.cases)}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Obitos:</span>
                            <strong className="text-red-600">{stats.deaths}</strong>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {nearestUBS && (
                <div className="mt-6 p-5 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    UBS mais proxima: {nearestUBS.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">{nearestUBS.address}</p>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      size="sm" 
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nearestUBS.address)}`, '_blank')}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Ver no Mapa
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(`tel:${nearestUBS.phone}`, '_self')}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {nearestUBS.phone}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
