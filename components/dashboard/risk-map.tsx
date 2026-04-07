"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatNumber } from "@/lib/health-data"
import { AlertTriangle, CheckCircle, TrendingDown, TrendingUp, MapPin, Users, Syringe, Activity } from "lucide-react"

// Dados dos estados brasileiros organizados por região
const brazilRegions = {
  norte: {
    name: "Norte",
    states: [
      { uf: "AM", name: "Amazonas", cases: 89450, coverage: 52, trend: "up" as const },
      { uf: "PA", name: "Pará", cases: 167890, coverage: 51, trend: "up" as const },
      { uf: "AC", name: "Acre", cases: 8920, coverage: 62, trend: "down" as const },
      { uf: "RO", name: "Rondônia", cases: 34560, coverage: 60, trend: "stable" as const },
      { uf: "RR", name: "Roraima", cases: 5670, coverage: 53, trend: "up" as const },
      { uf: "AP", name: "Amapá", cases: 6780, coverage: 55, trend: "stable" as const },
      { uf: "TO", name: "Tocantins", cases: 23450, coverage: 57, trend: "down" as const },
    ],
  },
  nordeste: {
    name: "Nordeste",
    states: [
      { uf: "BA", name: "Bahia", cases: 234560, coverage: 62, trend: "down" as const },
      { uf: "PE", name: "Pernambuco", cases: 189450, coverage: 61, trend: "stable" as const },
      { uf: "CE", name: "Ceará", cases: 178900, coverage: 65, trend: "down" as const },
      { uf: "MA", name: "Maranhão", cases: 123450, coverage: 54, trend: "up" as const },
      { uf: "PB", name: "Paraíba", cases: 67890, coverage: 63, trend: "stable" as const },
      { uf: "RN", name: "Rio Grande do Norte", cases: 78900, coverage: 66, trend: "down" as const },
      { uf: "AL", name: "Alagoas", cases: 45230, coverage: 58, trend: "stable" as const },
      { uf: "PI", name: "Piauí", cases: 45230, coverage: 59, trend: "down" as const },
      { uf: "SE", name: "Sergipe", cases: 34560, coverage: 64, trend: "stable" as const },
    ],
  },
  centroOeste: {
    name: "Centro-Oeste",
    states: [
      { uf: "GO", name: "Goiás", cases: 145670, coverage: 68, trend: "down" as const },
      { uf: "MT", name: "Mato Grosso", cases: 78900, coverage: 64, trend: "stable" as const },
      { uf: "MS", name: "Mato Grosso do Sul", cases: 56780, coverage: 71, trend: "down" as const },
      { uf: "DF", name: "Distrito Federal", cases: 67890, coverage: 78, trend: "down" as const },
    ],
  },
  sudeste: {
    name: "Sudeste",
    states: [
      { uf: "SP", name: "São Paulo", cases: 1234560, coverage: 78, trend: "down" as const },
      { uf: "RJ", name: "Rio de Janeiro", cases: 567890, coverage: 72, trend: "stable" as const },
      { uf: "MG", name: "Minas Gerais", cases: 456780, coverage: 68, trend: "down" as const },
      { uf: "ES", name: "Espírito Santo", cases: 89230, coverage: 72, trend: "down" as const },
    ],
  },
  sul: {
    name: "Sul",
    states: [
      { uf: "RS", name: "Rio Grande do Sul", cases: 289450, coverage: 79, trend: "down" as const },
      { uf: "PR", name: "Paraná", cases: 234560, coverage: 81, trend: "down" as const },
      { uf: "SC", name: "Santa Catarina", cases: 189450, coverage: 82, trend: "down" as const },
    ],
  },
}

type StateData = {
  uf: string
  name: string
  cases: number
  coverage: number
  trend: "up" | "down" | "stable"
}

const getRiskLevel = (coverage: number, cases: number) => {
  // Normalizar casos (considerar per capita aproximado)
  const caseScore = cases > 500000 ? 3 : cases > 100000 ? 2 : cases > 50000 ? 1 : 0
  const coverageScore = coverage < 55 ? 3 : coverage < 65 ? 2 : coverage < 75 ? 1 : 0
  const totalScore = caseScore + coverageScore
  
  if (totalScore >= 5) return "critical"
  if (totalScore >= 3) return "high"
  if (totalScore >= 2) return "medium"
  return "low"
}

const getRiskConfig = (level: string) => {
  switch (level) {
    case "critical":
      return { 
        label: "Crítico", 
        color: "bg-red-500", 
        textColor: "text-red-700 dark:text-red-400",
        bgLight: "bg-red-50 dark:bg-red-950/30",
        border: "border-red-200 dark:border-red-800"
      }
    case "high":
      return { 
        label: "Alto", 
        color: "bg-orange-500", 
        textColor: "text-orange-700 dark:text-orange-400",
        bgLight: "bg-orange-50 dark:bg-orange-950/30",
        border: "border-orange-200 dark:border-orange-800"
      }
    case "medium":
      return { 
        label: "Médio", 
        color: "bg-yellow-500", 
        textColor: "text-yellow-700 dark:text-yellow-400",
        bgLight: "bg-yellow-50 dark:bg-yellow-950/30",
        border: "border-yellow-200 dark:border-yellow-800"
      }
    default:
      return { 
        label: "Baixo", 
        color: "bg-green-500", 
        textColor: "text-green-700 dark:text-green-400",
        bgLight: "bg-green-50 dark:bg-green-950/30",
        border: "border-green-200 dark:border-green-800"
      }
  }
}

