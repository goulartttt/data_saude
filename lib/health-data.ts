// Tipos de dados de saúde
export interface DiseaseData {
  id: string
  name: string
  cases: number
  deaths: number
  recoveries: number
  trend: "up" | "down" | "stable"
  color: string
}

export interface VaccinationData {
  region: string
  coverage: number
  doses: number
  target: number
}

export interface TimeSeriesData {
  date: string
  dengue: number
  hiv: number
  malaria: number
  vaccinations: number
}

export interface RegionData {
  id: string
  name: string
  lat: number
  lng: number
  riskLevel: "low" | "medium" | "high" | "critical"
  cases: number
  coverage: number
}

// Dados simulados baseados em padrões reais do Brasil
export const diseases: DiseaseData[] = [
  {
    id: "dengue",
    name: "Dengue",
    cases: 1542890,
    deaths: 1023,
    recoveries: 1489234,
    trend: "up",
    color: "hsl(var(--chart-3))",
  },
  {
    id: "hiv",
    name: "HIV/AIDS",
    cases: 43560,
    deaths: 12890,
    recoveries: 0,
    trend: "stable",
    color: "hsl(var(--chart-5))",
  },
  {
    id: "malaria",
    name: "Malária",
    cases: 145230,
    deaths: 89,
    recoveries: 142100,
    trend: "down",
    color: "hsl(var(--chart-4))",
  },
]

export const vaccinationByRegion: VaccinationData[] = [
  { region: "São Paulo", coverage: 78, doses: 35420000, target: 45000000 },
  { region: "Rio de Janeiro", coverage: 72, doses: 11890000, target: 16500000 },
  { region: "Minas Gerais", coverage: 68, doses: 14230000, target: 21000000 },
  { region: "Bahia", coverage: 62, doses: 9180000, target: 14800000 },
  { region: "Paraná", coverage: 81, doses: 9070000, target: 11200000 },
]

export const generateTimeSeriesData = (
  startDate: Date,
  endDate: Date
): TimeSeriesData[] => {
  const data: TimeSeriesData[] = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const month = currentDate.getMonth()
    // Simulando sazonalidade (dengue maior no verão)
    const seasonalFactor = month >= 0 && month <= 3 ? 1.5 : month >= 10 ? 1.3 : 1

    data.push({
      date: currentDate.toISOString().split("T")[0],
      dengue: Math.round(45000 * seasonalFactor + Math.random() * 15000),
      hiv: Math.round(1200 + Math.random() * 300),
      malaria: Math.round(4500 + Math.random() * 1500),
      vaccinations: Math.round(800000 + Math.random() * 200000),
    })

    currentDate.setMonth(currentDate.getMonth() + 1)
  }

  return data
}

// Regiões de São Paulo com dados de risco
export const spRegions: RegionData[] = [
  {
    id: "centro",
    name: "Centro",
    lat: -23.5505,
    lng: -46.6333,
    riskLevel: "high",
    cases: 45230,
    coverage: 65,
  },
  {
    id: "zona-norte",
    name: "Zona Norte",
    lat: -23.4795,
    lng: -46.6333,
    riskLevel: "medium",
    cases: 28900,
    coverage: 72,
  },
  {
    id: "zona-sul",
    name: "Zona Sul",
    lat: -23.6505,
    lng: -46.6433,
    riskLevel: "low",
    cases: 12340,
    coverage: 85,
  },
  {
    id: "zona-leste",
    name: "Zona Leste",
    lat: -23.5405,
    lng: -46.4733,
    riskLevel: "critical",
    cases: 67800,
    coverage: 58,
  },
  {
    id: "zona-oeste",
    name: "Zona Oeste",
    lat: -23.5305,
    lng: -46.7533,
    riskLevel: "medium",
    cases: 23450,
    coverage: 75,
  },
  {
    id: "guarulhos",
    name: "Guarulhos",
    lat: -23.4538,
    lng: -46.5333,
    riskLevel: "high",
    cases: 38900,
    coverage: 62,
  },
  {
    id: "osasco",
    name: "Osasco",
    lat: -23.5325,
    lng: -46.7917,
    riskLevel: "medium",
    cases: 18700,
    coverage: 70,
  },
  {
    id: "campinas",
    name: "Campinas",
    lat: -22.9056,
    lng: -47.0608,
    riskLevel: "low",
    cases: 9800,
    coverage: 82,
  },
  {
    id: "santos",
    name: "Santos",
    lat: -23.9608,
    lng: -46.3336,
    riskLevel: "high",
    cases: 32100,
    coverage: 68,
  },
  {
    id: "abc",
    name: "ABC Paulista",
    lat: -23.6639,
    lng: -46.5275,
    riskLevel: "medium",
    cases: 25600,
    coverage: 74,
  },
]

