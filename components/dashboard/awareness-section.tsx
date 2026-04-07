"use client"

import { AlertTriangle, CheckCircle2, Info, ShieldAlert, Syringe, Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const vaccineInfo = [
  {
    title: "Por que se vacinar?",
    content:
      "As vacinas são uma das formas mais eficazes de prevenir doenças infecciosas. Elas estimulam o sistema imunológico a produzir anticorpos, protegendo você e sua comunidade contra doenças graves como dengue, febre amarela, hepatite e muitas outras.",
    icon: <Syringe className="h-5 w-5 text-primary" />,
  },
  {
    title: "Calendário Nacional de Vacinação",
    content:
      "O Brasil possui um dos mais completos calendários de vacinação do mundo, oferecido gratuitamente pelo SUS. Ele inclui vacinas para todas as faixas etárias, desde o nascimento até a terceira idade. Consulte a UBS mais próxima para verificar sua situação vacinal.",
    icon: <CheckCircle2 className="h-5 w-5 text-success" />,
  },
  {
    title: "Mitos e Verdades",
    content:
      "Vacinas NÃO causam autismo - isso foi comprovado por dezenas de estudos científicos. Vacinas são seguras e passam por rigorosos testes antes de serem aprovadas. Os efeitos colaterais, quando ocorrem, são geralmente leves como dor no local da aplicação.",
    icon: <Info className="h-5 w-5 text-primary" />,
  },
]

const diseaseRisks = [
  {
    disease: "Dengue",
    risk: "A dengue pode evoluir para forma grave com risco de morte. O Brasil registrou mais de 1,5 milhão de casos em 2024. A eliminação de criadouros do mosquito Aedes aegypti é fundamental.",
    prevention: ["Eliminar água parada", "Usar repelente", "Instalar telas nas janelas", "Vacinar-se quando disponível"],
  },
  {
    disease: "HIV/AIDS",
    risk: "O HIV ainda é uma realidade no Brasil, com mais de 40 mil novos casos por ano. O diagnóstico precoce e o tratamento adequado permitem uma vida normal e impedem a transmissão.",
    prevention: ["Usar preservativo", "Fazer testes regularmente", "PrEP para grupos de risco", "Não compartilhar seringas"],
  },
  {
    disease: "Malária",
    risk: "A malária é endêmica na região Norte do Brasil. Sem tratamento adequado, pode levar a complicações graves. O diagnóstico rápido é essencial para a cura.",
    prevention: ["Usar mosquiteiro", "Aplicar repelente", "Usar roupas longas", "Buscar atendimento rápido ao ter febre"],
  },
]

export function AwarenessSection() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Heart className="h-5 w-5 text-destructive" />
            Conscientização sobre Vacinação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Alerta principal */}
          <Alert className="border-primary/20 bg-primary/5">
            <Syringe className="h-4 w-4" />
            <AlertTitle>Vacinas Salvam Vidas</AlertTitle>
            <AlertDescription>
              A vacinação é responsável por prevenir entre 3,5 e 5 milhões de mortes por ano em todo o mundo.
              Mantenha sua caderneta de vacinação em dia e proteja você e sua família.
            </AlertDescription>
          </Alert>

          {/* Informações sobre vacinas */}
          <Accordion type="single" collapsible className="w-full">
            {vaccineInfo.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Estatísticas de impacto */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-success/10 p-4 text-center">
              <p className="text-3xl font-bold text-success">95%</p>
              <p className="text-sm text-muted-foreground">
                Eficácia média das vacinas do calendário nacional
              </p>
            </div>
            <div className="rounded-lg bg-primary/10 p-4 text-center">
              <p className="text-3xl font-bold text-primary">20+</p>
              <p className="text-sm text-muted-foreground">
                Vacinas oferecidas gratuitamente pelo SUS
              </p>
            </div>
            <div className="rounded-lg bg-warning/10 p-4 text-center">
              <p className="text-3xl font-bold text-warning">40%</p>
              <p className="text-sm text-muted-foreground">
                Da população ainda não completou o esquema vacinal
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ShieldAlert className="h-5 w-5 text-warning" />
            Riscos da Falta de Imunização
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Alerta de risco */}
          <Alert variant="destructive" className="bg-destructive/5">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              A baixa cobertura vacinal pode levar ao retorno de doenças já controladas.
              O sarampo, por exemplo, voltou a circular no Brasil após anos sem casos.
            </AlertDescription>
          </Alert>

          {/* Cards de doenças */}
          <div className="grid gap-4 md:grid-cols-3">
            {diseaseRisks.map((disease, index) => (
              <Card key={index} className="border-border">
                <CardContent className="p-4">
                  <h4 className="mb-2 font-semibold">{disease.disease}</h4>
                  <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                    {disease.risk}
                  </p>
                  <div>
                    <p className="mb-2 text-xs font-medium text-muted-foreground uppercase">
                      Prevenção:
                    </p>
                    <ul className="space-y-1">
                      {disease.prevention.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle2 className="h-3 w-3 text-success shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Problemas atuais */}
          <div className="rounded-lg border border-border p-4">
            <h4 className="mb-4 font-semibold">Desafios Atuais da Saúde Pública</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </div>
                <div>
                  <p className="font-medium text-sm">Desinformação</p>
                  <p className="text-xs text-muted-foreground">
                    Fake news sobre vacinas reduzem a adesão à imunização
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warning/10">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="font-medium text-sm">Baixa Cobertura</p>
                  <p className="text-xs text-muted-foreground">
                    Muitas regiões não atingem a meta de 95% de cobertura
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Info className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Acesso Limitado</p>
                  <p className="text-xs text-muted-foreground">
                    Populações rurais têm dificuldade de acesso às UBS
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="font-medium text-sm">Solução</p>
                  <p className="text-xs text-muted-foreground">
                    Informação de qualidade e campanhas de conscientização
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
