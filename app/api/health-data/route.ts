import { NextResponse } from "next/server"

// Simulação de dados de API (em produção, conectaria ao OpenDataSUS)
// Endpoint: https://opendatasus.saude.gov.br/

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") || "summary"
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  // Simulando latência de API real
  await new Promise((resolve) => setTimeout(resolve, 100))

  switch (type) {
    case "summary":
      return NextResponse.json({
        success: true,
        data: {
          totalCases: 1731680,
          totalDeaths: 14002,
          totalRecoveries: 1631334,
          vaccinationDoses: 79790000,
          lastUpdate: new Date().toISOString(),
          diseases: {
            dengue: { cases: 1542890, deaths: 1023, trend: "up" },
            hiv: { cases: 43560, deaths: 12890, trend: "stable" },
            malaria: { cases: 145230, deaths: 89, trend: "down" },
          },
        },
      })

    case "vaccination":
      return NextResponse.json({
        success: true,
        data: {
          coverage: {
            national: 72.2,
            target: 95,
          },
          byRegion: [
            { region: "São Paulo", coverage: 78, doses: 35420000 },
            { region: "Rio de Janeiro", coverage: 72, doses: 11890000 },
            { region: "Minas Gerais", coverage: 68, doses: 14230000 },
            { region: "Bahia", coverage: 62, doses: 9180000 },
            { region: "Paraná", coverage: 81, doses: 9070000 },
          ],
          vaccines: [
            { name: "COVID-19", doses: 450000000, coverage: 85 },
            { name: "Influenza", doses: 80000000, coverage: 75 },
            { name: "Dengue", doses: 15000000, coverage: 45 },
            { name: "Febre Amarela", doses: 95000000, coverage: 88 },
          ],
        },
      })

    case "timeseries":
      const start = startDate ? new Date(startDate) : new Date("2024-01-01")
      const end = endDate ? new Date(endDate) : new Date()
      const data = []
      const currentDate = new Date(start)

      while (currentDate <= end) {
        const month = currentDate.getMonth()
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

      return NextResponse.json({
        success: true,
        data,
        period: { start: start.toISOString(), end: end.toISOString() },
      })

    case "regions":
      return NextResponse.json({
        success: true,
        data: [
          { id: "centro", name: "Centro", lat: -23.5505, lng: -46.6333, riskLevel: "high", cases: 45230, coverage: 65 },
          { id: "zona-norte", name: "Zona Norte", lat: -23.4795, lng: -46.6333, riskLevel: "medium", cases: 28900, coverage: 72 },
          { id: "zona-sul", name: "Zona Sul", lat: -23.6505, lng: -46.6433, riskLevel: "low", cases: 12340, coverage: 85 },
          { id: "zona-leste", name: "Zona Leste", lat: -23.5405, lng: -46.4733, riskLevel: "critical", cases: 67800, coverage: 58 },
          { id: "zona-oeste", name: "Zona Oeste", lat: -23.5305, lng: -46.7533, riskLevel: "medium", cases: 23450, coverage: 75 },
        ],
      })

    default:
      return NextResponse.json(
        { success: false, error: "Invalid type parameter" },
        { status: 400 }
      )
  }
}

// Metadata para documentação da API
export const metadata = {
  description: "API de dados de saúde pública do Brasil",
  endpoints: {
    summary: "Resumo geral de casos e vacinação",
    vaccination: "Dados detalhados de vacinação",
    timeseries: "Séries temporais de casos (use startDate e endDate)",
    regions: "Dados por região com níveis de risco",
  },
  source: "Dados simulados baseados em padrões do OpenDataSUS",
}
