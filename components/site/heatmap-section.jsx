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
  Layers
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

// Componente do Mapa SVG de Sao Paulo com visual profissional
function SaoPauloMap({ selectedZone, onZoneClick, zoneSummary, selectedMetric }) {
  const [hoveredZone, setHoveredZone] = useState(null)

  // Funcao para gerar ID de gradiente unico por zona
  const getGradientId = (zone) => `gradient-${zone.replace(/\s/g, '-').toLowerCase()}`
  
  // Gerar cor de gradiente baseado na cobertura
  const getZoneGradientColors = (zone) => {
    const zoneData = zoneSummary.find(z => z.zone === zone)
    if (!zoneData) return { start: "#d1d5db", end: "#9ca3af" }
    
    const coverage = zoneData.coverage
    if (coverage >= 80) return { start: "#22c55e", mid: "#16a34a", end: "#15803d" } // verde
    if (coverage >= 75) return { start: "#84cc16", mid: "#65a30d", end: "#4d7c0f" } // verde-limao
    if (coverage >= 70) return { start: "#facc15", mid: "#eab308", end: "#ca8a04" } // amarelo
    if (coverage >= 65) return { start: "#fb923c", mid: "#f97316", end: "#ea580c" } // laranja
    return { start: "#f87171", mid: "#ef4444", end: "#dc2626" } // vermelho
  }

  const isSelected = (zone) => selectedZone === zone
  const isHovered = (zone) => hoveredZone === zone

  return (
    <div className="relative">
      <svg 
        viewBox="0 0 500 450" 
        className="w-full h-auto"
        style={{ 
          filter: "drop-shadow(0 10px 25px rgba(0,0,0,0.15))",
          maxHeight: "450px"
        }}
      >
        {/* Definicoes de gradientes e filtros */}
        <defs>
          {/* Filtro de sombra interna */}
          <filter id="inset-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feComponentTransfer in="SourceAlpha">
              <feFuncA type="table" tableValues="1 0" />
            </feComponentTransfer>
            <feGaussianBlur stdDeviation="3"/>
            <feOffset dx="2" dy="3" result="offsetblur"/>
            <feFlood floodColor="rgba(0,0,0,0.3)"/>
            <feComposite in2="offsetblur" operator="in"/>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Filtro de brilho para hover/selecao */}
          <filter id="glow-effect" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Textura de ruido sutil */}
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
            <feColorMatrix type="saturate" values="0"/>
            <feBlend in="SourceGraphic" in2="noise" mode="multiply" result="blend"/>
            <feComposite in="blend" in2="SourceGraphic" operator="in"/>
          </filter>

          {/* Gradientes para cada zona */}
          {zoneSummary.map(zone => {
            const colors = getZoneGradientColors(zone.zone)
            const gradId = getGradientId(zone.zone)
            return (
              <linearGradient key={gradId} id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={colors.start} stopOpacity="0.95"/>
                <stop offset="50%" stopColor={colors.mid || colors.start} stopOpacity="1"/>
                <stop offset="100%" stopColor={colors.end} stopOpacity="0.9"/>
              </linearGradient>
            )
          })}

          {/* Gradiente de legenda mais bonito */}
          <linearGradient id="legendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dc2626"/>
            <stop offset="20%" stopColor="#f97316"/>
            <stop offset="40%" stopColor="#eab308"/>
            <stop offset="60%" stopColor="#84cc16"/>
            <stop offset="80%" stopColor="#22c55e"/>
            <stop offset="100%" stopColor="#15803d"/>
          </linearGradient>

          {/* Gradiente de fundo do mapa */}
          <radialGradient id="mapBackground" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#f8fafc"/>
            <stop offset="100%" stopColor="#e2e8f0"/>
          </radialGradient>

          {/* Padrao de grid sutil */}
          <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#cbd5e1" strokeWidth="0.3" strokeOpacity="0.5"/>
          </pattern>
        </defs>

        {/* Fundo do mapa com grid */}
        <rect x="0" y="0" width="500" height="400" fill="url(#mapBackground)" rx="16"/>
        <rect x="0" y="0" width="500" height="400" fill="url(#gridPattern)" rx="16" opacity="0.4"/>

        {/* Contorno externo decorativo */}
        <rect x="10" y="10" width="480" height="380" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 2" rx="12" opacity="0.5"/>

        {/* Rosa dos ventos decorativa */}
        <g transform="translate(440, 50)" opacity="0.6">
          <circle cx="0" cy="0" r="18" fill="white" stroke="#64748b" strokeWidth="1"/>
          <path d="M 0 -15 L 3 -5 L 0 -8 L -3 -5 Z" fill="#1e40af"/>
          <path d="M 0 15 L 3 5 L 0 8 L -3 5 Z" fill="#64748b"/>
          <path d="M 15 0 L 5 3 L 8 0 L 5 -3 Z" fill="#64748b"/>
          <path d="M -15 0 L -5 3 L -8 0 L -5 -3 Z" fill="#64748b"/>
          <text x="0" y="-22" textAnchor="middle" className="text-[8px] font-bold fill-slate-600">N</text>
        </g>

        {/* Zona Norte */}
        <g 
          className="cursor-pointer transition-all duration-300"
          onClick={() => onZoneClick("Zona Norte")}
          onMouseEnter={() => setHoveredZone("Zona Norte")}
          onMouseLeave={() => setHoveredZone(null)}
        >
          <path
            d="M 120 50 Q 150 35 220 30 Q 290 35 340 55 Q 370 80 380 120 Q 360 150 320 170 Q 280 180 250 175 Q 200 185 170 165 Q 140 145 120 110 Q 115 80 120 50"
            fill={`url(#${getGradientId("Zona Norte")})`}
            stroke={isSelected("Zona Norte") || isHovered("Zona Norte") ? "#1e40af" : "#475569"}
            strokeWidth={isSelected("Zona Norte") ? 4 : isHovered("Zona Norte") ? 3 : 1.5}
            filter={isSelected("Zona Norte") || isHovered("Zona Norte") ? "url(#glow-effect)" : "url(#inset-shadow)"}
            style={{ 
              transform: isHovered("Zona Norte") && !isSelected("Zona Norte") ? "scale(1.02)" : "scale(1)",
              transformOrigin: "center",
              transition: "all 0.3s ease"
            }}
          />
          <text x="240" y="100" textAnchor="middle" className="fill-white text-sm font-bold pointer-events-none drop-shadow-md">
            Zona Norte
          </text>
          <text x="240" y="120" textAnchor="middle" className="fill-white/90 text-xs font-medium pointer-events-none drop-shadow">
            {zoneSummary.find(z => z.zone === "Zona Norte")?.coverage}% cobertura
          </text>
        </g>

        {/* Zona Oeste */}
        <g 
          className="cursor-pointer transition-all duration-300"
          onClick={() => onZoneClick("Zona Oeste")}
          onMouseEnter={() => setHoveredZone("Zona Oeste")}
          onMouseLeave={() => setHoveredZone(null)}
        >
          <path
            d="M 30 140 Q 50 120 120 110 Q 140 145 170 165 Q 170 200 165 240 Q 150 280 130 310 Q 90 300 55 270 Q 35 230 30 190 Q 25 160 30 140"
            fill={`url(#${getGradientId("Zona Oeste")})`}
            stroke={isSelected("Zona Oeste") || isHovered("Zona Oeste") ? "#1e40af" : "#475569"}
            strokeWidth={isSelected("Zona Oeste") ? 4 : isHovered("Zona Oeste") ? 3 : 1.5}
            filter={isSelected("Zona Oeste") || isHovered("Zona Oeste") ? "url(#glow-effect)" : "url(#inset-shadow)"}
            style={{ 
              transform: isHovered("Zona Oeste") && !isSelected("Zona Oeste") ? "scale(1.02)" : "scale(1)",
              transformOrigin: "center",
              transition: "all 0.3s ease"
            }}
          />
          <text x="100" y="200" textAnchor="middle" className="fill-white text-sm font-bold pointer-events-none drop-shadow-md">
            Zona Oeste
          </text>
          <text x="100" y="220" textAnchor="middle" className="fill-white/90 text-xs font-medium pointer-events-none drop-shadow">
            {zoneSummary.find(z => z.zone === "Zona Oeste")?.coverage}% cobertura
          </text>
        </g>

        {/* Centro */}
        <g 
          className="cursor-pointer transition-all duration-300"
          onClick={() => onZoneClick("Centro")}
          onMouseEnter={() => setHoveredZone("Centro")}
          onMouseLeave={() => setHoveredZone(null)}
        >
          <path
            d="M 170 165 Q 200 185 250 175 Q 280 180 320 170 Q 335 200 330 240 Q 310 270 280 280 Q 240 285 200 275 Q 170 260 165 240 Q 165 200 170 165"
            fill={`url(#${getGradientId("Centro")})`}
            stroke={isSelected("Centro") || isHovered("Centro") ? "#1e40af" : "#475569"}
            strokeWidth={isSelected("Centro") ? 4 : isHovered("Centro") ? 3 : 1.5}
            filter={isSelected("Centro") || isHovered("Centro") ? "url(#glow-effect)" : "url(#inset-shadow)"}
            style={{ 
              transform: isHovered("Centro") && !isSelected("Centro") ? "scale(1.02)" : "scale(1)",
              transformOrigin: "center",
              transition: "all 0.3s ease"
            }}
          />
          <text x="250" y="215" textAnchor="middle" className="fill-white text-sm font-bold pointer-events-none drop-shadow-md">
            Centro
          </text>
          <text x="250" y="235" textAnchor="middle" className="fill-white/90 text-xs font-medium pointer-events-none drop-shadow">
            {zoneSummary.find(z => z.zone === "Centro")?.coverage}% cobertura
          </text>
        </g>

        {/* Zona Leste */}
        <g 
          className="cursor-pointer transition-all duration-300"
          onClick={() => onZoneClick("Zona Leste")}
          onMouseEnter={() => setHoveredZone("Zona Leste")}
          onMouseLeave={() => setHoveredZone(null)}
        >
          <path
            d="M 320 170 Q 360 150 380 120 Q 420 130 460 160 Q 475 200 470 250 Q 455 300 420 330 Q 370 340 330 320 Q 310 290 310 270 Q 330 270 330 240 Q 335 200 320 170"
            fill={`url(#${getGradientId("Zona Leste")})`}
            stroke={isSelected("Zona Leste") || isHovered("Zona Leste") ? "#1e40af" : "#475569"}
            strokeWidth={isSelected("Zona Leste") ? 4 : isHovered("Zona Leste") ? 3 : 1.5}
            filter={isSelected("Zona Leste") || isHovered("Zona Leste") ? "url(#glow-effect)" : "url(#inset-shadow)"}
            style={{ 
              transform: isHovered("Zona Leste") && !isSelected("Zona Leste") ? "scale(1.02)" : "scale(1)",
              transformOrigin: "center",
              transition: "all 0.3s ease"
            }}
          />
          <text x="390" y="220" textAnchor="middle" className="fill-white text-sm font-bold pointer-events-none drop-shadow-md">
            Zona Leste
          </text>
          <text x="390" y="240" textAnchor="middle" className="fill-white/90 text-xs font-medium pointer-events-none drop-shadow">
            {zoneSummary.find(z => z.zone === "Zona Leste")?.coverage}% cobertura
          </text>
        </g>

        {/* Zona Sul */}
        <g 
          className="cursor-pointer transition-all duration-300"
          onClick={() => onZoneClick("Zona Sul")}
          onMouseEnter={() => setHoveredZone("Zona Sul")}
          onMouseLeave={() => setHoveredZone(null)}
        >
          <path
            d="M 130 310 Q 150 280 165 240 Q 170 260 200 275 Q 240 285 280 280 Q 310 290 330 320 Q 370 340 380 370 Q 340 390 280 395 Q 200 390 150 370 Q 110 350 130 310"
            fill={`url(#${getGradientId("Zona Sul")})`}
            stroke={isSelected("Zona Sul") || isHovered("Zona Sul") ? "#1e40af" : "#475569"}
            strokeWidth={isSelected("Zona Sul") ? 4 : isHovered("Zona Sul") ? 3 : 1.5}
            filter={isSelected("Zona Sul") || isHovered("Zona Sul") ? "url(#glow-effect)" : "url(#inset-shadow)"}
            style={{ 
              transform: isHovered("Zona Sul") && !isSelected("Zona Sul") ? "scale(1.02)" : "scale(1)",
              transformOrigin: "center",
              transition: "all 0.3s ease"
            }}
          />
          <text x="250" y="340" textAnchor="middle" className="fill-white text-sm font-bold pointer-events-none drop-shadow-md">
            Zona Sul
          </text>
          <text x="250" y="360" textAnchor="middle" className="fill-white/90 text-xs font-medium pointer-events-none drop-shadow">
            {zoneSummary.find(z => z.zone === "Zona Sul")?.coverage}% cobertura
          </text>
        </g>

        {/* Marcador central da cidade */}
        <g transform="translate(250, 220)">
          <circle cx="0" cy="0" r="6" fill="white" stroke="#1e40af" strokeWidth="2"/>
          <circle cx="0" cy="0" r="2" fill="#1e40af"/>
        </g>

        {/* Barra de Legenda */}
        <g transform="translate(50, 415)">
          <rect x="0" y="0" width="400" height="20" rx="10" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
          <rect x="5" y="5" width="390" height="10" rx="5" fill="url(#legendGradient)"/>
          <text x="0" y="38" className="text-[10px] fill-slate-500 font-medium">Baixa cobertura</text>
          <text x="400" y="38" textAnchor="end" className="text-[10px] fill-slate-500 font-medium">Alta cobertura</text>
          <text x="200" y="38" textAnchor="middle" className="text-[10px] fill-slate-400">Cobertura Vacinal</text>
        </g>
      </svg>

      {/* Indicador de zona selecionada */}
      {selectedZone !== "Todas" && (
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{selectedZone}</span>
            <button 
              onClick={() => onZoneClick(selectedZone)}
              className="ml-2 text-muted-foreground hover:text-foreground"
            >
              <span className="text-xs">Limpar</span>
            </button>
          </div>
        </div>
      )}
    </div>
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
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Mapa de Sao Paulo
              </CardTitle>
              <CardDescription>
                Clique em uma zona para ver os bairros. As cores indicam a cobertura vacinal.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
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
                        isActive ? 'ring-2 ring-primary border-primary bg-primary/5' : 'border-border hover:border-primary/50'
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
                            ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className={`mb-1 h-2 w-full rounded-full ${getMetricColor(neighborhood)}`} />
                        <span className="text-xs font-medium text-center truncate w-full">{neighborhood.name}</span>
                        <span className={`text-sm font-bold ${getMetricTextColor(neighborhood)}`}>
                          {metricValue}{selectedMetric === "coverage" ? "%" : ""}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Detalhes do Bairro Selecionado */}
            {selectedNeighborhood && (
              <Card className="border-primary/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{selectedNeighborhood.name}</CardTitle>
                      <CardDescription>{selectedNeighborhood.zone}</CardDescription>
                    </div>
                    <Badge variant={selectedNeighborhood.coverage >= 70 ? "default" : selectedNeighborhood.coverage >= 55 ? "secondary" : "destructive"}>
                      {selectedNeighborhood.coverage >= 70 ? "Adequado" : selectedNeighborhood.coverage >= 55 ? "Alerta" : "Critico"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Populacao</p>
                      <p className="font-semibold">{formatNumber(selectedNeighborhood.population)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Cobertura Vacinal</p>
                      <p className={`font-semibold ${getMetricTextColor(selectedNeighborhood)}`}>{selectedNeighborhood.coverage}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Casos (ultimos 12m)</p>
                      <p className="font-semibold">{formatNumber(selectedNeighborhood.cases)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-muted-foreground">Obitos</p>
                      <p className="font-semibold text-red-600 dark:text-red-400">{selectedNeighborhood.deaths}</p>
                    </div>
                  </div>

                  {/* UBS mais proxima */}
                  {nearestUBS && (
                    <div className="mt-4 rounded-lg bg-muted/50 p-3">
                      <p className="mb-2 text-xs font-medium text-muted-foreground">UBS mais proxima</p>
                      <div className="flex items-start gap-3">
                        <Building2 className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{nearestUBS.name}</p>
                          <p className="text-xs text-muted-foreground">{nearestUBS.address}</p>
                          <div className="mt-2 flex gap-2">
                            <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
                              <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nearestUBS.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <MapPin className="mr-1 h-3 w-3" />
                                Ver no Mapa
                              </a>
                            </Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs" asChild>
                              <a href={`tel:${nearestUBS.phone}`}>
                                <Phone className="mr-1 h-3 w-3" />
                                Ligar
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
