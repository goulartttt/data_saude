"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatNumber, getRiskColor, spRegions, type RegionData } from "@/lib/health-data"

export function RiskMap() {
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

  const getRiskLabel = (level: RegionData["riskLevel"]) => {
    switch (level) {
      case "critical":
        return "Crítico"
      case "high":
        return "Alto"
      case "medium":
        return "Médio"
      case "low":
        return "Baixo"
    }
  }

  const getRiskBadgeVariant = (level: RegionData["riskLevel"]) => {
    switch (level) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "default"
    }
  }

  // Calcular posição relativa no mapa (simplificado para São Paulo)
  const getMapPosition = (lat: number, lng: number) => {
    // Bounds aproximados da região de São Paulo
    const minLat = -24.1
    const maxLat = -22.7
    const minLng = -47.2
    const maxLng = -46.2

    const x = ((lng - minLng) / (maxLng - minLng)) * 100
    const y = ((lat - minLat) / (maxLat - minLat)) * 100

    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, 100 - y)) }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-lg">Mapa de Risco - São Paulo</CardTitle>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#22c55e]" />
              <span className="text-xs text-muted-foreground">Baixo</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#eab308]" />
              <span className="text-xs text-muted-foreground">Médio</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#f97316]" />
              <span className="text-xs text-muted-foreground">Alto</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#ef4444]" />
              <span className="text-xs text-muted-foreground">Crítico</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Mapa visual */}
          <div className="lg:col-span-2">
            <div className="relative aspect-[4/3] w-full rounded-lg bg-secondary/30 border border-border overflow-hidden">
              {/* Background do mapa estilizado */}
              <div className="absolute inset-0 opacity-10">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)" />
                </svg>
              </div>

              {/* Label do estado */}
              <div className="absolute left-4 top-4 text-sm font-medium text-muted-foreground">
                Estado de São Paulo
              </div>

              {/* Pontos das regiões */}
              {spRegions.map((region) => {
                const pos = getMapPosition(region.lat, region.lng)
                const isSelected = selectedRegion?.id === region.id
                const isHovered = hoveredRegion === region.id
                const size = region.cases > 50000 ? 48 : region.cases > 30000 ? 40 : 32

                return (
                  <button
                    key={region.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 cursor-pointer"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                    }}
                    onClick={() => setSelectedRegion(region)}
                    onMouseEnter={() => setHoveredRegion(region.id)}
                    onMouseLeave={() => setHoveredRegion(null)}
                  >
                    <div
                      className={`relative flex items-center justify-center rounded-full transition-all duration-200 ${
                        isSelected || isHovered ? "scale-125 z-10" : ""
                      }`}
                      style={{
                        width: size,
                        height: size,
                        backgroundColor: getRiskColor(region.riskLevel),
                        boxShadow: isSelected || isHovered
                          ? `0 0 20px ${getRiskColor(region.riskLevel)}80`
                          : `0 0 10px ${getRiskColor(region.riskLevel)}40`,
                      }}
                    >
                      <span className="text-xs font-bold text-white">
                        {(region.cases / 1000).toFixed(0)}k
                      </span>
                    </div>
                    {(isSelected || isHovered) && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap rounded bg-card px-2 py-1 text-xs font-medium shadow-lg border border-border">
                        {region.name}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Lista de regiões */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Regiões Monitoradas</h4>
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
              {spRegions
                .sort((a, b) => b.cases - a.cases)
                .map((region) => (
                  <button
                    key={region.id}
                    className={`w-full rounded-lg border p-3 text-left transition-all hover:bg-secondary/50 ${
                      selectedRegion?.id === region.id
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    onClick={() => setSelectedRegion(region)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{region.name}</span>
                      <Badge variant={getRiskBadgeVariant(region.riskLevel) as "destructive" | "secondary" | "default"}>
                        {getRiskLabel(region.riskLevel)}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatNumber(region.cases)} casos</span>
                      <span>Cobertura: {region.coverage}%</span>
                    </div>
                    {/* Barra de progresso da cobertura */}
                    <div className="mt-2 h-1.5 w-full rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${region.coverage}%`,
                          backgroundColor:
                            region.coverage >= 75
                              ? "#22c55e"
                              : region.coverage >= 60
                                ? "#eab308"
                                : "#ef4444",
                        }}
                      />
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Detalhes da região selecionada */}
        {selectedRegion && (
          <div className="mt-6 rounded-lg border border-border bg-secondary/20 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-lg">{selectedRegion.name}</h4>
                <p className="text-sm text-muted-foreground">
                  Coordenadas: {selectedRegion.lat.toFixed(4)}, {selectedRegion.lng.toFixed(4)}
                </p>
              </div>
              <Badge
                variant={getRiskBadgeVariant(selectedRegion.riskLevel) as "destructive" | "secondary" | "default"}
                className="text-sm"
              >
                Risco {getRiskLabel(selectedRegion.riskLevel)}
              </Badge>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-xs text-muted-foreground">Casos Totais</p>
                <p className="text-xl font-bold">{formatNumber(selectedRegion.cases)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cobertura Vacinal</p>
                <p className="text-xl font-bold">{selectedRegion.coverage}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Nível de Risco</p>
                <p className="text-xl font-bold capitalize">{getRiskLabel(selectedRegion.riskLevel)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-xl font-bold">
                  {selectedRegion.coverage >= 70 ? "Controlado" : "Atenção"}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
