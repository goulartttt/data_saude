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
  Skull
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

const diseaseOptions = [
  { value: "all", label: "Todas as Doencas", icon: Skull },
  { value: "dengue", label: "Dengue", icon: Bug },
  { value: "hiv", label: "HIV/AIDS", icon: HeartPulse },
  { value: "malaria", label: "Malaria", icon: AlertTriangle },
]

const metricOptions = [
  { value: "coverage", label: "Cobertura Vacinal" },
  { value: "cases", label: "Casos por 1000 hab." },
  { value: "deaths", label: "Obitos" },
]

// Funcao para gerar dados de doencas por bairro (simulado com base nos dados existentes)
const generateDiseaseData = (neighborhood) => {
  // Usar o nome do bairro como seed para gerar numeros consistentes
  const seed = neighborhood.name.length + neighborhood.population
  const dengueRatio = 0.65 + ((seed % 20) / 100)
  const hivRatio = 0.25 - ((seed % 15) / 100)
  const malariaRatio = 0.10 + ((seed % 10) / 100)
  
  return {
    dengue: {
      cases: Math.round(neighborhood.cases * dengueRatio),
      deaths: Math.round(neighborhood.deaths * dengueRatio),
    },
    hiv: {
      cases: Math.round(neighborhood.cases * hivRatio),
      deaths: Math.round(neighborhood.deaths * hivRatio),
    },
    malaria: {
      cases: Math.round(neighborhood.cases * malariaRatio),
      deaths: Math.round(neighborhood.deaths * malariaRatio),
    },
  }
}

