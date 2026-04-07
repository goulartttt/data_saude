// Dados simulados de saúde pública de São Paulo

export const diseaseData = {
  dengue: {
    name: "Dengue",
    color: "#ef4444",
    cases: 156789,
    deaths: 234,
    trend: "up",
    monthlyData: [
      { month: "Jan", cases: 8900, deaths: 12 },
      { month: "Fev", cases: 15600, deaths: 21 },
      { month: "Mar", cases: 23400, deaths: 34 },
      { month: "Abr", cases: 18700, deaths: 28 },
      { month: "Mai", cases: 14500, deaths: 22 },
      { month: "Jun", cases: 9800, deaths: 15 },
      { month: "Jul", cases: 6700, deaths: 10 },
      { month: "Ago", cases: 7800, deaths: 11 },
      { month: "Set", cases: 8900, deaths: 13 },
      { month: "Out", cases: 11200, deaths: 17 },
      { month: "Nov", cases: 13400, deaths: 20 },
      { month: "Dez", cases: 17889, deaths: 31 },
    ],
  },
  hiv: {
    name: "HIV/AIDS",
    color: "#8b5cf6",
    cases: 12678,
    deaths: 189,
    trend: "down",
    monthlyData: [
      { month: "Jan", cases: 1200, deaths: 18 },
      { month: "Fev", cases: 1100, deaths: 16 },
      { month: "Mar", cases: 1150, deaths: 17 },
      { month: "Abr", cases: 1050, deaths: 15 },
      { month: "Mai", cases: 980, deaths: 14 },
      { month: "Jun", cases: 920, deaths: 13 },
      { month: "Jul", cases: 890, deaths: 12 },
      { month: "Ago", cases: 950, deaths: 14 },
      { month: "Set", cases: 1020, deaths: 15 },
      { month: "Out", cases: 1080, deaths: 16 },
      { month: "Nov", cases: 1150, deaths: 17 },
      { month: "Dez", cases: 1188, deaths: 22 },
    ],
  },
  malaria: {
    name: "Malária",
    color: "#f59e0b",
    cases: 2345,
    deaths: 12,
    trend: "stable",
    monthlyData: [
      { month: "Jan", cases: 210, deaths: 1 },
      { month: "Fev", cases: 230, deaths: 1 },
      { month: "Mar", cases: 220, deaths: 1 },
      { month: "Abr", cases: 195, deaths: 1 },
      { month: "Mai", cases: 175, deaths: 1 },
      { month: "Jun", cases: 155, deaths: 1 },
      { month: "Jul", cases: 140, deaths: 1 },
      { month: "Ago", cases: 150, deaths: 1 },
      { month: "Set", cases: 170, deaths: 1 },
      { month: "Out", cases: 200, deaths: 1 },
      { month: "Nov", cases: 230, deaths: 1 },
      { month: "Dez", cases: 270, deaths: 1 },
    ],
  },
}

export const vaccinationData = {
  totalDoses: 34567890,
  coverage: 76.5,
  byRegion: [
    { region: "Zona Norte", coverage: 72, doses: 6845678 },
    { region: "Zona Sul", coverage: 78, doses: 8678901 },
    { region: "Zona Leste", coverage: 68, doses: 7456789 },
    { region: "Zona Oeste", coverage: 82, doses: 6765432 },
    { region: "Centro", coverage: 85, doses: 4821090 },
  ],
  byVaccine: [
    { name: "COVID-19", coverage: 82, doses: 15678901 },
    { name: "Gripe", coverage: 75, doses: 8567890 },
    { name: "Febre Amarela", coverage: 71, doses: 5456789 },
    { name: "Hepatite B", coverage: 89, doses: 3345678 },
    { name: "Tríplice Viral", coverage: 92, doses: 1519632 },
  ],
}

