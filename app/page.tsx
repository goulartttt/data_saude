"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/dashboard/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { DiseaseCharts } from "@/components/dashboard/disease-charts"
import { RiskMap } from "@/components/dashboard/risk-map"
import { DateFilter } from "@/components/dashboard/date-filter"
import { AwarenessSection } from "@/components/dashboard/awareness-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Heart, Map, Activity } from "lucide-react"

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState({
    start: new Date("2024-01-01"),
    end: new Date(),
  })
  const [lastUpdate, setLastUpdate] = useState("")

  useEffect(() => {
    setLastUpdate(new Date().toLocaleDateString("pt-BR"))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 lg:px-6 lg:py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl text-balance">
                Dashboard de Saúde Pública
              </h1>
              <p className="mt-1 text-muted-foreground text-pretty">
                Monitoramento de vacinação e doenças no Brasil em tempo real
              </p>
            </div>
            <DateFilter dateRange={dateRange} onDateRangeChange={setDateRange} />
          </div>
        </div>

        {/* Stats Overview */}
        <section className="mb-8">
          <StatsCards />
        </section>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview" className="gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Visão Geral</span>
              <span className="sm:hidden">Geral</span>
            </TabsTrigger>
            <TabsTrigger value="charts" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Gráficos</span>
              <span className="sm:hidden">Dados</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <Map className="h-4 w-4" />
              <span>Mapa</span>
            </TabsTrigger>
            <TabsTrigger value="awareness" className="gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Conscientização</span>
              <span className="sm:hidden">Info</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-2">
              <DiseaseCharts dateRange={dateRange} />
            </div>
            <RiskMap />
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <DiseaseCharts dateRange={dateRange} />
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <RiskMap />
          </TabsContent>

          <TabsContent value="awareness">
            <AwarenessSection />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-sm font-medium text-foreground">Saúde Brasil</p>
              <p className="text-xs text-muted-foreground">
                Dados baseados em informações públicas do SUS e OpenDataSUS
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Última atualização: {lastUpdate || "..."}</span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">Versão 1.0</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
