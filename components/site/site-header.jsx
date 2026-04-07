"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Activity, 
  Menu, 
  X, 
  Heart,
  Shield,
  BarChart3,
  Map,
  Info,
  Syringe,
  Users,
  Calendar,
  CheckCircle,
  MapPin,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
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

const navItems = [
  { name: "Dashboard", href: "#dashboard", icon: BarChart3 },
  { name: "Mapa", href: "#mapa", icon: Map },
  { name: "Vacinacao", href: "#vacinacao", icon: Shield },
  { name: "Conscientizacao", href: "#conscientizacao", icon: Info },
]

const vaccineSchedule = [
  { vaccine: "COVID-19", age: "12+ anos", doses: "2 doses + reforco" },
  { vaccine: "Gripe (Influenza)", age: "6 meses+", doses: "Anual" },
  { vaccine: "Dengue", age: "4-60 anos", doses: "3 doses" },
  { vaccine: "Febre Amarela", age: "9 meses+", doses: "Dose unica" },
  { vaccine: "Hepatite B", age: "Nascimento+", doses: "3 doses" },
]

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [vaccineDialogOpen, setVaccineDialogOpen] = useState(false)

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setVaccineDialogOpen(false)
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-semibold leading-none tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Saude SP
            </span>
            <span className="text-xs text-muted-foreground">Secretaria Municipal de Saude</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Dialog open={vaccineDialogOpen} onOpenChange={setVaccineDialogOpen}>
            <DialogTrigger asChild>
              <Button className="hidden sm:flex gap-2" size="sm">
                <Heart className="h-4 w-4" />
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
                    window.open('https://www.prefeitura.sp.gov.br/cidade/secretarias/saude/unidades_de_saude/', '_blank')
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

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t md:hidden">
          <nav className="container mx-auto flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
            <Button 
              className="mt-2 w-full gap-2"
              onClick={() => {
                setMobileMenuOpen(false)
                setVaccineDialogOpen(true)
              }}
            >
              <Heart className="h-4 w-4" />
              Vacine-se
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
