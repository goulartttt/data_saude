"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps"
import {
  brazilStatesData,
  getHeatmapColor,
  getCoverageColor,
  formatNumber,
  type StateData,
} from "@/lib/health-data"
import { Activity, Syringe, Users } from "lucide-react"

const BRAZIL_TOPO_JSON =
  "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson"

type MetricType = "cases" | "coverage" | "deaths"

export function BrazilHeatmap() {
  const [selectedState, setSelectedState] = useState<StateData | null>(null)
  const [hoveredState, setHoveredState] = useState<string | null>(null)
  const [metric, setMetric] = useState<MetricType>("cases")

  const maxValues = useMemo(() => {
    return {
      cases: Math.max(...brazilStatesData.map((s) => s.cases)),
      deaths: Math.max(...brazilStatesData.map((s) => s.deaths)),
      coverage: 100,
    }
  }, [])

  const getStateColor = (uf: string) => {
    const state = brazilStatesData.find((s) => s.uf === uf)
    if (!state) return "#e5e7eb"

    if (metric === "coverage") {
      return getCoverageColor(state.coverage)
    }
    return getHeatmapColor(state[metric], maxValues[metric])
  }

  const getStateByUF = (uf: string) => {
    return brazilStatesData.find((s) => s.uf === uf)
  }

  const getMetricLabel = () => {
    switch (metric) {
      case "cases":
        return "Casos de Dengue"
      case "coverage":
        return "Cobertura Vacinal"
      case "deaths":
        return "Óbitos"
    }
  }

  const legendItems = useMemo(() => {
    if (metric === "coverage") {
      return [
        { color: "#15803d", label: "> 80%" },
        { color: "#22c55e", label: "70-80%" },
        { color: "#facc15", label: "60-70%" },
        { color: "#f97316", label: "50-60%" },
        { color: "#dc2626", label: "< 50%" },
      ]
    }
    return [
      { color: "#7f1d1d", label: "Muito Alto" },
      { color: "#dc2626", label: "Alto" },
      { color: "#f97316", label: "Médio" },
      { color: "#facc15", label: "Baixo" },
      { color: "#22c55e", label: "Muito Baixo" },
    ]
  }, [metric])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg">Mapa de Calor - Brasil</CardTitle>
          <Tabs
            value={metric}
            onValueChange={(v) => setMetric(v as MetricType)}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="cases" className="gap-1.5 text-xs">
                <Activity className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Casos</span>
              </TabsTrigger>
              <TabsTrigger value="coverage" className="gap-1.5 text-xs">
                <Syringe className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Vacinas</span>
              </TabsTrigger>
              <TabsTrigger value="deaths" className="gap-1.5 text-xs">
                <Users className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Óbitos</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Mapa */}
          <div className="lg:col-span-2">
            <div className="relative aspect-[4/3] w-full rounded-lg border border-border bg-secondary/20 overflow-hidden">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: 650,
                  center: [-54, -15],
                }}
                className="w-full h-full"
              >
                <ZoomableGroup>
                  <Geographies geography={BRAZIL_TOPO_JSON}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const uf = geo.properties.sigla
                        const isHovered = hoveredState === uf
                        const isSelected = selectedState?.uf === uf

                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={getStateColor(uf)}
                            stroke="#ffffff"
                            strokeWidth={isHovered || isSelected ? 2 : 0.5}
                            style={{
                              default: {
                                outline: "none",
                                transition: "all 0.2s",
                              },
                              hover: {
                                outline: "none",
                                opacity: 0.85,
                                cursor: "pointer",
                              },
                              pressed: {
                                outline: "none",
                              },
                            }}
                            onMouseEnter={() => setHoveredState(uf)}
                            onMouseLeave={() => setHoveredState(null)}
                            onClick={() => {
                              const state = getStateByUF(uf)
                              if (state) setSelectedState(state)
                            }}
                          />
                        )
                      })
                    }
                  </Geographies>
                </ZoomableGroup>
              </ComposableMap>

              {/* Tooltip flutuante */}
              {hoveredState && (
                <div className="absolute top-4 right-4 bg-card border border-border rounded-lg p-3 shadow-lg z-10">
                  <p className="font-semibold text-sm">
                    {getStateByUF(hoveredState)?.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {metric === "cases" &&
                      `${formatNumber(getStateByUF(hoveredState)?.cases || 0)} casos`}
                    {metric === "coverage" &&
                      `${getStateByUF(hoveredState)?.coverage}% cobertura`}
                    {metric === "deaths" &&
                      `${formatNumber(getStateByUF(hoveredState)?.deaths || 0)} óbitos`}
                  </p>
                </div>
              )}

              {/* Legenda */}
              <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur border border-border rounded-lg p-3 shadow-lg">
                <p className="text-xs font-medium mb-2">{getMetricLabel()}</p>
                <div className="space-y-1.5">
                  {legendItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div
                        className="h-3 w-6 rounded"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lista de estados */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">
              Ranking por {getMetricLabel()}
            </h4>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {[...brazilStatesData]
                .sort((a, b) => {
                  if (metric === "coverage") return b.coverage - a.coverage
                  if (metric === "deaths") return b.deaths - a.deaths
                  return b.cases - a.cases
                })
                .slice(0, 10)
                .map((state, idx) => (
                  <button
                    key={state.uf}
                    className={`w-full rounded-lg border p-3 text-left transition-all hover:bg-secondary/50 ${
                      selectedState?.uf === state.uf
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    onClick={() => setSelectedState(state)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground w-5">
                          {idx + 1}.
                        </span>
                        <span className="font-medium text-sm">{state.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {state.uf}
                      </Badge>
                    </div>
                    <div className="mt-2 ml-7 text-xs text-muted-foreground">
                      {metric === "cases" && `${formatNumber(state.cases)} casos`}
                      {metric === "coverage" && `${state.coverage}% cobertura`}
                      {metric === "deaths" && `${formatNumber(state.deaths)} óbitos`}
                    </div>
                    {/* Barra de progresso */}
                    <div className="mt-2 ml-7 h-1.5 w-full rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${
                            metric === "coverage"
                              ? state.coverage
                              : (state[metric] / maxValues[metric]) * 100
                          }%`,
                          backgroundColor: getStateColor(state.uf),
                        }}
                      />
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Detalhes do estado selecionado */}
        {selectedState && (
          <div className="mt-6 rounded-lg border border-border bg-secondary/20 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-lg">{selectedState.name}</h4>
                <p className="text-sm text-muted-foreground">
                  População: {formatNumber(selectedState.population)} habitantes
                </p>
              </div>
              <Badge variant="outline" className="text-base font-bold">
                {selectedState.uf}
              </Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Casos de Dengue</p>
                <p className="text-xl font-bold text-destructive">
                  {formatNumber(selectedState.cases)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Óbitos</p>
                <p className="text-xl font-bold">
                  {formatNumber(selectedState.deaths)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cobertura Vacinal</p>
                <p className="text-xl font-bold text-accent">
                  {selectedState.coverage}%
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Incidência</p>
                <p className="text-xl font-bold">
                  {((selectedState.cases / selectedState.population) * 100000).toFixed(0)}
                  <span className="text-xs font-normal text-muted-foreground">
                    /100k
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