// Mapa SVG com contorno realista de Sao Paulo
function SaoPauloMap({ selectedZone, onZoneClick, zoneSummary, selectedMetric }) {
  const [hoveredZone, setHoveredZone] = useState(null)

  // Gerar cor baseada na cobertura com gradiente suave
  const getZoneColor = (zone) => {
    const zoneData = zoneSummary.find(z => z.zone === zone)
    if (!zoneData) return "#d1d5db"
    
    const coverage = zoneData.coverage
    // Gradiente de vermelho (baixa) para verde (alta)
    if (coverage >= 80) return "#22c55e" // verde
    if (coverage >= 75) return "#4ade80" // verde claro
    if (coverage >= 70) return "#a3e635" // verde-limao
    if (coverage >= 65) return "#facc15" // amarelo
    if (coverage >= 60) return "#fb923c" // laranja
    if (coverage >= 55) return "#f87171" // vermelho claro
    return "#ef4444" // vermelho
  }

  const isSelected = (zone) => selectedZone === zone
  const isHovered = (zone) => hoveredZone === zone

  const getZoneOpacity = (zone) => {
    if (isSelected(zone)) return 1
    if (isHovered(zone)) return 0.9
    return 0.85
  }

  const getStrokeWidth = (zone) => {
    if (isSelected(zone)) return 3
    if (isHovered(zone)) return 2.5
    return 1.5
  }

  const getStrokeColor = (zone) => {
    if (isSelected(zone) || isHovered(zone)) return "#1e3a8a"
    return "#475569"
  }

  return (
    <div className="relative w-full">
      <svg 
        viewBox="0 0 600 500" 
        className="w-full h-auto"
        style={{ maxHeight: "480px" }}
      >
        {/* Definicoes de gradiente para legenda */}
        <defs>
          <linearGradient id="heatLegendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444"/>
            <stop offset="25%" stopColor="#fb923c"/>
            <stop offset="50%" stopColor="#facc15"/>
            <stop offset="75%" stopColor="#a3e635"/>
            <stop offset="100%" stopColor="#22c55e"/>
          </linearGradient>
          
          {/* Sombra suave */}
          <filter id="zoneShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
          </filter>

          {/* Brilho para zona selecionada */}
          <filter id="selectedGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feFlood floodColor="#3b82f6" floodOpacity="0.4"/>
            <feComposite in2="blur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Fundo suave */}
        <rect x="0" y="0" width="600" height="460" fill="#f8fafc" rx="12"/>

        {/* Contorno realista de Sao Paulo - baseado no formato real da cidade */}
        
        {/* Zona Norte - Parte superior da cidade */}
        <g 
          className="cursor-pointer transition-all duration-200"
          onClick={() => onZoneClick("Zona Norte")}
          onMouseEnter={() => setHoveredZone("Zona Norte")}
          onMouseLeave={() => setHoveredZone(null)}
          filter={isSelected("Zona Norte") ? "url(#selectedGlow)" : "url(#zoneShadow)"}
        >
          <path
            d="M 145 45 
               C 170 35, 210 28, 250 25 
               C 290 22, 340 25, 380 35 
               C 420 45, 450 65, 465 95 
               C 475 115, 475 135, 460 155 
               C 445 170, 420 180, 390 185 
               C 355 190, 320 188, 290 185 
               C 255 182, 220 185, 185 175 
               C 155 165, 130 150, 120 125 
               C 110 100, 120 70, 145 45 Z"
            fill={getZoneColor("Zona Norte")}
            fillOpacity={getZoneOpacity("Zona Norte")}
            stroke={getStrokeColor("Zona Norte")}
            strokeWidth={getStrokeWidth("Zona Norte")}
            strokeLinejoin="round"
            style={{ transition: "all 0.2s ease" }}
          />
          <text 
            x="290" 
            y="100" 
            textAnchor="middle" 
            className="fill-white text-sm font-semibold pointer-events-none"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            Zona Norte
          </text>
          <text 
            x="290" 
            y="120" 
            textAnchor="middle" 
            className="fill-white/90 text-xs pointer-events-none"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            {zoneSummary.find(z => z.zone === "Zona Norte")?.coverage}%
          </text>
        </g>

        {/* Zona Oeste - Lado esquerdo */}
        <g 
          className="cursor-pointer transition-all duration-200"
          onClick={() => onZoneClick("Zona Oeste")}
          onMouseEnter={() => setHoveredZone("Zona Oeste")}
          onMouseLeave={() => setHoveredZone(null)}
          filter={isSelected("Zona Oeste") ? "url(#selectedGlow)" : "url(#zoneShadow)"}
        >
          <path
            d="M 120 125 
               C 130 150, 155 165, 185 175 
               C 195 195, 195 220, 190 245 
               C 185 275, 170 305, 150 330 
               C 130 355, 100 365, 70 355 
               C 45 345, 30 320, 25 290 
               C 20 255, 25 220, 40 190 
               C 55 160, 80 140, 120 125 Z"
            fill={getZoneColor("Zona Oeste")}
            fillOpacity={getZoneOpacity("Zona Oeste")}
            stroke={getStrokeColor("Zona Oeste")}
            strokeWidth={getStrokeWidth("Zona Oeste")}
            strokeLinejoin="round"
            style={{ transition: "all 0.2s ease" }}
          />
          <text 
            x="100" 
            y="235" 
            textAnchor="middle" 
            className="fill-white text-sm font-semibold pointer-events-none"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            Zona Oeste
          </text>
          <text 
            x="100" 
            y="255" 
            textAnchor="middle" 
            className="fill-white/90 text-xs pointer-events-none"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            {zoneSummary.find(z => z.zone === "Zona Oeste")?.coverage}%
          </text>
        </g>

        {/* Centro - Nucleo da cidade */}
        <g 
          className="cursor-pointer transition-all duration-200"
          onClick={() => onZoneClick("Centro")}
          onMouseEnter={() => setHoveredZone("Centro")}
          onMouseLeave={() => setHoveredZone(null)}
          filter={isSelected("Centro") ? "url(#selectedGlow)" : "url(#zoneShadow)"}
        >
          <path
            d="M 185 175 
               C 220 185, 255 182, 290 185 
               C 320 188, 355 190, 390 185 
               C 400 210, 400 240, 390 270 
               C 375 295, 350 310, 320 315 
               C 285 320, 250 318, 220 310 
               C 195 302, 180 285, 175 260 
               C 170 235, 175 205, 185 175 Z"
            fill={getZoneColor("Centro")}
            fillOpacity={getZoneOpacity("Centro")}
            stroke={getStrokeColor("Centro")}
            strokeWidth={getStrokeWidth("Centro")}
            strokeLinejoin="round"
            style={{ transition: "all 0.2s ease" }}
          />
          <text 
            x="285" 
            y="240" 
            textAnchor="middle" 
            className="fill-white text-sm font-semibold pointer-events-none"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            Centro
          </text>
          <text 
            x="285" 
            y="260" 
            textAnchor="middle" 
            className="fill-white/90 text-xs pointer-events-none"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            {zoneSummary.find(z => z.zone === "Centro")?.coverage}%
          </text>
        </g>

        {/* Zona Leste - Lado direito (maior regiao) */}
        <g 
          className="cursor-pointer transition-all duration-200"
          onClick={() => onZoneClick("Zona Leste")}
          onMouseEnter={() => setHoveredZone("Zona Leste")}
          onMouseLeave={() => setHoveredZone(null)}
          filter={isSelected("Zona Leste") ? "url(#selectedGlow)" : "url(#zoneShadow)"}
        >
          <path
            d="M 390 185 
               C 420 180, 445 170, 460 155 
               C 485 165, 515 185, 540 210 
               C 565 240, 580 280, 575 320 
               C 570 360, 545 395, 510 415 
               C 470 435, 420 440, 380 425 
               C 350 415, 330 395, 320 370 
               C 340 345, 355 320, 365 295 
               C 380 270, 395 245, 400 210 
               C 400 195, 395 188, 390 185 Z"
            fill={getZoneColor("Zona Leste")}
            fillOpacity={getZoneOpacity("Zona Leste")}
            stroke={getStrokeColor("Zona Leste")}
            strokeWidth={getStrokeWidth("Zona Leste")}
            strokeLinejoin="round"
            style={{ transition: "all 0.2s ease" }}
          />
          <text 
            x="470" 
            y="290" 
            textAnchor="middle" 
            className="fill-white text-sm font-semibold pointer-events-none"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            Zona Leste
          </text>
          <text 
            x="470" 
            y="310" 
            textAnchor="middle" 
            className="fill-white/90 text-xs pointer-events-none"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            {zoneSummary.find(z => z.zone === "Zona Leste")?.coverage}%
          </text>
        </g>

        {/* Zona Sul - Parte inferior */}
        <g 
          className="cursor-pointer transition-all duration-200"
          onClick={() => onZoneClick("Zona Sul")}
          onMouseEnter={() => setHoveredZone("Zona Sul")}
          onMouseLeave={() => setHoveredZone(null)}
          filter={isSelected("Zona Sul") ? "url(#selectedGlow)" : "url(#zoneShadow)"}
        >
          <path
            d="M 150 330 
               C 170 305, 185 275, 190 245 
               C 195 260, 200 280, 210 300 
               C 225 325, 255 345, 290 355 
               C 315 362, 345 365, 375 360 
               C 395 380, 405 405, 395 430 
               C 380 455, 340 470, 295 475 
               C 245 480, 190 470, 155 445 
               C 125 425, 110 395, 115 365 
               C 120 350, 135 340, 150 330 Z"
            fill={getZoneColor("Zona Sul")}
            fillOpacity={getZoneOpacity("Zona Sul")}
            stroke={getStrokeColor("Zona Sul")}
            strokeWidth={getStrokeWidth("Zona Sul")}
            strokeLinejoin="round"
            style={{ transition: "all 0.2s ease" }}
          />
          <text 
            x="270" 
            y="400" 
            textAnchor="middle" 
            className="fill-white text-sm font-semibold pointer-events-none"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            Zona Sul
          </text>
          <text 
            x="270" 
            y="420" 
            textAnchor="middle" 
            className="fill-white/90 text-xs pointer-events-none"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
          >
            {zoneSummary.find(z => z.zone === "Zona Sul")?.coverage}%
          </text>
        </g>

        {/* Legenda do mapa de calor */}
        <g transform="translate(100, 465)">
          <rect x="0" y="0" width="400" height="24" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
          <rect x="8" y="6" width="384" height="12" rx="6" fill="url(#heatLegendGradient)"/>
        </g>
        <text x="100" y="505" className="text-[11px] fill-muted-foreground">Baixa</text>
        <text x="500" y="505" textAnchor="end" className="text-[11px] fill-muted-foreground">Alta</text>
        <text x="300" y="505" textAnchor="middle" className="text-[11px] fill-muted-foreground font-medium">Cobertura Vacinal</text>
      </svg>

      {/* Badge de zona selecionada */}
      {selectedZone !== "Todas" && (
        <Badge 
          variant="secondary" 
          className="absolute top-3 left-3 gap-2 bg-white/95 backdrop-blur-sm shadow-sm"
        >
          <MapPin className="h-3 w-3" />
          {selectedZone}
          <button 
            onClick={() => onZoneClick(selectedZone)}
            className="ml-1 hover:text-primary"
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

  // Funcao para obter casos/mortes filtrados por doenca
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

    // Ordenar por metrica considerando a doenca selecionada
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
      if (coverage >= 80) return "text-green-700"
      if (coverage >= 70) return "text-lime-700"
      if (coverage >= 60) return "text-yellow-700"
      if (coverage >= 50) return "text-orange-700"
      return "text-red-700"
    } else {
      const value = getMetricValue(neighborhood)
      const max = Math.max(...zonesData.map(n => getMetricValue(n)))
      const ratio = value / max
      if (ratio >= 0.6) return "text-red-700"
      if (ratio >= 0.3) return "text-yellow-700"
      return "text-green-700"
    }
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
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                <p className="text-sm text-muted-foreground">Bairros Criticos</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                <Info className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">{stats.alert}</p>
                <p className="text-sm text-muted-foreground">Em Alerta</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.ok}</p>
                <p className="text-sm text-muted-foreground">Adequados</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.avgCoverage}%</p>
                <p className="text-sm text-muted-foreground">Media Geral</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Mapa de Sao Paulo */}
          <Card className="overflow-hidden">
            <CardHeader className="pb-2">
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
                selectedMetric={selectedMetric}
              />
            </CardContent>
          </Card>

          {/* Lista de Bairros */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Bairros {selectedZone !== "Todas" && `- ${selectedZone}`}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-2">
                    <span>{filteredNeighborhoods.length} bairros encontrados</span>
                    {selectedDisease !== "all" && (
                      <Badge variant="secondary" className="text-xs">
                        {diseaseOptions.find(d => d.value === selectedDisease)?.label}
                      </Badge>
                    )}
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
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
                    <SelectTrigger className="w-[150px] h-9">
                      <SelectValue placeholder="Metrica" />
                    </SelectTrigger>
                    <SelectContent>
                      {metricOptions.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2">
                {filteredNeighborhoods.map((neighborhood, index) => (
                  <div
                    key={neighborhood.name}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${
                      selectedNeighborhood?.name === neighborhood.name ? 'bg-muted ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedNeighborhood(
                      selectedNeighborhood?.name === neighborhood.name ? null : neighborhood
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-5">{index + 1}</span>
                      <div className={`w-3 h-3 rounded-full ${getMetricColor(neighborhood)}`} />
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
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                {selectedNeighborhood.name}
              </CardTitle>
              <CardDescription>{selectedNeighborhood.zone}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Populacao</p>
                  <p className="text-2xl font-bold">{formatNumber(selectedNeighborhood.population)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Cobertura Vacinal</p>
                  <p className={`text-2xl font-bold ${getMetricTextColor(selectedNeighborhood)}`}>
                    {selectedNeighborhood.coverage}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Casos {selectedDisease !== "all" ? `(${diseaseOptions.find(d => d.value === selectedDisease)?.label})` : "Registrados"}
                  </p>
                  <p className="text-2xl font-bold">{formatNumber(getFilteredStats(selectedNeighborhood).cases)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Obitos {selectedDisease !== "all" ? `(${diseaseOptions.find(d => d.value === selectedDisease)?.label})` : ""}
                  </p>
                  <p className="text-2xl font-bold text-red-600">{getFilteredStats(selectedNeighborhood).deaths}</p>
                </div>
              </div>
              
              {/* Detalhamento por doenca quando "Todas" esta selecionado */}
              {selectedDisease === "all" && (
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {["dengue", "hiv", "malaria"].map((disease) => {
                    const diseaseInfo = diseaseOptions.find(d => d.value === disease)
                    const stats = generateDiseaseData(selectedNeighborhood)[disease]
                    const IconComponent = diseaseInfo?.icon
                    return (
                      <div key={disease} className="rounded-lg border p-3">
                        <div className="flex items-center gap-2 mb-2">
                          {IconComponent && <IconComponent className="h-4 w-4 text-muted-foreground" />}
                          <span className="font-medium text-sm">{diseaseInfo?.label}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Casos: <strong className="text-foreground">{stats.cases}</strong></span>
                          <span className="text-muted-foreground">Obitos: <strong className="text-red-600">{stats.deaths}</strong></span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {nearestUBS && (
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    UBS mais proxima: {nearestUBS.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">{nearestUBS.address}</p>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nearestUBS.address)}`, '_blank')}
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Ver no Mapa
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(`tel:${nearestUBS.phone}`, '_self')}
                    >
                      <Phone className="h-4 w-4 mr-1" />
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