const getCoverageColor = (coverage: number) => {
  if (coverage >= 80) return "bg-green-500"
  if (coverage >= 70) return "bg-emerald-500"
  if (coverage >= 60) return "bg-yellow-500"
  if (coverage >= 50) return "bg-orange-500"
  return "bg-red-500"
}

function StateCard({ state, isSelected, onClick }: { state: StateData; isSelected: boolean; onClick: () => void }) {
  const riskLevel = getRiskLevel(state.coverage, state.cases)
  const risk = getRiskConfig(riskLevel)

  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border p-3 text-left transition-all hover:shadow-md ${
        isSelected 
          ? `${risk.bgLight} ${risk.border} ring-2 ring-primary` 
          : "border-border bg-card hover:bg-secondary/30"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-muted-foreground">{state.uf}</span>
          <span className="font-medium text-sm truncate">{state.name}</span>
        </div>
        <div className={`h-3 w-3 rounded-full ${risk.color}`} title={`Risco ${risk.label}`} />
      </div>
      
      <div className="mt-2 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Cobertura vacinal</span>
          <span className="font-semibold">{state.coverage}%</span>
        </div>
        <Progress value={state.coverage} className="h-1.5" />
      </div>
      
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{formatNumber(state.cases)} casos</span>
        <div className="flex items-center gap-1">
          {state.trend === "up" && <TrendingUp className="h-3 w-3 text-red-500" />}
          {state.trend === "down" && <TrendingDown className="h-3 w-3 text-green-500" />}
          {state.trend === "stable" && <Activity className="h-3 w-3 text-yellow-500" />}
          <span className={
            state.trend === "up" ? "text-red-600" : 
            state.trend === "down" ? "text-green-600" : "text-yellow-600"
          }>
            {state.trend === "up" ? "Subindo" : state.trend === "down" ? "Caindo" : "Estável"}
          </span>
        </div>
      </div>
    </button>
  )
}

function RegionSummary({ regionKey, region }: { regionKey: string; region: typeof brazilRegions.norte }) {
  const totalCases = region.states.reduce((sum, s) => sum + s.cases, 0)
  const avgCoverage = Math.round(region.states.reduce((sum, s) => sum + s.coverage, 0) / region.states.length)
  const criticalStates = region.states.filter(s => getRiskLevel(s.coverage, s.cases) === "critical" || getRiskLevel(s.coverage, s.cases) === "high").length

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-foreground">{region.name}</h4>
        <Badge variant={criticalStates > 0 ? "destructive" : "secondary"}>
          {criticalStates > 0 ? `${criticalStates} em alerta` : "Controlado"}
        </Badge>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-lg font-bold text-foreground">{region.states.length}</p>
          <p className="text-xs text-muted-foreground">Estados</p>
        </div>
        <div>
          <p className="text-lg font-bold text-foreground">{formatNumber(totalCases)}</p>
          <p className="text-xs text-muted-foreground">Casos</p>
        </div>
        <div>
          <p className={`text-lg font-bold ${avgCoverage >= 70 ? "text-green-600" : avgCoverage >= 60 ? "text-yellow-600" : "text-red-600"}`}>
            {avgCoverage}%
          </p>
          <p className="text-xs text-muted-foreground">Cobertura</p>
        </div>
      </div>
    </div>
  )
}

