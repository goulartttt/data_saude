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
  Syringe,
  Baby,
  User,
  UserCheck,
  Users,
  ChevronDown
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
import { awarenessContent } from "@/lib/health-data"

const vaccineInfo = [
  { title: "Por que vacinar?", icon: Shield, description: "As vacinas sao a forma mais eficaz de prevenir doencas graves e proteger voce e sua comunidade." },
  { title: "Mitos e Verdades", icon: Info, description: "Esclareca suas duvidas sobre vacinacao com informacoes baseadas em evidencias cientificas." },
  { title: "Calendario Vacinal", icon: Calendar, description: "Confira as vacinas recomendadas para cada faixa etaria e mantenha sua carteirinha em dia." },
]

const mythsAndFacts = [
  { 
    myth: "Vacinas causam autismo", 
    fact: "Nao existe nenhuma evidencia cientifica que relacione vacinas ao autismo. Estudos com milhoes de criancas comprovam a seguranca das vacinas.",
    isMyth: true
  },
  { 
    myth: "A imunidade natural e melhor que a vacina", 
    fact: "Embora a infeccao natural possa gerar imunidade, os riscos de complicacoes graves sao muito maiores do que os efeitos colaterais das vacinas.",
    isMyth: true
  },
  { 
    myth: "Vacinas fortalecem o sistema imunologico", 
    fact: "Verdade! As vacinas ensinam o sistema imunologico a reconhecer e combater patogenos especificos de forma segura.",
    isMyth: false
  },
  { 
    myth: "Pessoas saudaveis nao precisam se vacinar", 
    fact: "Mesmo pessoas saudaveis podem contrair e transmitir doencas. A vacinacao protege voce e pessoas vulneraveis ao seu redor.",
    isMyth: true
  },
]

const diseaseCards = [
  {
    name: "Dengue",
    icon: Bug,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-200",
    symptoms: ["Febre alta (39C a 40C)", "Dor de cabeca intensa", "Dores no corpo e articulacoes", "Manchas vermelhas na pele", "Nauseas e vomitos"],
    prevention: ["Elimine agua parada", "Use repelente diariamente", "Instale telas nas janelas", "Use roupas que cubram o corpo", "Mantenha a caixa de agua fechada"],
    alert: "Procure atendimento medico imediato se apresentar sangramentos ou dor abdominal intensa.",
    vaccine: { available: true, name: "Qdenga", doses: "3 doses", age: "4-60 anos" }
  },
  {
    name: "HIV/AIDS",
    icon: HeartPulse,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-200",
    symptoms: ["Febre persistente", "Fadiga extrema", "Inchaco dos ganglios", "Perda de peso inexplicada", "Sudorese noturna"],
    prevention: ["Use preservativo em todas as relacoes", "Faca testes regulares", "Nao compartilhe seringas", "PrEP para grupos de risco", "Tratamento como prevencao"],
    alert: "O diagnostico precoce e fundamental. Faca o teste e, se positivo, inicie o tratamento imediatamente.",
    vaccine: { available: false, note: "Ainda nao existe vacina, mas a PrEP e eficaz na prevencao" }
  },
  {
    name: "Malaria",
    icon: AlertTriangle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-200",
    symptoms: ["Febre alta com calafrios", "Sudorese intensa", "Dor de cabeca", "Dores musculares", "Ciclos de febre a cada 48-72h"],
    prevention: ["Use mosquiteiros tratados", "Aplique repelente", "Use roupas compridas", "Evite areas de risco ao anoitecer", "Tome medicacao profilatica em viagens"],
    alert: "Em regioes endemicas, procure atendimento imediato ao primeiro sinal de febre.",
    vaccine: { available: true, name: "RTS,S", doses: "4 doses", age: "Criancas em areas endemicas" }
  },
]