export const getRiskColor = (level: RegionData["riskLevel"]) => {
  switch (level) {
    case "critical":
      return "#ef4444"
    case "high":
      return "#f97316"
    case "medium":
      return "#eab308"
    case "low":
      return "#22c55e"
  }
}

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("pt-BR").format(num)
}

// Dados de casos por estado brasileiro
export interface StateData {
  uf: string
  name: string
  cases: number
  deaths: number
  coverage: number
  population: number
}

export const brazilStatesData: StateData[] = [
  { uf: "AC", name: "Acre", cases: 8920, deaths: 45, coverage: 62, population: 906876 },
  { uf: "AL", name: "Alagoas", cases: 45230, deaths: 312, coverage: 58, population: 3365351 },
  { uf: "AP", name: "Amapá", cases: 6780, deaths: 28, coverage: 55, population: 877613 },
  { uf: "AM", name: "Amazonas", cases: 89450, deaths: 890, coverage: 52, population: 4269995 },
  { uf: "BA", name: "Bahia", cases: 234560, deaths: 1890, coverage: 62, population: 14985284 },
  { uf: "CE", name: "Ceará", cases: 178900, deaths: 1456, coverage: 65, population: 9240580 },
  { uf: "DF", name: "Distrito Federal", cases: 67890, deaths: 423, coverage: 78, population: 3094325 },
  { uf: "ES", name: "Espírito Santo", cases: 89230, deaths: 567, coverage: 72, population: 4108508 },
  { uf: "GO", name: "Goiás", cases: 145670, deaths: 1023, coverage: 68, population: 7206589 },
  { uf: "MA", name: "Maranhão", cases: 123450, deaths: 890, coverage: 54, population: 7153262 },
  { uf: "MT", name: "Mato Grosso", cases: 78900, deaths: 489, coverage: 64, population: 3567234 },
  { uf: "MS", name: "Mato Grosso do Sul", cases: 56780, deaths: 345, coverage: 71, population: 2839188 },
  { uf: "MG", name: "Minas Gerais", cases: 456780, deaths: 3456, coverage: 68, population: 21411923 },
  { uf: "PA", name: "Pará", cases: 167890, deaths: 1234, coverage: 51, population: 8777124 },
  { uf: "PB", name: "Paraíba", cases: 67890, deaths: 478, coverage: 63, population: 4059905 },
  { uf: "PR", name: "Paraná", cases: 234560, deaths: 1890, coverage: 81, population: 11597484 },
  { uf: "PE", name: "Pernambuco", cases: 189450, deaths: 1567, coverage: 61, population: 9674793 },
  { uf: "PI", name: "Piauí", cases: 45230, deaths: 312, coverage: 59, population: 3289290 },
  { uf: "RJ", name: "Rio de Janeiro", cases: 567890, deaths: 4567, coverage: 72, population: 17503349 },
  { uf: "RN", name: "Rio Grande do Norte", cases: 78900, deaths: 534, coverage: 66, population: 3560903 },
  { uf: "RS", name: "Rio Grande do Sul", cases: 289450, deaths: 2345, coverage: 79, population: 11466630 },
  { uf: "RO", name: "Rondônia", cases: 34560, deaths: 234, coverage: 60, population: 1815278 },
  { uf: "RR", name: "Roraima", cases: 5670, deaths: 23, coverage: 53, population: 652713 },
  { uf: "SC", name: "Santa Catarina", cases: 189450, deaths: 1456, coverage: 82, population: 7338473 },
  { uf: "SP", name: "São Paulo", cases: 1234560, deaths: 9876, coverage: 78, population: 46649132 },
  { uf: "SE", name: "Sergipe", cases: 34560, deaths: 234, coverage: 64, population: 2338474 },
  { uf: "TO", name: "Tocantins", cases: 23450, deaths: 145, coverage: 57, population: 1607363 },
]

export const getHeatmapColor = (value: number, max: number): string => {
  const ratio = value / max
  if (ratio > 0.8) return "#7f1d1d" // red-900
  if (ratio > 0.6) return "#dc2626" // red-600
  if (ratio > 0.4) return "#f97316" // orange-500
  if (ratio > 0.2) return "#facc15" // yellow-400
  return "#22c55e" // green-500
}

export const getCoverageColor = (coverage: number): string => {
  if (coverage >= 80) return "#15803d" // green-700
  if (coverage >= 70) return "#22c55e" // green-500
  if (coverage >= 60) return "#facc15" // yellow-400
  if (coverage >= 50) return "#f97316" // orange-500
  return "#dc2626" // red-600
}
