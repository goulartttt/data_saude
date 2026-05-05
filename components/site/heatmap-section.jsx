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

// Mapa SVG estilizado de Sao Paulo
function SaoPauloMap({ selectedZone, onZoneClick, zoneSummary }) {
  const [hoveredZone, setHoveredZone] = useState(null)

  const getZoneColor = (zone) => {
    const zoneData = zoneSummary.find(z => z.zone === zone)
    if (!zoneData) return "#d1d5db"
    
    const coverage = zoneData.coverage
    if (coverage >= 80) return "#10b981"
    if (coverage >= 75) return "#34d399"
    if (coverage >= 70) return "#84cc16"
    if (coverage >= 65) return "#eab308"
    if (coverage >= 60) return "#f97316"
    if (coverage >= 55) return "#ef4444"
    return "#dc2626"
  }

  const isSelected = (zone) => selectedZone === zone
  const isHovered = (zone) => hoveredZone === zone

  const getZoneOpacity = (zone) => {
    if (isSelected(zone)) return 1
    if (isHovered(zone)) return 0.95
    return 0.85
  }

  const getStrokeWidth = (zone) => {
    if (isSelected(zone)) return 4
    if (isHovered(zone)) return 3
    return 1.5
  }

  const getStrokeColor = (zone) => {
    if (isSelected(zone)) return "#1e40af"
    if (isHovered(zone)) return "#3b82f6"
    return "#64748b"
  }

  const zoneInfo = (zone) => {
    const data = zoneSummary.find(z => z.zone === zone)
    return data
  }

  return (
    <div className="relative w-full">
      <svg 
        viewBox="0 0 600 520" 
        className="w-full h-auto"
        style={{ maxHeight: "500px" }}
      >
        <defs>
          <linearGradient id="legendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dc2626"/>
            <stop offset="20%" stopColor="#f97316"/>
            <stop offset="40%" stopColor="#eab308"/>
            <stop offset="60%" stopColor="#84cc16"/>
            <stop offset="80%" stopColor="#34d399"/>
            <stop offset="100%" stopColor="#10b981"/>
          </linearGradient>
          
          <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.2"/>
          </filter>

          <filter id="glowEffect" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feFlood floodColor="#3b82f6" floodOpacity="0.5"/>
            <feComposite in2="blur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <rect x="0" y="0" width="600" height="480" fill="#f8fafc" rx="16"/>

        {/* Zona Norte */}
        <g 
          className="cursor-pointer transition-all duration-300"
          onClick={() => onZoneClick("Zona Norte")}
          onMouseEnter={() => setHoveredZone("Zona Norte")}
          onMouseLeave={() => setHoveredZone(null)}
          filter={isSelected("Zona Norte") ? "url(#glowEffect)" : "url(#dropShadow)"}
        >
          <path
            d="M 145 50 
               C 175 38, 220 30, 260 28 
               C 310 26, 360 30, 400 42 
               C 435 55, 460 75, 475 105 
               C 485 130, 480 155, 460 175 
               C 440 192, 405 200, 365 205 
               C 320 210, 275 208, 235 200 
               C 195 192, 160 180, 140 160 
               C 115 135, 115 100, 145 50 Z"
            fill={getZoneColor("Zona Norte")}
            fillOpacity={getZoneOpacity("Zona Norte")}
            stroke={getStrokeColor("Zona Norte")}
            strokeWidth={getStrokeWidth("Zona Norte")}
            strokeLinejoin="round"
            style={{ transition: "all 0.3s ease" }}
          />
          <text 
            x="300" 
            y="105" 
            textAnchor="middle" 
            className="fill-white text-sm font-bold pointer-events-none"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
          >
            Zona Norte
          </text>
          <text 
            x="300" 
            y="128" 
            textAnchor="middle" 
            className="fill-white/90 text-xs font-medium pointer-events-none"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            {zoneInfo("Zona Norte")?.coverage}% cobertura
          </text>
        </g>

        {/* Zona Oeste */}
        <g 
          className="cursor-pointer transition-all duration-300"
          onClick={() => onZoneClick("Zona Oeste")}
          onMouseEnter={() => setHoveredZone("Zona Oeste")}
          onMouseLeave={() => setHoveredZone(null)}
          filter={isSelected("Zona Oeste") ? "url(#glowEffect)" : "url(#dropShadow)"}
        >
          <path
            d="M 140 160 
               C 160 180, 195 192, 235 200 
               C 225 230, 215 260, 200 290 
               C 180 325, 150 355, 120 370 
               C 85 385, 50 380, 30 355 
               C 10 325, 15 285, 30 250 
               C 50 210, 85 180, 140 160 Z"
            fill={getZoneColor("Zona Oeste")}
            fillOpacity={getZoneOpacity("Zona Oeste")}
            stroke={getStrokeColor("Zona Oeste")}
            strokeWidth={getStrokeWidth("Zona Oeste")}
            strokeLinejoin="round"
            style={{ transition: "all 0.3s ease" }}
          />
          <text 
            x="115" 
            y="260" 
            textAnchor="middle" 
            className="fill-white text-sm font-bold pointer-events-none"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
          >
            Zona Oeste
          </text>
          <text 
            x="115" 
            y="283" 
            textAnchor="middle" 
            className="fill-white/90 text-xs font-medium pointer-events-none"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            {zoneInfo("Zona Oeste")?.coverage}% cobertura
          </text>
        </g>

        {/* Centro */}
        <g 
          className="cursor-pointer transition-all duration-300"
          onClick={() => onZoneClick("Centro")}
          onMouseEnter={() => setHoveredZone("Centro")}
          onMouseLeave={() => setHoveredZone(null)}
          filter={isSelected("Centro") ? "url(#glowEffect)" : "url(#dropShadow)"}
        >
          <path
            d="M 235 200 
               C 275 208, 320 210, 365 205 
               C 380 230, 385 260, 380 290 
               C 370 320, 345 345, 310 355 
               C 270 365, 230 360, 200 345 
               C 175 330, 165 305, 170 275 
               C 178 245, 200 220, 235 200 Z"
            fill={getZoneColor("Centro")}
            fillOpacity={getZoneOpacity("Centro")}
            stroke={getStrokeColor("Centro")}
            strokeWidth={getStrokeWidth("Centro")}
            strokeLinejoin="round"
            style={{ transition: "all 0.3s ease" }}
          />
          <text 
            x="280" 
            y="270" 
            textAnchor="middle" 
            className="fill-white text-sm font-bold pointer-events-none"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
          >
            Centro
          </text>
          <text 
            x="280" 
            y="293" 
            textAnchor="middle" 
            className="fill-white/90 text-xs font-medium pointer-events-none"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            {zoneInfo("Centro")?.coverage}% cobertura
          </text>
        </g>

        {/* Zona Leste */}
        <g 
          className="cursor-pointer transition-all duration-300"
          onClick={() => onZoneClick("Zona Leste")}
          onMouseEnter={() => setHoveredZone("Zona Leste")}
          onMouseLeave={() => setHoveredZone(null)}
          filter={isSelected("Zona Leste") ? "url(#glowEffect)" : "url(#dropShadow)"}
        >
          <path
            d="M 365 205 
               C 405 200, 440 192, 460 175 
               C 495 190, 530 215, 555 250 
               C 580 290, 590 340, 575 385 
               C 555 430, 510 455, 455 460 
               C 400 465, 355 450, 325 420 
               C 345 395, 360 365, 370 335 
               C 380 300, 385 260, 380 230 
               C 378 215, 372 208, 365 205 Z"
            fill={getZoneColor("Zona Leste")}
            fillOpacity={getZoneOpacity("Zona Leste")}
            stroke={getStrokeColor("Zona Leste")}
            strokeWidth={getStrokeWidth("Zona Leste")}
            strokeLinejoin="round"
            style={{ transition: "all 0.3s ease" }}
          />
          <text 
            x="465" 
            y="320" 
            textAnchor="middle" 
            className="fill-white text-sm font-bold pointer-events-none"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
          >
            Zona Leste
          </text>
          <text 
            x="465" 
            y="343" 
            textAnchor="middle" 
            className="fill-white/90 text-xs font-medium pointer-events-none"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            {zoneInfo("Zona Leste")?.coverage}% cobertura
          </text>
        </g>

        {/* Zona Sul */}
        <g 
          className="cursor-pointer transition-all duration-300"
          onClick={() => onZoneClick("Zona Sul")}
          onMouseEnter={() => setHoveredZone("Zona Sul")}
          onMouseLeave={() => setHoveredZone(null)}
          filter={isSelected("Zona Sul") ? "url(#glowEffect)" : "url(#dropShadow)"}
        >
          <path
            d="M 120 370 
               C 150 355, 180 325, 200 290 
               C 215 260, 225 230, 235 200 
               C 200 220, 178 245, 170 275 
               C 165 305, 175 330, 200 345 
               C 230 360, 270 365, 310 355 
               C 325 380, 330 410, 320 440 
               C 305 470, 265 490, 220 495 
               C 165 500, 115 485, 85 455 
               C 55 420, 55 385, 85 370 
               C 95 365, 108 368, 120 370 Z"
            fill={getZoneColor("Zona Sul")}
            fillOpacity={getZoneOpacity("Zona Sul")}
            stroke={getStrokeColor("Zona Sul")}
            strokeWidth={getStrokeWidth("Zona Sul")}
            strokeLinejoin="round"
            style={{ transition: "all 0.3s ease" }}
          />
          <text 
            x="200" 
            y="420" 
            textAnchor="middle" 
            className="fill-white text-sm font-bold pointer-events-none"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
          >
            Zona Sul
          </text>
          <text 
            x="200" 
            y="443" 
            textAnchor="middle" 
            className="fill-white/90 text-xs font-medium pointer-events-none"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            {zoneInfo("Zona Sul")?.coverage}% cobertura
          </text>
        </g>

        {/* Legenda */}
        <g transform="translate(90, 485)">
          <rect x="0" y="0" width="420" height="28" rx="14" fill="white" stroke="#e2e8f0" strokeWidth="1.5"/>
          <rect x="10" y="8" width="400" height="12" rx="6" fill="url(#legendGradient)"/>
        </g>
        <text x="90" y="528" className="text-[10px] fill-muted-foreground font-medium">Baixa</text>
        <text x="510" y="528" textAnchor="end" className="text-[10px] fill-muted-foreground font-medium">Alta</text>
        <text x="300" y="528" textAnchor="middle" className="text-[10px] fill-muted-foreground font-semibold">Cobertura Vacinal</text>
      </svg>

      {selectedZone !== "Todas" && (
        <Badge 
          variant="secondary" 
          className="absolute top-4 left-4 gap-2 bg-white/95 backdrop-blur-sm shadow-md border"
        >
          <MapPin className="h-3.5 w-3.5 text-primary" />
          {selectedZone}
          <button 
            onClick={() => onZoneClick(selectedZone)}
            className="ml-1 hover:text-destructive transition-colors"
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