// Calendario de vacinacao organizado por faixa etaria (formato de arvore)
const vaccineTree = [
  {
    category: "Recem-nascido",
    icon: Baby,
    color: "bg-pink-500",
    items: [
      { age: "Ao nascer", vaccines: [
        { name: "BCG", description: "Protege contra tuberculose", doses: "Dose unica" },
        { name: "Hepatite B", description: "Primeira dose", doses: "1a dose" }
      ]}
    ]
  },
  {
    category: "Bebe (2-12 meses)",
    icon: Baby,
    color: "bg-blue-500",
    items: [
      { age: "2 meses", vaccines: [
        { name: "Pentavalente", description: "DTP + Hib + Hepatite B", doses: "1a dose" },
        { name: "VIP", description: "Poliomielite inativada", doses: "1a dose" },
        { name: "Pneumo 10", description: "Pneumococica", doses: "1a dose" },
        { name: "Rotavirus", description: "Gastroenterite", doses: "1a dose" }
      ]},
      { age: "4 meses", vaccines: [
        { name: "Pentavalente", description: "DTP + Hib + Hepatite B", doses: "2a dose" },
        { name: "VIP", description: "Poliomielite inativada", doses: "2a dose" },
        { name: "Pneumo 10", description: "Pneumococica", doses: "2a dose" },
        { name: "Rotavirus", description: "Gastroenterite", doses: "2a dose" }
      ]},
      { age: "6 meses", vaccines: [
        { name: "Pentavalente", description: "DTP + Hib + Hepatite B", doses: "3a dose" },
        { name: "VIP", description: "Poliomielite inativada", doses: "3a dose" },
        { name: "COVID-19", description: "Coronavirus", doses: "1a dose" }
      ]},
      { age: "9 meses", vaccines: [
        { name: "Febre Amarela", description: "Doenca viral", doses: "Dose unica" }
      ]}
    ]
  },
  {
    category: "Crianca (1-4 anos)",
    icon: User,
    color: "bg-green-500",
    items: [
      { age: "12 meses", vaccines: [
        { name: "Triplice Viral", description: "Sarampo, Caxumba, Rubeola", doses: "1a dose" },
        { name: "Pneumo 10", description: "Pneumococica", doses: "Reforco" },
        { name: "Meningococica C", description: "Meningite", doses: "Reforco" }
      ]},
      { age: "15 meses", vaccines: [
        { name: "DTP", description: "Difteria, Tetano, Coqueluche", doses: "1o reforco" },
        { name: "VOP", description: "Poliomielite oral", doses: "1o reforco" },
        { name: "Hepatite A", description: "Hepatite viral", doses: "Dose unica" },
        { name: "Tetra Viral", description: "Triplice viral + Varicela", doses: "Dose unica" }
      ]},
      { age: "4 anos", vaccines: [
        { name: "DTP", description: "Difteria, Tetano, Coqueluche", doses: "2o reforco" },
        { name: "VOP", description: "Poliomielite oral", doses: "2o reforco" },
        { name: "Varicela", description: "Catapora", doses: "2a dose" }
      ]}
    ]
  },
  {
    category: "Adolescente e Adulto",
    icon: UserCheck,
    color: "bg-purple-500",
    items: [
      { age: "9-14 anos", vaccines: [
        { name: "HPV", description: "Papilomavirus humano", doses: "2 doses" },
        { name: "Meningococica ACWY", description: "Meningite", doses: "Dose unica" }
      ]},
      { age: "Adultos", vaccines: [
        { name: "Hepatite B", description: "Para nao vacinados", doses: "3 doses" },
        { name: "dT", description: "Difteria e Tetano", doses: "A cada 10 anos" },
        { name: "Febre Amarela", description: "Areas de risco", doses: "Dose unica" }
      ]}
    ]
  },
  {
    category: "Vacinas Anuais (Todos)",
    icon: Users,
    color: "bg-amber-500",
    items: [
      { age: "Anual", vaccines: [
        { name: "Gripe (Influenza)", description: "Grupos prioritarios: idosos, gestantes, criancas, profissionais de saude", doses: "Dose anual" },
        { name: "COVID-19", description: "Reforco anual para grupos de risco e idosos", doses: "Reforco anual" }
      ]}
    ]
  }
]

