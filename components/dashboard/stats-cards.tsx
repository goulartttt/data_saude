"use client"

import { Activity, Syringe, TrendingDown, TrendingUp, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { diseases, formatNumber, vaccinationByRegion } from "@/lib/health-data"

interface StatCardProps {
  title: string
  value: string
  change?: string
  trend?: "up" | "down" | "stable"
  icon: React.ReactNode
  description?: string
  variant?: "default" | "success" | "warning" | "destructive"
}

function StatCard({
  title,
  value,
  change,
  trend,
  icon,
  description,
  variant = "default",
}: StatCardProps) {
  const variantStyles = {
    default: "bg-card",
    success: "bg-success/5 border-success/20",
    warning: "bg-warning/5 border-warning/20",
    destructive: "bg-destructive/5 border-destructive/20",
  }

  const iconStyles = {
    default: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  }

  return (
    <Card className={`${variantStyles[variant]} transition-all hover:shadow-md`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {change && (
              <div className="flex items-center gap-1 text-sm">
                {trend === "up" && (
                  <TrendingUp className="h-4 w-4 text-destructive" />
                )}
                {trend === "down" && (
                  <TrendingDown className="h-4 w-4 text-success" />
                )}
                <span
                  className={
                    trend === "up"
                      ? "text-destructive"
                      : trend === "down"
                        ? "text-success"
                        : "text-muted-foreground"
                  }
                >
                  {change}
                </span>
                {description && (
                  <span className="text-muted-foreground">{description}</span>
                )}
              </div>
            )}
          </div>
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconStyles[variant]}`}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsCards() {
  const totalCases = diseases.reduce((acc, d) => acc + d.cases, 0)
  const totalDeaths = diseases.reduce((acc, d) => acc + d.deaths, 0)
  const totalVaccinations = vaccinationByRegion.reduce(
    (acc, v) => acc + v.doses,
    0
  )
  const avgCoverage =
    vaccinationByRegion.reduce((acc, v) => acc + v.coverage, 0) /
    vaccinationByRegion.length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total de Casos Ativos"
        value={formatNumber(totalCases)}
        change="+12.5%"
        trend="up"
        description="vs. mês anterior"
        icon={<Activity className="h-6 w-6" />}
        variant="destructive"
      />
      <StatCard
        title="Doses Aplicadas"
        value={formatNumber(totalVaccinations)}
        change="+8.2%"
        trend="up"
        description="vs. mês anterior"
        icon={<Syringe className="h-6 w-6" />}
        variant="success"
      />
      <StatCard
        title="Cobertura Vacinal Média"
        value={`${avgCoverage.toFixed(1)}%`}
        change="+3.1%"
        trend="up"
        description="vs. mês anterior"
        icon={<Users className="h-6 w-6" />}
        variant="default"
      />
      <StatCard
        title="Óbitos Registrados"
        value={formatNumber(totalDeaths)}
        change="-5.3%"
        trend="down"
        description="vs. mês anterior"
        icon={<TrendingDown className="h-6 w-6" />}
        variant="warning"
      />
    </div>
  )
}