// Dados por zona e bairro de São Paulo
export const zonesData = [
  // ZONA NORTE
  { id: "santana", name: "Santana", zone: "Zona Norte", cases: 4520, deaths: 18, coverage: 78, population: 118797 },
  { id: "tucuruvi", name: "Tucuruvi", zone: "Zona Norte", cases: 3890, deaths: 15, coverage: 75, population: 98438 },
  { id: "tremembé", name: "Tremembé", zone: "Zona Norte", cases: 5670, deaths: 22, coverage: 65, population: 197258 },
  { id: "jacanã", name: "Jaçanã", zone: "Zona Norte", cases: 4230, deaths: 17, coverage: 62, population: 94609 },
  { id: "casa-verde", name: "Casa Verde", zone: "Zona Norte", cases: 3450, deaths: 14, coverage: 74, population: 85624 },
  { id: "freguesia-do-o", name: "Freguesia do Ó", zone: "Zona Norte", cases: 5120, deaths: 20, coverage: 68, population: 142327 },
  { id: "pirituba", name: "Pirituba", zone: "Zona Norte", cases: 6780, deaths: 27, coverage: 64, population: 167931 },
  { id: "perus", name: "Perus", zone: "Zona Norte", cases: 4890, deaths: 19, coverage: 58, population: 80187 },
  { id: "brasilandia", name: "Brasilândia", zone: "Zona Norte", cases: 8920, deaths: 35, coverage: 52, population: 264918 },
  { id: "vila-maria", name: "Vila Maria", zone: "Zona Norte", cases: 4120, deaths: 16, coverage: 71, population: 113845 },

  // ZONA SUL
  { id: "moema", name: "Moema", zone: "Zona Sul", cases: 1890, deaths: 7, coverage: 92, population: 83368 },
  { id: "itaim-bibi", name: "Itaim Bibi", zone: "Zona Sul", cases: 2120, deaths: 8, coverage: 89, population: 92570 },
  { id: "vila-mariana", name: "Vila Mariana", zone: "Zona Sul", cases: 2340, deaths: 9, coverage: 88, population: 130484 },
  { id: "jabaquara", name: "Jabaquara", zone: "Zona Sul", cases: 4560, deaths: 18, coverage: 72, population: 223780 },
  { id: "santo-amaro", name: "Santo Amaro", zone: "Zona Sul", cases: 3210, deaths: 13, coverage: 78, population: 71560 },
  { id: "campo-limpo", name: "Campo Limpo", zone: "Zona Sul", cases: 7890, deaths: 31, coverage: 58, population: 211361 },
  { id: "capao-redondo", name: "Capão Redondo", zone: "Zona Sul", cases: 9870, deaths: 39, coverage: 51, population: 268729 },
  { id: "jardim-angela", name: "Jardim Ângela", zone: "Zona Sul", cases: 11230, deaths: 45, coverage: 48, population: 295434 },
  { id: "grajaú", name: "Grajaú", zone: "Zona Sul", cases: 12450, deaths: 50, coverage: 45, population: 360787 },
  { id: "parelheiros", name: "Parelheiros", zone: "Zona Sul", cases: 5670, deaths: 23, coverage: 52, population: 139441 },

  // ZONA LESTE
  { id: "tatuapé", name: "Tatuapé", zone: "Zona Leste", cases: 3450, deaths: 14, coverage: 82, population: 91672 },
  { id: "penha", name: "Penha", zone: "Zona Leste", cases: 5670, deaths: 23, coverage: 68, population: 127820 },
  { id: "mooca", name: "Mooca", zone: "Zona Leste", cases: 2890, deaths: 12, coverage: 79, population: 75724 },
  { id: "vila-prudente", name: "Vila Prudente", zone: "Zona Leste", cases: 4230, deaths: 17, coverage: 71, population: 104242 },
  { id: "sao-mateus", name: "São Mateus", zone: "Zona Leste", cases: 8920, deaths: 36, coverage: 54, population: 155140 },
  { id: "itaquera", name: "Itaquera", zone: "Zona Leste", cases: 9450, deaths: 38, coverage: 56, population: 204871 },
  { id: "guaianases", name: "Guaianases", zone: "Zona Leste", cases: 7890, deaths: 31, coverage: 52, population: 111049 },
  { id: "cidade-tiradentes", name: "Cidade Tiradentes", zone: "Zona Leste", cases: 10230, deaths: 41, coverage: 48, population: 211501 },
  { id: "ermelino-matarazzo", name: "Ermelino Matarazzo", zone: "Zona Leste", cases: 5670, deaths: 23, coverage: 61, population: 113615 },
  { id: "sao-miguel", name: "São Miguel Paulista", zone: "Zona Leste", cases: 8450, deaths: 34, coverage: 55, population: 369496 },

  // ZONA OESTE
  { id: "pinheiros", name: "Pinheiros", zone: "Zona Oeste", cases: 1560, deaths: 6, coverage: 91, population: 65364 },
  { id: "jardins", name: "Jardins", zone: "Zona Oeste", cases: 1230, deaths: 5, coverage: 93, population: 88797 },
  { id: "perdizes", name: "Perdizes", zone: "Zona Oeste", cases: 2120, deaths: 8, coverage: 87, population: 111161 },
  { id: "lapa", name: "Lapa", zone: "Zona Oeste", cases: 2890, deaths: 12, coverage: 82, population: 65739 },
  { id: "vila-leopoldina", name: "Vila Leopoldina", zone: "Zona Oeste", cases: 1890, deaths: 8, coverage: 84, population: 39485 },
  { id: "butantã", name: "Butantã", zone: "Zona Oeste", cases: 3450, deaths: 14, coverage: 78, population: 54196 },
  { id: "rio-pequeno", name: "Rio Pequeno", zone: "Zona Oeste", cases: 4230, deaths: 17, coverage: 68, population: 118459 },
  { id: "raposo-tavares", name: "Raposo Tavares", zone: "Zona Oeste", cases: 5120, deaths: 20, coverage: 62, population: 100164 },
  { id: "jaguare", name: "Jaguaré", zone: "Zona Oeste", cases: 2670, deaths: 11, coverage: 75, population: 49863 },
  { id: "alto-pinheiros", name: "Alto de Pinheiros", zone: "Zona Oeste", cases: 980, deaths: 4, coverage: 94, population: 43117 },

  // CENTRO
  { id: "se", name: "Sé", zone: "Centro", cases: 3450, deaths: 14, coverage: 72, population: 23651 },
  { id: "republica", name: "República", zone: "Centro", cases: 4120, deaths: 16, coverage: 68, population: 56981 },
  { id: "liberdade", name: "Liberdade", zone: "Centro", cases: 2340, deaths: 9, coverage: 81, population: 69092 },
  { id: "bela-vista", name: "Bela Vista", zone: "Centro", cases: 2890, deaths: 12, coverage: 78, population: 69460 },
  { id: "consolacao", name: "Consolação", zone: "Centro", cases: 1890, deaths: 8, coverage: 85, population: 57365 },
  { id: "santa-cecilia", name: "Santa Cecília", zone: "Centro", cases: 2560, deaths: 10, coverage: 76, population: 83717 },
  { id: "bom-retiro", name: "Bom Retiro", zone: "Centro", cases: 2120, deaths: 8, coverage: 73, population: 33892 },
  { id: "bras", name: "Brás", zone: "Centro", cases: 3670, deaths: 15, coverage: 65, population: 29265 },
  { id: "cambuci", name: "Cambuci", zone: "Centro", cases: 1560, deaths: 6, coverage: 79, population: 36948 },
  { id: "pari", name: "Pari", zone: "Centro", cases: 1230, deaths: 5, coverage: 77, population: 17299 },
]

