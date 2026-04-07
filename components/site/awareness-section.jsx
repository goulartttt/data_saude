"use client"

import { useState } from "react"
import { 
  Shield, 
  Info, 
  Calendar, 
  Bug, 
  HeartPulse, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Syringe
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { awarenessContent } from "@/lib/health-data"

const vaccineInfo = [
  { title: "Por que vacinar?", icon: Shield, description: "As vacinas são a forma mais eficaz de prevenir doenças graves e proteger você e sua comunidade." },
  { title: "Mitos e Verdades", icon: Info, description: "Esclareça suas dúvidas sobre vacinação com informações baseadas em evidências científicas." },
  { title: "Calendário Vacinal", icon: Calendar, description: "Confira as vacinas recomendadas para cada faixa etária e mantenha sua carteirinha em dia." },
]

const mythsAndFacts = [
  { 
    myth: "Vacinas causam autismo", 
    fact: "Não existe nenhuma evidência científica que relacione vacinas ao autismo. Estudos com milhões de crianças comprovam a segurança das vacinas.",
    isMyth: true
  },
  { 
    myth: "A imunidade natural é melhor que a vacina", 
    fact: "Embora a infecção natural possa gerar imunidade, os riscos de complicações graves são muito maiores do que os efeitos colaterais das vacinas.",
    isMyth: true
  },
  { 
    myth: "Vacinas fortalecem o sistema imunológico", 
    fact: "Verdade! As vacinas ensinam o sistema imunológico a reconhecer e combater patógenos específicos de forma segura.",
    isMyth: false
  },
  { 
    myth: "Pessoas saudáveis não precisam se vacinar", 
    fact: "Mesmo pessoas saudáveis podem contrair e transmitir doenças. A vacinação protege você e pessoas vulneráveis ao seu redor.",
    isMyth: true
  },
]

const diseaseCards = [
  {
    name: "Dengue",
    icon: Bug,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    symptoms: ["Febre alta (39°C a 40°C)", "Dor de cabeça intensa", "Dores no corpo e articulações", "Manchas vermelhas na pele", "Náuseas e vômitos"],
    prevention: ["Elimine água parada", "Use repelente diariamente", "Instale telas nas janelas", "Use roupas que cubram o corpo", "Mantenha a caixa d'água fechada"],
    alert: "Procure atendimento médico imediato se apresentar sangramentos ou dor abdominal intensa."
  },
  {
    name: "HIV/AIDS",
    icon: HeartPulse,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    symptoms: ["Febre persistente", "Fadiga extrema", "Inchaço dos gânglios", "Perda de peso inexplicada", "Sudorese noturna"],
    prevention: ["Use preservativo em todas as relações", "Faça testes regulares", "Não compartilhe seringas", "PrEP para grupos de risco", "Tratamento como prevenção"],
    alert: "O diagnóstico precoce é fundamental. Faça o teste e, se positivo, inicie o tratamento imediatamente."
  },
  {
    name: "Malária",
    icon: AlertTriangle,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    symptoms: ["Febre alta com calafrios", "Sudorese intensa", "Dor de cabeça", "Dores musculares", "Ciclos de febre a cada 48-72h"],
    prevention: ["Use mosquiteiros tratados", "Aplique repelente", "Use roupas compridas", "Evite áreas de risco ao anoitecer", "Tome medicação profilática em viagens"],
    alert: "Em regiões endêmicas, procure atendimento imediato ao primeiro sinal de febre."
  },
]

const vaccineSchedule = [
  { age: "Ao nascer", vaccines: ["BCG", "Hepatite B"] },
  { age: "2 meses", vaccines: ["Pentavalente", "VIP", "Pneumo 10", "Rotavírus"] },
  { age: "4 meses", vaccines: ["Pentavalente", "VIP", "Pneumo 10", "Rotavírus"] },
  { age: "6 meses", vaccines: ["Pentavalente", "VIP", "COVID-19"] },
  { age: "9 meses", vaccines: ["Febre Amarela"] },
  { age: "12 meses", vaccines: ["Tríplice Viral", "Pneumo 10", "Meningocócica C"] },
  { age: "15 meses", vaccines: ["DTP", "VOP", "Hepatite A", "Tetra Viral"] },
  { age: "Anual", vaccines: ["Gripe (grupos prioritários)"] },
]

export function AwarenessSection() {
  return (
    <section id="conscientizacao" className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 
            className="mb-3 text-3xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Conscientização e Prevenção
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Informação é a melhor prevenção. Conheça mais sobre vacinação e as principais doenças
          </p>
        </div>

        <Tabs defaultValue="vacinas" className="space-y-8">
          <TabsList className="mx-auto flex w-fit">
            <TabsTrigger value="vacinas" className="gap-2">
              <Syringe className="h-4 w-4" />
              Vacinação
            </TabsTrigger>
            <TabsTrigger value="doencas" className="gap-2">
              <Bug className="h-4 w-4" />
              Doenças
            </TabsTrigger>
            <TabsTrigger value="calendario" className="gap-2">
              <Calendar className="h-4 w-4" />
              Calendário
            </TabsTrigger>
          </TabsList>

          {/* Tab Vacinação */}
          <TabsContent value="vacinas" className="space-y-8">
            {/* Cards de Informação */}
            <div className="grid gap-6 md:grid-cols-3">
              {vaccineInfo.map((item, index) => (
                <Card key={index} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Mitos e Verdades */}
            <Card>
              <CardHeader>
                <CardTitle>Mitos e Verdades sobre Vacinas</CardTitle>
                <CardDescription>
                  Descubra a verdade por trás das principais fake news sobre vacinação
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {mythsAndFacts.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                          {item.isMyth ? (
                            <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                          )}
                          <span className="text-left">
                            {item.isMyth ? "MITO: " : "VERDADE: "}
                            {item.myth}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="ml-8 rounded-lg bg-muted/50 p-4">
                          <p className="text-muted-foreground">{item.fact}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Doenças */}
          <TabsContent value="doencas">
            <div className="grid gap-6 lg:grid-cols-3">
              {diseaseCards.map((disease, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className={disease.bgColor}>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-background ${disease.color}`}>
                        <disease.icon className="h-5 w-5" />
                      </div>
                      <CardTitle>{disease.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-2 font-semibold flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          Sintomas
                        </h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {disease.symptoms.map((symptom, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <ChevronRight className="h-4 w-4 mt-0.5 shrink-0" />
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="mb-2 font-semibold flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          Prevenção
                        </h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          {disease.prevention.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 mt-0.5 shrink-0 text-green-500" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30">
                        <p className="text-sm text-red-700 dark:text-red-300">
                          <strong>Atenção:</strong> {disease.alert}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab Calendário */}
          <TabsContent value="calendario">
            <Card>
              <CardHeader>
                <CardTitle>Calendário Nacional de Vacinação</CardTitle>
                <CardDescription>
                  Confira as vacinas recomendadas para cada fase da vida
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Timeline */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border md:left-1/2 md:-translate-x-0.5" />
                  
                  <div className="space-y-8">
                    {vaccineSchedule.map((item, index) => (
                      <div 
                        key={index}
                        className={`relative flex flex-col md:flex-row ${
                          index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                        }`}
                      >
                        {/* Dot */}
                        <div className="absolute left-4 md:left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-background bg-primary" />
                        
                        {/* Content */}
                        <div className={`ml-12 md:ml-0 md:w-1/2 ${
                          index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                        }`}>
                          <div className={`inline-block rounded-lg border bg-card p-4 shadow-sm ${
                            index % 2 === 0 ? 'md:mr-0' : 'md:ml-0'
                          }`}>
                            <Badge variant="outline" className="mb-2">
                              {item.age}
                            </Badge>
                            <div className={`flex flex-wrap gap-2 ${
                              index % 2 === 0 ? 'md:justify-end' : ''
                            }`}>
                              {item.vaccines.map((vaccine, i) => (
                                <Badge key={i} variant="secondary">
                                  {vaccine}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex justify-center">
                  <Button className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Ver Calendário Completo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
