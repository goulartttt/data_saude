"use client"

import { useEffect, useState } from "react"
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Syringe,
  ArrowRight,
  Shield
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatNumber } from "@/lib/health-data"

const stats = [
  { 
    label: "Doses Aplicadas", 
    value: 34567890, 
    icon: Syringe,
    suffix: "",
    color: "text-primary"
  },
  { 
    label: "Cobertura Vacinal", 
    value: 76.5, 
    icon: Shield,
    suffix: "%",
    color: "text-green-600 dark:text-green-400"
  },
  { 
    label: "Bairros Monitorados", 
    value: 96, 
    icon: Users,
    suffix: "",
    color: "text-blue-600 dark:text-blue-400"
  },
]

export function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Activity className="h-4 w-4" />
            <span>Dados atualizados em tempo real</span>
          </div>

          {/* Title */}
          <h1 
            className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Painel de Saúde{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Pública de São Paulo
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground text-pretty">
            Acompanhe em tempo real os dados de vacinação, casos de doenças e indicadores 
            de saúde pública da cidade de São Paulo, por zona e bairro.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" className="gap-2 w-full sm:w-auto">
              Ver Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
              <Shield className="h-4 w-4" />
              Encontrar Posto de Vacinação
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className={`text-3xl font-bold ${stat.color}`}>
                      {mounted ? (
                        stat.suffix === "%" 
                          ? `${stat.value}${stat.suffix}`
                          : formatNumber(stat.value)
                      ) : (
                        "..."
                      )}
                    </p>
                  </div>
                  <div className={`rounded-full bg-primary/10 p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                {index === 0 && (
                  <div className="mt-3 flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>+2.3M esta semana</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