// Resumo por zona
export const zoneSummary = [
  { 
    zone: "Zona Norte", 
    cases: 51591, 
    deaths: 203, 
    coverage: 67, 
    population: 1363934,
    neighborhoods: 10,
    criticalAreas: 2,
    color: "#3b82f6"
  },
  { 
    zone: "Zona Sul", 
    cases: 61230, 
    deaths: 243, 
    coverage: 68, 
    population: 1883514,
    neighborhoods: 10,
    criticalAreas: 4,
    color: "#22c55e"
  },
  { 
    zone: "Zona Leste", 
    cases: 66850, 
    deaths: 269, 
    coverage: 63, 
    population: 1500130,
    neighborhoods: 10,
    criticalAreas: 5,
    color: "#f59e0b"
  },
  { 
    zone: "Zona Oeste", 
    cases: 26140, 
    deaths: 105, 
    coverage: 81, 
    population: 736345,
    neighborhoods: 10,
    criticalAreas: 1,
    color: "#8b5cf6"
  },
  { 
    zone: "Centro", 
    cases: 25830, 
    deaths: 103, 
    coverage: 75, 
    population: 476670,
    neighborhoods: 10,
    criticalAreas: 1,
    color: "#ef4444"
  },
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
  ubsList: [
    { name: "UBS Santana", address: "Rua Voluntários da Pátria, 4301", zone: "Zona Norte", phone: "(11) 2976-0000" },
    { name: "UBS Vila Mariana", address: "Rua José de Magalhães, 419", zone: "Zona Sul", phone: "(11) 5573-0000" },
    { name: "UBS Tatuapé", address: "Rua Serra de Botucatu, 1100", zone: "Zona Leste", phone: "(11) 2295-0000" },
    { name: "UBS Pinheiros", address: "Rua Ferreira de Araújo, 789", zone: "Zona Oeste", phone: "(11) 3032-0000" },
    { name: "UBS República", address: "Rua do Arouche, 24", zone: "Centro", phone: "(11) 3331-0000" },
  ],
}

export function formatNumber(num) {
  return new Intl.NumberFormat("pt-BR").format(num)
}

export function getRiskLevel(coverage) {
  if (coverage >= 80) return { level: "Baixo", color: "bg-green-500", textColor: "text-green-700", bgLight: "bg-green-100" }
  if (coverage >= 70) return { level: "Médio", color: "bg-yellow-500", textColor: "text-yellow-700", bgLight: "bg-yellow-100" }
  if (coverage >= 60) return { level: "Alto", color: "bg-orange-500", textColor: "text-orange-700", bgLight: "bg-orange-100" }
  return { level: "Crítico", color: "bg-red-500", textColor: "text-red-700", bgLight: "bg-red-100" }
}

export function getCasesRiskLevel(cases, population) {
  const rate = (cases / population) * 1000 // casos por 1000 habitantes
  if (rate < 20) return { level: "Baixo", color: "bg-green-500", textColor: "text-green-700" }
  if (rate < 40) return { level: "Médio", color: "bg-yellow-500", textColor: "text-yellow-700" }
  if (rate < 60) return { level: "Alto", color: "bg-orange-500", textColor: "text-orange-700" }
  return { level: "Crítico", color: "bg-red-500", textColor: "text-red-700" }
}

export function getTrendIcon(trend) {
  if (trend === "up") return { icon: "TrendingUp", color: "text-red-500" }
  if (trend === "down") return { icon: "TrendingDown", color: "text-green-500" }
  return { icon: "Minus", color: "text-gray-500" }
}
