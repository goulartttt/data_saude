import { SiteHeader } from "@/components/site/site-header"
import { HeroSection } from "@/components/site/hero-section"
import { StatsSection } from "@/components/site/stats-section"
import { ChartsSection } from "@/components/site/charts-section"
import { HeatmapSection } from "@/components/site/heatmap-section"
import { AwarenessSection } from "@/components/site/awareness-section"
import { SiteFooter } from "@/components/site/site-footer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <ChartsSection />
        <HeatmapSection />
        <AwarenessSection />
      </main>
      
      <SiteFooter />
    </div>
  )
}
