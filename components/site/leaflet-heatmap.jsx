"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Activity, 
  MapPin, 
  ZoomIn, 
  ZoomOut, 
  Locate,
  Layers,
  AlertTriangle,
  TrendingUp
} from "lucide-react"

// Dados de amostra distribuidos pelos bairros de Sao Paulo
const generateHeatmapData = () => {
  const neighborhoods = [
    // Centro
    { name: "Se", lat: -23.5505, lng: -46.6333, intensity: 0.9 },
    { name: "Republica", lat: -23.5431, lng: -46.6421, intensity: 0.85 },
    { name: "Consolacao", lat: -23.5513, lng: -46.6600, intensity: 0.7 },
    { name: "Bela Vista", lat: -23.5600, lng: -46.6450, intensity: 0.75 },
    { name: "Liberdade", lat: -23.5585, lng: -46.6299, intensity: 0.8 },
    
    // Zona Norte
    { name: "Santana", lat: -23.5066, lng: -46.6276, intensity: 0.65 },
    { name: "Tucuruvi", lat: -23.4800, lng: -46.6050, intensity: 0.55 },
    { name: "Vila Guilherme", lat: -23.5150, lng: -46.6000, intensity: 0.6 },
    { name: "Casa Verde", lat: -23.5120, lng: -46.6600, intensity: 0.5 },
    { name: "Freguesia do O", lat: -23.4833, lng: -46.6933, intensity: 0.45 },
    { name: "Pirituba", lat: -23.4850, lng: -46.7350, intensity: 0.4 },
    { name: "Brasilandia", lat: -23.4650, lng: -46.6850, intensity: 0.7 },
    { name: "Tremember", lat: -23.4600, lng: -46.6333, intensity: 0.5 },
    
    // Zona Sul
    { name: "Vila Mariana", lat: -23.5900, lng: -46.6350, intensity: 0.55 },
    { name: "Moema", lat: -23.6000, lng: -46.6650, intensity: 0.45 },
    { name: "Santo Amaro", lat: -23.6550, lng: -46.7100, intensity: 0.6 },
    { name: "Campo Belo", lat: -23.6150, lng: -46.6700, intensity: 0.5 },
    { name: "Jabaquara", lat: -23.6400, lng: -46.6450, intensity: 0.65 },
    { name: "Saude", lat: -23.6200, lng: -46.6150, intensity: 0.55 },
    { name: "Ipiranga", lat: -23.5850, lng: -46.6050, intensity: 0.6 },
    { name: "Cidade Ademar", lat: -23.6750, lng: -46.6650, intensity: 0.75 },
    { name: "Parelheiros", lat: -23.8200, lng: -46.7300, intensity: 0.8 },
    { name: "Grajau", lat: -23.7600, lng: -46.6900, intensity: 0.85 },
    { name: "Capela do Socorro", lat: -23.7100, lng: -46.7050, intensity: 0.7 },
    
    // Zona Leste
    { name: "Tatuape", lat: -23.5400, lng: -46.5800, intensity: 0.6 },
    { name: "Penha", lat: -23.5250, lng: -46.5400, intensity: 0.65 },
    { name: "Vila Matilde", lat: -23.5450, lng: -46.5200, intensity: 0.7 },
    { name: "Sao Mateus", lat: -23.6100, lng: -46.4750, intensity: 0.8 },
    { name: "Itaquera", lat: -23.5400, lng: -46.4550, intensity: 0.75 },
    { name: "Guaianases", lat: -23.5450, lng: -46.4150, intensity: 0.85 },
    { name: "Cidade Tiradentes", lat: -23.5950, lng: -46.3850, intensity: 0.9 },
    { name: "Itaim Paulista", lat: -23.5100, lng: -46.4100, intensity: 0.8 },
    { name: "Sao Miguel", lat: -23.4900, lng: -46.4450, intensity: 0.75 },
    { name: "Ermelino Matarazzo", lat: -23.4950, lng: -46.4750, intensity: 0.7 },
    { name: "Aricanduva", lat: -23.5600, lng: -46.5050, intensity: 0.65 },
    { name: "Mooca", lat: -23.5550, lng: -46.6000, intensity: 0.55 },
    
    // Zona Oeste
    { name: "Pinheiros", lat: -23.5650, lng: -46.6900, intensity: 0.4 },
    { name: "Butanta", lat: -23.5700, lng: -46.7350, intensity: 0.45 },
    { name: "Lapa", lat: -23.5250, lng: -46.7000, intensity: 0.5 },
    { name: "Perdizes", lat: -23.5350, lng: -46.6800, intensity: 0.45 },
    { name: "Vila Leopoldina", lat: -23.5300, lng: -46.7350, intensity: 0.55 },
    { name: "Jaguare", lat: -23.5500, lng: -46.7550, intensity: 0.5 },
    { name: "Rio Pequeno", lat: -23.5650, lng: -46.7550, intensity: 0.6 },
    { name: "Raposo Tavares", lat: -23.5850, lng: -46.7800, intensity: 0.65 },
  ]

  // Gerar pontos adicionais ao redor de cada bairro para criar densidade
  const heatmapPoints = []
  
  neighborhoods.forEach(neighborhood => {
    // Ponto principal
    heatmapPoints.push([neighborhood.lat, neighborhood.lng, neighborhood.intensity])
    
    // Pontos satelites para criar densidade realista
    for (let i = 0; i < 15; i++) {
      const latOffset = (Math.random() - 0.5) * 0.02
      const lngOffset = (Math.random() - 0.5) * 0.02
      const intensityVariation = neighborhood.intensity * (0.7 + Math.random() * 0.3)
      heatmapPoints.push([
        neighborhood.lat + latOffset,
        neighborhood.lng + lngOffset,
        intensityVariation
      ])
    }
  })

  return { neighborhoods, heatmapPoints }
}