export function RiskMap() {
  const [selectedState, setSelectedState] = useState<StateData | null>(null)
  const [activeRegion, setActiveRegion] = useState("all")

  // Todos os estados
  const allStates = Object.values(brazilRegions).flatMap(r => r.states)
  
  // Estatísticas gerais
  const totalCases = allStates.reduce((sum, s) => sum + s.cases, 0)
  const avgCoverage = Math.round(allStates.reduce((sum, s) => sum + s.coverage, 0) / allStates.length)
  const criticalCount = allStates.filter(s => getRiskLevel(s.coverage, s.cases) === "critical").length
  const highCount = allStates.filter(s => getRiskLevel(s.coverage, s.cases) === "high").length

  // Estados filtrados por região
  const filteredStates = activeRegion === "all" 
    ? allStates 
    : brazilRegions[activeRegion as keyof typeof brazilRegions]?.states || []

  // Ordenar por risco (maior primeiro)
  const sortedStates = [...filteredStates].sort((a, b) => {
    const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    const riskA = getRiskLevel(a.coverage, a.cases)
    const riskB = getRiskLevel(b.coverage, b.cases)
    return riskOrder[riskA as keyof typeof riskOrder] - riskOrder[riskB as keyof typeof riskOrder]
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Mapa de Risco por Estado
            </CardTitle>
            <CardDescription className="mt-1">
              Visualize o nível de risco baseado na cobertura vacinal e casos de doenças
            </CardDescription>
          </div>
        </div>
        
        {/* Legenda */}
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-xs font-medium">Crítico</span>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-1.5">
            <div className="h-3 w-3 rounded-full bg-orange-500" />
            <span className="text-xs font-medium">Alto</span>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-1.5">
            <div className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="text-xs font-medium">Médio</span>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-secondary/50 px-3 py-1.5">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-xs font-medium">Baixo</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Resumo Nacional */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-secondary/20 p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Total de Casos</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{formatNumber(totalCases)}</p>
          </div>
          <div className="rounded-lg border border-border bg-secondary/20 p-4">
            <div className="flex items-center gap-2">
              <Syringe className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">Cobertura Média</span>
            </div>
            <p className={`mt-2 text-2xl font-bold ${avgCoverage >= 70 ? "text-green-600" : avgCoverage >= 60 ? "text-yellow-600" : "text-red-600"}`}>
              {avgCoverage}%
            </p>
          </div>
          <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-sm text-red-700 dark:text-red-400">Estados Críticos</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-red-700 dark:text-red-400">{criticalCount}</p>
          </div>
          <div className="rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span className="text-sm text-orange-700 dark:text-orange-400">Estados em Alerta</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-orange-700 dark:text-orange-400">{highCount}</p>
          </div>
        </div>

        {/* Resumo por Região */}
        <div>
          <h3 className="mb-3 font-semibold text-foreground">Resumo por Região</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {Object.entries(brazilRegions).map(([key, region]) => (
              <RegionSummary key={key} regionKey={key} region={region} />
            ))}
          </div>
        </div>

        {/* Filtro por Região */}
        <Tabs value={activeRegion} onValueChange={setActiveRegion}>
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="all" className="text-xs">Todos</TabsTrigger>
            <TabsTrigger value="norte" className="text-xs">Norte</TabsTrigger>
            <TabsTrigger value="nordeste" className="text-xs">Nordeste</TabsTrigger>
            <TabsTrigger value="centroOeste" className="text-xs">Centro-Oeste</TabsTrigger>
            <TabsTrigger value="sudeste" className="text-xs">Sudeste</TabsTrigger>
            <TabsTrigger value="sul" className="text-xs">Sul</TabsTrigger>
          </TabsList>

          <TabsContent value={activeRegion} className="mt-4">
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {sortedStates.map((state) => (
                <StateCard
                  key={state.uf}
                  state={state}
                  isSelected={selectedState?.uf === state.uf}
                  onClick={() => setSelectedState(selectedState?.uf === state.uf ? null : state)}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Detalhes do Estado Selecionado */}
        {selectedState && (
          <div className="rounded-lg border border-primary bg-primary/5 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {selectedState.name} ({selectedState.uf})
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Detalhes completos do estado selecionado
                </p>
              </div>
              {(() => {
                const risk = getRiskConfig(getRiskLevel(selectedState.coverage, selectedState.cases))
                return (
                  <Badge className={`${risk.color} text-white`}>
                    Risco {risk.label}
                  </Badge>
                )
              })()}
            </div>
            
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-md bg-card border border-border p-3">
                <p className="text-xs text-muted-foreground">Casos Totais</p>
                <p className="text-xl font-bold text-foreground">{formatNumber(selectedState.cases)}</p>
              </div>
              <div className="rounded-md bg-card border border-border p-3">
                <p className="text-xs text-muted-foreground">Cobertura Vacinal</p>
                <div className="flex items-center gap-2">
                  <p className={`text-xl font-bold ${selectedState.coverage >= 70 ? "text-green-600" : selectedState.coverage >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                    {selectedState.coverage}%
                  </p>
                  {selectedState.coverage >= 70 ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </div>
              <div className="rounded-md bg-card border border-border p-3">
                <p className="text-xs text-muted-foreground">Tendência</p>
                <div className="flex items-center gap-2">
                  {selectedState.trend === "up" && <TrendingUp className="h-5 w-5 text-red-500" />}
                  {selectedState.trend === "down" && <TrendingDown className="h-5 w-5 text-green-500" />}
                  {selectedState.trend === "stable" && <Activity className="h-5 w-5 text-yellow-500" />}
                  <p className={`text-xl font-bold ${
                    selectedState.trend === "up" ? "text-red-600" : 
                    selectedState.trend === "down" ? "text-green-600" : "text-yellow-600"
                  }`}>
                    {selectedState.trend === "up" ? "Subindo" : selectedState.trend === "down" ? "Caindo" : "Estável"}
                  </p>
                </div>
              </div>
              <div className="rounded-md bg-card border border-border p-3">
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-xl font-bold text-foreground">
                  {selectedState.coverage >= 70 ? "Controlado" : selectedState.coverage >= 60 ? "Atenção" : "Crítico"}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">Progresso da Cobertura Vacinal</p>
              <div className="relative">
                <Progress value={selectedState.coverage} className="h-4" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-white drop-shadow-sm">{selectedState.coverage}%</span>
                </div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span className="text-yellow-600">Meta: 70%</span>
                <span className="text-green-600">Ideal: 95%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
