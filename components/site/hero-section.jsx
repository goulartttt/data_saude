"use client"

import { useEffect, useState } from "react"
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Syringe,
  ArrowRight,
  Shield,
  MapPin,
  Phone,
  Clock,
  Navigation,
  ExternalLink,
  Building2,
  Calendar,
  CheckCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { formatNumber, awarenessContent } from "@/lib/health-data"

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

const vaccineSchedule = [
  { vaccine: "COVID-19", age: "12+ anos", doses: "2 doses + reforco" },
  { vaccine: "Gripe (Influenza)", age: "6 meses+", doses: "Anual" },
  { vaccine: "Dengue", age: "4-60 anos", doses: "3 doses" },
  { vaccine: "Febre Amarela", age: "9 meses+", doses: "Dose unica" },
  { vaccine: "Hepatite B", age: "Nascimento+", doses: "3 doses" },
]

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [ubsDialogOpen, setUbsDialogOpen] = useState(false)
  const [vaccineDialogOpen, setVaccineDialogOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

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
            Painel de Saude{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Publica de Sao Paulo
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground text-pretty">
            Acompanhe em tempo real os dados de vacinacao, casos de doencas e indicadores 
            de saude publica da cidade de Sao Paulo, por zona e bairro.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {/* Botao Ver Dashboard - rola para secao de dados */}
            <Button 
              size="lg" 
              className="gap-2 w-full sm:w-auto"
              onClick={() => scrollToSection('dados')}
            >
              Ver Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>

            {/* Botao Encontrar Posto de Vacinacao - abre modal */}
            <Dialog open={ubsDialogOpen} onOpenChange={setUbsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                  <MapPin className="h-4 w-4" />
                  Encontrar Posto de Vacinacao
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Postos de Vacinacao (UBS)
                  </DialogTitle>
                  <DialogDescription>
                    Encontre a Unidade Basica de Saude mais proxima de voce em Sao Paulo
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 my-4 max-h-[320px] overflow-y-auto">
                  {awarenessContent.ubsList.map((ubs, index) => (
                    <div 
                      key={index}
                      className="rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{ubs.name}</h4>
                          <div className="mt-2 space-y-1.5">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{ubs.address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{ubs.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>Seg-Sex: 7h-17h</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-xs">
                          {ubs.zone.replace("Zona ", "")}
                        </Badge>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 gap-1.5 text-xs"
                          onClick={() => {
                            window.open(`https://www.google.com/maps/search/${encodeURIComponent(ubs.name + " " + ubs.address + " Sao Paulo")}`, '_blank')
                          }}
                        >
                          <Navigation className="h-3 w-3" />
                          Ver no Mapa
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 gap-1.5 text-xs"
                          onClick={() => {
                            window.open(`tel:${ubs.phone.replace(/[^0-9]/g, '')}`, '_self')
                          }}
                        >
                          <Phone className="h-3 w-3" />
                          Ligar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <DialogFooter className="flex-col gap-2 sm:flex-row">
                  <Button 
                    variant="default" 
                    className="gap-2 w-full sm:w-auto"
                    onClick={() => {
                      window.open('https://www.prefeitura.sp.gov.br/cidade/secretarias/saude/unidades_de_saude/', '_blank')
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Ver Todas as UBS
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      Fechar
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Botao Vacine-se - abre modal com informacoes */}
            <Dialog open={vaccineDialogOpen} onOpenChange={setVaccineDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="lg" className="gap-2 w-full sm:w-auto">
                  <Syringe className="h-4 w-4" />
                  Vacine-se
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Syringe className="h-5 w-5 text-primary" />
                    Calendario de Vacinacao
                  </DialogTitle>
                  <DialogDescription>
                    Confira as vacinas disponiveis na rede publica de Sao Paulo
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 my-4">
                  {vaccineSchedule.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-4 rounded-lg border p-3"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{item.vaccine}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {item.age}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {item.doses}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Documentos Necessarios
                  </h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>- Documento de identificacao com foto (RG ou CNH)</li>
                    <li>- Cartao SUS (se tiver)</li>
                    <li>- Comprovante de residencia</li>
                    <li>- Carteira de vacinacao</li>
                  </ul>
                </div>
                <DialogFooter className="flex-col gap-2 sm:flex-row">
                  <Button 
                    variant="default" 
                    className="gap-2 w-full sm:w-auto"
                    onClick={() => {
                      setVaccineDialogOpen(false)
                      setUbsDialogOpen(true)
                    }}
                  >
                    <MapPin className="h-4 w-4" />
                    Encontrar UBS
                  </Button>
                  <Button 
                    variant="outline" 
                    className="gap-2 w-full sm:w-auto"
                    onClick={() => scrollToSection('conscientizacao')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Mais Informacoes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
