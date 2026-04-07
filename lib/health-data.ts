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