// Calendario completo detalhado
const fullCalendarData = [
  { age: "Ao nascer", vaccines: ["BCG (dose unica)", "Hepatite B (1a dose)"] },
  { age: "2 meses", vaccines: ["Pentavalente (1a dose)", "VIP (1a dose)", "Pneumo 10 (1a dose)", "Rotavirus (1a dose)"] },
  { age: "3 meses", vaccines: ["Meningococica C (1a dose)"] },
  { age: "4 meses", vaccines: ["Pentavalente (2a dose)", "VIP (2a dose)", "Pneumo 10 (2a dose)", "Rotavirus (2a dose)"] },
  { age: "5 meses", vaccines: ["Meningococica C (2a dose)"] },
  { age: "6 meses", vaccines: ["Pentavalente (3a dose)", "VIP (3a dose)", "COVID-19 (1a dose)"] },
  { age: "9 meses", vaccines: ["Febre Amarela (dose unica)"] },
  { age: "12 meses", vaccines: ["Triplice Viral (1a dose)", "Pneumo 10 (reforco)", "Meningococica C (reforco)"] },
  { age: "15 meses", vaccines: ["DTP (1o reforco)", "VOP (1o reforco)", "Hepatite A (dose unica)", "Tetra Viral (dose unica)"] },
  { age: "4 anos", vaccines: ["DTP (2o reforco)", "VOP (2o reforco)", "Varicela (2a dose)"] },
  { age: "9-14 anos", vaccines: ["HPV (2 doses)", "Meningococica ACWY (dose unica)"] },
  { age: "Adolescentes", vaccines: ["dT (reforco)", "Febre Amarela (se nao vacinado)"] },
  { age: "Adultos", vaccines: ["Hepatite B (3 doses se nao vacinado)", "dT (a cada 10 anos)", "Febre Amarela (areas de risco)"] },
  { age: "Gestantes", vaccines: ["dTpa (a cada gestacao)", "Hepatite B (se nao vacinada)", "Influenza (anual)"] },
  { age: "Idosos 60+", vaccines: ["Influenza (anual)", "Pneumo 23 (dose unica)", "COVID-19 (reforco anual)"] },
  { age: "Anual (grupos prioritarios)", vaccines: ["Influenza", "COVID-19 (reforco)"] },
]