const { neighborhoods, heatmapPoints } = generateHeatmapData()

export function LeafletHeatmap() {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const heatLayerRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mapReady, setMapReady] = useState(false)
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [showLabels, setShowLabels] = useState(false)

  useEffect(() => {
    // Carregar Leaflet dinamicamente no cliente
    const loadMap = async () => {
      if (typeof window === "undefined" || mapInstanceRef.current) return

      try {
        const L = (await import("leaflet")).default
        
        // Carregar leaflet.heat
        await import("leaflet.heat")

        if (!mapRef.current || mapInstanceRef.current) return

        // Criar o mapa com tema escuro
        const map = L.map(mapRef.current, {
          center: [-23.5505, -46.6333],
          zoom: 11,
          zoomControl: false,
          attributionControl: false,
        })

        // Tile layer com tema escuro (CartoDB Dark Matter)
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          maxZoom: 19,
        }).addTo(map)

        // Criar camada de heatmap
        const heat = L.heatLayer(heatmapPoints, {
          radius: 25,
          blur: 20,
          maxZoom: 15,
          max: 1.0,
          gradient: {
            0.0: "#0000ff",
            0.25: "#00ffff",
            0.5: "#00ff00",
            0.75: "#ffff00",
            1.0: "#ff0000"
          }
        }).addTo(map)

        mapInstanceRef.current = map
        heatLayerRef.current = heat
        setMapReady(true)
        setIsLoading(false)

        // Cleanup
        return () => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.remove()
            mapInstanceRef.current = null
          }
        }
      } catch (error) {
        console.error("Erro ao carregar mapa:", error)
        setIsLoading(false)
      }
    }

    loadMap()
  }, [])

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut()
    }
  }

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([-23.5505, -46.6333], 11, { animate: true })
    }
  }

  const toggleLabels = async () => {
    if (!mapInstanceRef.current) return
    
    const L = (await import("leaflet")).default
    
    if (showLabels) {
      // Remover marcadores
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current.removeLayer(layer)
        }
      })
    } else {
      // Adicionar marcadores com nomes dos bairros
      neighborhoods.forEach(n => {
        const icon = L.divIcon({
          className: "custom-label",
          html: `<div style="
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            white-space: nowrap;
            font-family: system-ui, sans-serif;
          ">${n.name}</div>`,
          iconSize: [80, 20],
          iconAnchor: [40, 10]
        })
        L.marker([n.lat, n.lng], { icon }).addTo(mapInstanceRef.current)
      })
    }
    setShowLabels(!showLabels)
  }

  // Calcular estatisticas
  const stats = {
    totalPoints: heatmapPoints.length,
    highRiskAreas: neighborhoods.filter(n => n.intensity >= 0.7).length,
    avgIntensity: Math.round(neighborhoods.reduce((a, b) => a + b.intensity, 0) / neighborhoods.length * 100)
  }

  return (
    <section className="py-16 bg-slate-950">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <Badge variant="outline" className="mb-4 gap-2 border-cyan-500/50 text-cyan-400">
            <Activity className="h-3 w-3" />
            Visualizacao em Tempo Real
          </Badge>
          <h2 
            className="mb-3 text-3xl font-bold tracking-tight text-white"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Sao Paulo Heatmap
          </h2>
          <p className="mx-auto max-w-2xl text-slate-400">
            Simulacao de atividade urbana em tempo real. Visualize a distribuicao de casos por bairro.
          </p>
        </div>

        {/* Main Map Container */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900">
              <div className="text-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent mx-auto mb-4" />
                <p className="text-slate-400">Carregando mapa...</p>
              </div>
            </div>
          )}

          {/* Map */}
          <div 
            ref={mapRef} 
            className="h-[600px] w-full bg-slate-900"
            style={{ minHeight: "500px" }}
          />

          {/* Info Panel - Top Left */}
          <div className="absolute top-4 left-4 z-[1000]">
            <Card className="bg-slate-900/90 backdrop-blur-md border-slate-700 shadow-xl">
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold text-white mb-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-cyan-400" />
                  Sao Paulo Heatmap
                </h3>
                <p className="text-xs text-slate-400 mb-3">
                  Simulacao de atividade urbana
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Pontos de dados</span>
                    <span className="font-semibold text-white">{stats.totalPoints}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Areas de alto risco</span>
                    <span className="font-semibold text-red-400">{stats.highRiskAreas}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Intensidade media</span>
                    <span className="font-semibold text-yellow-400">{stats.avgIntensity}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Zoom Controls - Right Side */}
          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-10 w-10 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 backdrop-blur-md"
              onClick={handleZoomIn}
            >
              <ZoomIn className="h-4 w-4 text-white" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-10 w-10 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 backdrop-blur-md"
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-4 w-4 text-white" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-10 w-10 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 backdrop-blur-md"
              onClick={handleRecenter}
            >
              <Locate className="h-4 w-4 text-white" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className={`h-10 w-10 border backdrop-blur-md ${showLabels ? 'bg-cyan-600 border-cyan-500' : 'bg-slate-900/90 border-slate-700 hover:bg-slate-800'}`}
              onClick={toggleLabels}
            >
              <Layers className="h-4 w-4 text-white" />
            </Button>
          </div>

          {/* Legend - Bottom */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
            <Card className="bg-slate-900/90 backdrop-blur-md border-slate-700">
              <CardContent className="p-3">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400">Intensidade</span>
                  <div className="flex items-center gap-1">
                    <div className="w-24 h-3 rounded-full" style={{
                      background: "linear-gradient(to right, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)"
                    }} />
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-blue-400">Baixa</span>
                    <span className="text-red-400">Alta</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* High Risk Alert */}
          <div className="absolute bottom-4 right-4 z-[1000]">
            <Card className="bg-red-950/80 backdrop-blur-md border-red-800">
              <CardContent className="p-3 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <div>
                  <p className="text-xs font-semibold text-red-300">{stats.highRiskAreas} areas criticas</p>
                  <p className="text-xs text-red-400/70">Atencao prioritaria</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Cards Below Map */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20">
                <MapPin className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">96</p>
                <p className="text-sm text-slate-400">Bairros Monitorados</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20">
                <Activity className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.totalPoints}</p>
                <p className="text-sm text-slate-400">Pontos de Dados</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/20">
                <TrendingUp className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.avgIntensity}%</p>
                <p className="text-sm text-slate-400">Intensidade Media</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.highRiskAreas}</p>
                <p className="text-sm text-slate-400">Areas de Alto Risco</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
