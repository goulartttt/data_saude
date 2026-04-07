// Dados simulados de saúde pública do Brasil

export const diseaseData = {
  dengue: {
    name: "Dengue",
    color: "#ef4444",
    cases: 1456789,
    deaths: 1234,
    trend: "up",
    monthlyData: [
      { month: "Jan", cases: 89000, deaths: 78 },
      { month: "Fev", cases: 156000, deaths: 134 },
      { month: "Mar", cases: 234000, deaths: 198 },
      { month: "Abr", cases: 187000, deaths: 156 },
      { month: "Mai", cases: 145000, deaths: 123 },
      { month: "Jun", cases: 98000, deaths: 89 },
      { month: "Jul", cases: 67000, deaths: 56 },
      { month: "Ago", cases: 78000, deaths: 67 },
      { month: "Set", cases: 89000, deaths: 78 },
      { month: "Out", cases: 112000, deaths: 98 },
      { month: "Nov", cases: 134000, deaths: 112 },
      { month: "Dez", cases: 167789, deaths: 145 },
    ],
  },
  hiv: {
    name: "HIV/AIDS",
    color: "#8b5cf6",
    cases: 45678,
    deaths: 890,
    trend: "down",
    monthlyData: [
      { month: "Jan", cases: 4200, deaths: 82 },
      { month: "Fev", cases: 3900, deaths: 78 },
      { month: "Mar", cases: 4100, deaths: 80 },
      { month: "Abr", cases: 3800, deaths: 75 },
      { month: "Mai", cases: 3600, deaths: 72 },
      { month: "Jun", cases: 3500, deaths: 70 },
      { month: "Jul", cases: 3400, deaths: 68 },
      { month: "Ago", cases: 3600, deaths: 71 },
      { month: "Set", cases: 3700, deaths: 73 },
      { month: "Out", cases: 3800, deaths: 75 },
      { month: "Nov", cases: 4000, deaths: 78 },
      { month: "Dez", cases: 4078, deaths: 68 },
    ],
  },
  malaria: {
    name: "Malária",
    color: "#f59e0b",
    cases: 156789,
    deaths: 234,
    trend: "stable",
    monthlyData: [
      { month: "Jan", cases: 14500, deaths: 21 },
      { month: "Fev", cases: 15200, deaths: 22 },
      { month: "Mar", cases: 14800, deaths: 21 },
      { month: "Abr", cases: 13200, deaths: 19 },
      { month: "Mai", cases: 11800, deaths: 17 },
      { month: "Jun", cases: 10500, deaths: 15 },
      { month: "Jul", cases: 9800, deaths: 14 },
      { month: "Ago", cases: 10200, deaths: 15 },
      { month: "Set", cases: 11500, deaths: 17 },
      { month: "Out", cases: 13200, deaths: 19 },
      { month: "Nov", cases: 14500, deaths: 21 },
      { month: "Dez", cases: 17589, deaths: 33 },
    ],
  },
}

export const vaccinationData = {
  totalDoses: 234567890,
  coverage: 78.5,
  byRegion: [
    { region: "Norte", coverage: 68, doses: 12345678 },
    { region: "Nordeste", coverage: 72, doses: 45678901 },
    { region: "Centro-Oeste", coverage: 81, doses: 23456789 },
    { region: "Sudeste", coverage: 85, doses: 98765432 },
    { region: "Sul", coverage: 88, doses: 54321098 },
  ],
  byVaccine: [
    { name: "COVID-19", coverage: 82, doses: 156789012 },
    { name: "Gripe", coverage: 75, doses: 34567890 },
    { name: "Febre Amarela", coverage: 71, doses: 23456789 },
    { name: "Hepatite B", coverage: 89, doses: 12345678 },
    { name: "Tríplice Viral", coverage: 92, doses: 7654321 },
  ],
}

