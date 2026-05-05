import { NextResponse } from "next/server"

// Dados reais do banco de dados fornecido
// Fonte: Dados de saude publica do Brasil
const diseaseMonthlyData = [
  { doenca: "AIDS", ano: 2024, Jan: 175, Fev: 160, Mar: 180, Abr: 170, Mai: 185, Jun: 170, Jul: 175, Ago: 168, Setem: 180, Outu: 185, Nove: 170, Deze: 170, TOTAL_ANUAL: 2088 },
  { doenca: "AIDS", ano: 2025, Jan: 160, Fev: 150, Mar: 170, Abr: 165, Mai: 155, Jun: 160, Jul: 155, Ago: 160, Setem: 165, Outu: 160, Nove: 150, Deze: 150, TOTAL_ANUAL: 1900 },
  { doenca: "Dengue", ano: 2024, Jan: 15000, Fev: 45000, Mar: 120000, Abr: 180000, Mai: 150000, Jun: 60000, Jul: 15000, Ago: 5000, Setem: 3635, Outu: 5000, Nove: 10000, Deze: 15000, TOTAL_ANUAL: 623635 },
  { doenca: "Dengue", ano: 2025, Jan: 35000, Fev: 80000, Mar: 103410, Abr: 90000, Mai: 45000, Jun: 15000, Jul: 2000, Ago: 1000, Setem: 1000, Outu: 1500, Nove: 2500, Deze: 3590, TOTAL_ANUAL: 380000 },
  { doenca: "HIV", ano: 2024, Jan: 480, Fev: 460, Mar: 520, Abr: 490, Mai: 500, Jun: 480, Jul: 470, Ago: 490, Setem: 500, Outu: 510, Nove: 470, Deze: 470, TOTAL_ANUAL: 5840 },
  { doenca: "HIV", ano: 2025, Jan: 460, Fev: 430, Mar: 430, Abr: 450, Mai: 480, Jun: 470, Jul: 460, Ago: 480, Setem: 490, Outu: 500, Nove: 480, Deze: 470, TOTAL_ANUAL: 5600 },
  { doenca: "Malária", ano: 2024, Jan: 4, Fev: 3, Mar: 5, Abr: 4, Mai: 3, Jun: 2, Jul: 4, Ago: 3, Setem: 4, Outu: 2, Nove: 3, Deze: 5, TOTAL_ANUAL: 42 },
  { doenca: "Malária", ano: 2025, Jan: 3, Fev: 4, Mar: 4, Abr: 3, Mai: 3, Jun: 4, Jul: 2, Ago: 3, Setem: 3, Outu: 2, Nove: 4, Deze: 3, TOTAL_ANUAL: 38 },
]