export function AwarenessSection() {
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState(["Recem-nascido", "Vacinas Anuais (Todos)"])

  const toggleCategory = (category) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  return (
    <section id="conscientizacao" className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 
            className="mb-3 text-3xl font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Conscientizacao e Prevencao
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Informacao e a melhor prevencao. Conheca mais sobre vacinacao e as principais doencas
          </p>
        </div>

        <Tabs defaultValue="vacinas" className="space-y-8">
          <TabsList className="mx-auto flex w-fit">
            <TabsTrigger value="vacinas" className="gap-2">
              <Syringe className="h-4 w-4" />
              Vacinacao
            </TabsTrigger>
            <TabsTrigger value="doencas" className="gap-2">
              <Bug className="h-4 w-4" />
              Doencas
            </TabsTrigger>
            <TabsTrigger value="calendario" className="gap-2">
              <Calendar className="h-4 w-4" />
              Calendario
            </TabsTrigger>
          </TabsList>

          {/* Tab Vacinacao */}
          <TabsContent value="vacinas" className="space-y-8">
            {/* Cards de Informacao */}
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
                  Descubra a verdade por tras das principais fake news sobre vacinacao
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

          {/* Tab Doencas */}
          <TabsContent value="doencas">
            <div className="grid gap-6 lg:grid-cols-3">
              {diseaseCards.map((disease, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className={disease.bgColor}>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-background ${disease.color}`}>
                        <disease.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle>{disease.name}</CardTitle>
                        {disease.vaccine.available && (
                          <Badge variant="outline" className="mt-1 bg-green-50 text-green-700 border-green-200">
                            Vacina disponivel
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-2 font-semibold flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
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
                          Prevencao
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

                      {/* Informacoes da Vacina */}
                      {disease.vaccine.available ? (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                          <h4 className="font-semibold text-sm text-green-800 flex items-center gap-2 mb-2">
                            <Syringe className="h-4 w-4" />
                            Vacina: {disease.vaccine.name}
                          </h4>
                          <div className="text-xs text-green-700 space-y-1">
                            <p>Doses: {disease.vaccine.doses}</p>
                            <p>Idade: {disease.vaccine.age}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                          <p className="text-sm text-amber-700">
                            {disease.vaccine.note}
                          </p>
                        </div>
                      )}

                      <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                        <p className="text-sm text-red-700">
                          <strong>Atencao:</strong> {disease.alert}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab Calendario - Formato de Arvore */}
          <TabsContent value="calendario">
            <Card>
              <CardHeader>
                <CardTitle>Calendario Nacional de Vacinacao</CardTitle>
                <CardDescription>
                  Confira as vacinas recomendadas para cada fase da vida - clique para expandir
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vaccineTree.map((category, catIndex) => (
                    <div key={catIndex} className="rounded-lg border overflow-hidden">
                      {/* Categoria Header - Clicavel */}
                      <button
                        onClick={() => toggleCategory(category.category)}
                        className="w-full flex items-center gap-4 p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${category.color} text-white shrink-0`}>
                          <category.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-base">{category.category}</h3>
                          <p className="text-xs text-muted-foreground">
                            {category.items.reduce((acc, item) => acc + item.vaccines.length, 0)} vacinas
                          </p>
                        </div>
                        <ChevronDown 
                          className={`h-5 w-5 text-muted-foreground transition-transform ${
                            expandedCategories.includes(category.category) ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      {/* Conteudo Expandivel */}
                      {expandedCategories.includes(category.category) && (
                        <div className="border-t">
                          {category.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="p-4 border-b last:border-b-0">
                              <div className="flex items-start gap-4">
                                {/* Linha da arvore */}
                                <div className="flex flex-col items-center">
                                  <div className={`w-3 h-3 rounded-full ${category.color}`} />
                                  {itemIndex < category.items.length - 1 && (
                                    <div className={`w-0.5 flex-1 mt-1 ${category.color} opacity-30`} style={{ minHeight: '60px' }} />
                                  )}
                                </div>
                                
                                <div className="flex-1">
                                  <Badge variant="outline" className="mb-3">
                                    {item.age}
                                  </Badge>
                                  <div className="grid gap-2 sm:grid-cols-2">
                                    {item.vaccines.map((vaccine, vIndex) => (
                                      <div 
                                        key={vIndex}
                                        className="flex items-start gap-2 p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                                      >
                                        <Syringe className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                        <div>
                                          <p className="font-medium text-sm">{vaccine.name}</p>
                                          <p className="text-xs text-muted-foreground">{vaccine.description}</p>
                                          <Badge variant="secondary" className="mt-1 text-xs">
                                            {vaccine.doses}
                                          </Badge>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <Dialog open={calendarDialogOpen} onOpenChange={setCalendarDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Calendar className="h-4 w-4" />
                        Ver Calendario Completo
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          Calendario Nacional de Vacinacao Completo
                        </DialogTitle>
                        <DialogDescription>
                          Todas as vacinas recomendadas pelo Ministerio da Saude por faixa etaria
                        </DialogDescription>
                      </DialogHeader>
                      <div className="overflow-y-auto max-h-[50vh] pr-2">
                        <div className="space-y-3">
                          {fullCalendarData.map((item, index) => (
                            <div 
                              key={index}
                              className="rounded-lg border p-4 hover:bg-muted/30 transition-colors"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                                  <span className="text-xs font-bold text-primary">
                                    {index + 1}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <Badge variant="outline" className="mb-2">
                                    {item.age}
                                  </Badge>
                                  <div className="flex flex-wrap gap-1.5">
                                    {item.vaccines.map((vaccine, vIndex) => (
                                      <Badge key={vIndex} variant="secondary" className="text-xs">
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
                      <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 mt-4">
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <Info className="h-4 w-4 text-primary" />
                          Importante
                        </h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>- Todas as vacinas do calendario sao gratuitas na rede publica</li>
                          <li>- Leve sempre a caderneta de vacinacao</li>
                          <li>- Consulte a UBS para verificar disponibilidade</li>
                          <li>- Em caso de duvidas, fale com um profissional de saude</li>
                        </ul>
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          className="gap-2"
                          onClick={() => {
                            window.open('https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/c/calendario-nacional-de-vacinacao', '_blank')
                          }}
                        >
                          <Info className="h-4 w-4" />
                          Site Oficial do Ministerio
                        </Button>
                        <DialogClose asChild>
                          <Button>Fechar</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