// Dados por estado brasileiro
export const statesData = [
  { uf: "AC", name: "Acre", region: "Norte", cases: 8920, deaths: 45, coverage: 62, population: 906876 },
  { uf: "AL", name: "Alagoas", region: "Nordeste", cases: 45230, deaths: 312, coverage: 58, population: 3365351 },
  { uf: "AP", name: "Amapá", region: "Norte", cases: 6780, deaths: 28, coverage: 55, population: 877613 },
  { uf: "AM", name: "Amazonas", region: "Norte", cases: 89450, deaths: 890, coverage: 52, population: 4269995 },
  { uf: "BA", name: "Bahia", region: "Nordeste", cases: 234560, deaths: 1890, coverage: 62, population: 14985284 },
  { uf: "CE", name: "Ceará", region: "Nordeste", cases: 178900, deaths: 1456, coverage: 65, population: 9240580 },
  { uf: "DF", name: "Distrito Federal", region: "Centro-Oeste", cases: 67890, deaths: 423, coverage: 78, population: 3094325 },
  { uf: "ES", name: "Espírito Santo", region: "Sudeste", cases: 89230, deaths: 567, coverage: 72, population: 4108508 },
  { uf: "GO", name: "Goiás", region: "Centro-Oeste", cases: 145670, deaths: 1023, coverage: 68, population: 7206589 },
  { uf: "MA", name: "Maranhão", region: "Nordeste", cases: 123450, deaths: 890, coverage: 54, population: 7153262 },
  { uf: "MT", name: "Mato Grosso", region: "Centro-Oeste", cases: 78900, deaths: 489, coverage: 64, population: 3567234 },
  { uf: "MS", name: "Mato Grosso do Sul", region: "Centro-Oeste", cases: 56780, deaths: 345, coverage: 71, population: 2839188 },
  { uf: "MG", name: "Minas Gerais", region: "Sudeste", cases: 456780, deaths: 3456, coverage: 68, population: 21411923 },
  { uf: "PA", name: "Pará", region: "Norte", cases: 167890, deaths: 1234, coverage: 51, population: 8777124 },
  { uf: "PB", name: "Paraíba", region: "Nordeste", cases: 67890, deaths: 478, coverage: 63, population: 4059905 },
  { uf: "PR", name: "Paraná", region: "Sul", cases: 234560, deaths: 1890, coverage: 81, population: 11597484 },
  { uf: "PE", name: "Pernambuco", region: "Nordeste", cases: 189450, deaths: 1567, coverage: 61, population: 9674793 },
  { uf: "PI", name: "Piauí", region: "Nordeste", cases: 45230, deaths: 312, coverage: 59, population: 3289290 },
  { uf: "RJ", name: "Rio de Janeiro", region: "Sudeste", cases: 567890, deaths: 4567, coverage: 72, population: 17503349 },
  { uf: "RN", name: "Rio Grande do Norte", region: "Nordeste", cases: 78900, deaths: 534, coverage: 66, population: 3560903 },
  { uf: "RS", name: "Rio Grande do Sul", region: "Sul", cases: 289450, deaths: 2345, coverage: 79, population: 11466630 },
  { uf: "RO", name: "Rondônia", region: "Norte", cases: 34560, deaths: 234, coverage: 60, population: 1815278 },
  { uf: "RR", name: "Roraima", region: "Norte", cases: 5670, deaths: 23, coverage: 53, population: 652713 },
  { uf: "SC", name: "Santa Catarina", region: "Sul", cases: 189450, deaths: 1456, coverage: 82, population: 7338473 },
  { uf: "SP", name: "São Paulo", region: "Sudeste", cases: 1234560, deaths: 9876, coverage: 78, population: 46649132 },
  { uf: "SE", name: "Sergipe", region: "Nordeste", cases: 34560, deaths: 234, coverage: 64, population: 2338474 },
  { uf: "TO", name: "Tocantins", region: "Norte", cases: 23450, deaths: 145, coverage: 57, population: 1607363 },
]

export const awarenessContent = {
  vaccines: [
    {
      title: "Por que vacinar?",
      description: "As vacinas são a forma mais eficaz de prevenir doenças graves e proteger você e sua comunidade.",
      icon: "shield",
    },
    {
      title: "Mitos e Verdades",
      description: "Esclareça suas dúvidas sobre vacinação com informações baseadas em evidências científicas.",
      icon: "info",
    },
    {
      title: "Calendário Vacinal",
      description: "Confira as vacinas recomendadas para cada faixa etária e mantenha sua carteirinha em dia.",
      icon: "calendar",
    },
  ],
  diseases: [
    {
      name: "Dengue",
      symptoms: "Febre alta, dor de cabeça, dores no corpo, manchas vermelhas",
      prevention: "Elimine água parada, use repelente, instale telas nas janelas",
    },
    {
      name: "HIV/AIDS",
      symptoms: "Febre, fadiga, inchaço dos gânglios, perda de peso",
      prevention: "Use preservativo, faça testes regulares, não compartilhe seringas",
    },
    {
      name: "Malária",
      symptoms: "Febre alta, calafrios, sudorese, dor de cabeça",
      prevention: "Use mosquiteiros, repelentes, roupas que cubram o corpo",
    },
  ],
}

export function formatNumber(num) {
  return new Intl.NumberFormat("pt-BR").format(num)
}

export function getRiskLevel(coverage) {
  if (coverage >= 80) return { level: "Baixo", color: "bg-green-500", textColor: "text-green-700" }
  if (coverage >= 70) return { level: "Médio", color: "bg-yellow-500", textColor: "text-yellow-700" }
  if (coverage >= 60) return { level: "Alto", color: "bg-orange-500", textColor: "text-orange-700" }
  return { level: "Crítico", color: "bg-red-500", textColor: "text-red-700" }
}

export function getTrendIcon(trend) {
  if (trend === "up") return { icon: "TrendingUp", color: "text-red-500" }
  if (trend === "down") return { icon: "TrendingDown", color: "text-green-500" }
  return { icon: "Minus", color: "text-gray-500" }
}