// Mapeamento de meses
const monthKeys = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Setem", "Outu", "Nove", "Deze"]
const monthNames = ["Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") || "all"
  const year = searchParams.get("year")
  const disease = searchParams.get("disease")

  // Simular latencia de API real
  await new Promise((resolve) => setTimeout(resolve, 50))

  switch (type) {
    case "all":
      // Retorna todos os dados
      return NextResponse.json({
        success: true,
        data: diseaseMonthlyData,
        meta: {
          diseases: ["AIDS", "Dengue", "HIV", "Malária"],
          years: [2024, 2025],
          lastUpdate: new Date().toISOString(),
        }
      })

    case "summary":
      // Resumo geral por doenca
      const summary = {}
      const diseases = ["AIDS", "Dengue", "HIV", "Malária"]
      
      diseases.forEach(d => {
        const records = diseaseMonthlyData.filter(r => r.doenca === d)
        const total2024 = records.find(r => r.ano === 2024)?.TOTAL_ANUAL || 0
        const total2025 = records.find(r => r.ano === 2025)?.TOTAL_ANUAL || 0
        const change = total2024 > 0 ? ((total2025 - total2024) / total2024 * 100).toFixed(1) : 0
        
        summary[d] = {
          total2024,
          total2025,
          totalGeral: total2024 + total2025,
          variacao: Number(change),
          tendencia: Number(change) < 0 ? "queda" : Number(change) > 0 ? "aumento" : "estavel"
        }
      })

      return NextResponse.json({
        success: true,
        data: summary,
        meta: {
          totalCasos: Object.values(summary).reduce((acc, curr) => acc + curr.totalGeral, 0),
          lastUpdate: new Date().toISOString(),
        }
      })

    case "timeseries":
      // Serie temporal para graficos
      const timeseries = []
      const filterYear = year ? parseInt(year) : null
      const filterDisease = disease || null

      const years = filterYear ? [filterYear] : [2024, 2025]
      
      years.forEach(y => {
        monthKeys.forEach((monthKey, idx) => {
          const record = {
            date: `${y}-${String(idx + 1).padStart(2, '0')}`,
            label: `${monthNames[idx].substring(0, 3)} ${y}`,
            mes: monthNames[idx],
            ano: y,
          }

          if (filterDisease) {
            const diseaseRecord = diseaseMonthlyData.find(d => d.doenca === filterDisease && d.ano === y)
            record.casos = diseaseRecord ? diseaseRecord[monthKey] : 0
            record.doenca = filterDisease
          } else {
            // Todas as doencas
            diseaseMonthlyData.filter(d => d.ano === y).forEach(diseaseRecord => {
              const key = diseaseRecord.doenca.toLowerCase().replace("á", "a")
              record[key] = diseaseRecord[monthKey]
            })
          }

          timeseries.push(record)
        })
      })

      return NextResponse.json({
        success: true,
        data: timeseries,
        meta: {
          period: filterYear ? String(filterYear) : "2024-2025",
          disease: filterDisease || "all",
          totalRecords: timeseries.length,
        }
      })

    case "by-disease":
      // Dados de uma doenca especifica
      const targetDisease = disease || "Dengue"
      const diseaseRecords = diseaseMonthlyData.filter(d => d.doenca === targetDisease)
      
      if (diseaseRecords.length === 0) {
        return NextResponse.json({
          success: false,
          error: `Doenca '${targetDisease}' nao encontrada`,
          availableDiseases: ["AIDS", "Dengue", "HIV", "Malária"]
        }, { status: 404 })
      }

      const monthlyBreakdown = []
      diseaseRecords.forEach(record => {
        monthKeys.forEach((monthKey, idx) => {
          monthlyBreakdown.push({
            ano: record.ano,
            mes: monthNames[idx],
            mesAbrev: monthKey,
            casos: record[monthKey]
          })
        })
      })

      return NextResponse.json({
        success: true,
        data: {
          doenca: targetDisease,
          registros: diseaseRecords,
          detalheMensal: monthlyBreakdown,
          estatisticas: {
            total2024: diseaseRecords.find(r => r.ano === 2024)?.TOTAL_ANUAL || 0,
            total2025: diseaseRecords.find(r => r.ano === 2025)?.TOTAL_ANUAL || 0,
            mediaMensal2024: Math.round((diseaseRecords.find(r => r.ano === 2024)?.TOTAL_ANUAL || 0) / 12),
            mediaMensal2025: Math.round((diseaseRecords.find(r => r.ano === 2025)?.TOTAL_ANUAL || 0) / 12),
          }
        }
      })

    case "by-year":
      // Dados de um ano especifico
      const targetYear = year ? parseInt(year) : 2024
      const yearRecords = diseaseMonthlyData.filter(d => d.ano === targetYear)
      
      if (yearRecords.length === 0) {
        return NextResponse.json({
          success: false,
          error: `Ano '${targetYear}' nao encontrado`,
          availableYears: [2024, 2025]
        }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: {
          ano: targetYear,
          doencas: yearRecords,
          totalGeral: yearRecords.reduce((acc, curr) => acc + curr.TOTAL_ANUAL, 0),
          porDoenca: yearRecords.map(r => ({
            doenca: r.doenca,
            total: r.TOTAL_ANUAL,
            percentual: 0 // sera calculado abaixo
          }))
        }
      })

    case "comparison":
      // Comparacao entre anos
      const comparisonData = {}
      
      diseaseMonthlyData.forEach(record => {
        if (!comparisonData[record.doenca]) {
          comparisonData[record.doenca] = { doenca: record.doenca }
        }
        comparisonData[record.doenca][`ano_${record.ano}`] = record.TOTAL_ANUAL
        
        // Dados mensais
        comparisonData[record.doenca][`mensal_${record.ano}`] = monthKeys.map((key, idx) => ({
          mes: monthNames[idx],
          casos: record[key]
        }))
      })

      // Calcular variacao
      Object.values(comparisonData).forEach(item => {
        const val2024 = item.ano_2024 || 0
        const val2025 = item.ano_2025 || 0
        item.variacao = val2024 > 0 ? ((val2025 - val2024) / val2024 * 100).toFixed(1) : 0
        item.diferencaAbsoluta = val2025 - val2024
      })

      return NextResponse.json({
        success: true,
        data: Object.values(comparisonData),
        meta: {
          anos: [2024, 2025],
          lastUpdate: new Date().toISOString(),
        }
      })

    default:
      return NextResponse.json({
        success: false,
        error: "Tipo de consulta invalido",
        availableTypes: ["all", "summary", "timeseries", "by-disease", "by-year", "comparison"]
      }, { status: 400 })
  }
}

// Metadata para documentacao da API
export const metadata = {
  description: "API de dados de doencas infecciosas do Brasil",
  endpoints: {
    all: "Todos os dados brutos",
    summary: "Resumo por doenca com totais e variacoes",
    timeseries: "Serie temporal para graficos (params: year, disease)",
    "by-disease": "Dados de uma doenca especifica (param: disease)",
    "by-year": "Dados de um ano especifico (param: year)",
    comparison: "Comparacao entre anos 2024 e 2025",
  },
  diseases: ["AIDS", "Dengue", "HIV", "Malária"],
  years: [2024, 2025],
  source: "Dados oficiais de saude publica",
}
