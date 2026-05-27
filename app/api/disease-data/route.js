import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Mapeamento de meses
const monthKeys = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "setem", "outu", "nove", "deze"]
const monthNames = ["Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type") || "all"
  const year = searchParams.get("year")
  const disease = searchParams.get("disease")

  const supabase = await createClient()

  try {
    switch (type) {
      case "all": {
        const { data, error } = await supabase
          .from("disease_monthly_data")
          .select("*")
          .order("doenca")
          .order("ano")

        if (error) throw error

        return NextResponse.json({
          success: true,
          data: data,
          meta: {
            diseases: ["AIDS", "Dengue", "HIV", "Malaria"],
            years: [2024, 2025],
            lastUpdate: new Date().toISOString(),
          }
        })
      }

      case "summary": {
        const { data, error } = await supabase
          .from("disease_monthly_data")
          .select("*")
          .order("doenca")
          .order("ano")

        if (error) throw error

        const summary = {}
        const diseases = ["AIDS", "Dengue", "HIV", "Malaria"]
        
        diseases.forEach(d => {
          const records = data.filter(r => r.doenca === d)
          const total2024 = records.find(r => r.ano === 2024)?.total_anual || 0
          const total2025 = records.find(r => r.ano === 2025)?.total_anual || 0
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
      }

      case "timeseries": {
        let query = supabase.from("disease_monthly_data").select("*")
        
        if (year) {
          query = query.eq("ano", parseInt(year))
        }
        if (disease) {
          query = query.eq("doenca", disease)
        }

        const { data, error } = await query.order("doenca").order("ano")

        if (error) throw error

        const timeseries = []
        const years = year ? [parseInt(year)] : [2024, 2025]
        
        years.forEach(y => {
          monthKeys.forEach((monthKey, idx) => {
            const record = {
              date: `${y}-${String(idx + 1).padStart(2, '0')}`,
              label: `${monthNames[idx].substring(0, 3)} ${y}`,
              mes: monthNames[idx],
              ano: y,
            }

            if (disease) {
              const diseaseRecord = data.find(d => d.doenca === disease && d.ano === y)
              record.casos = diseaseRecord ? diseaseRecord[monthKey] : 0
              record.doenca = disease
            } else {
              data.filter(d => d.ano === y).forEach(diseaseRecord => {
                const key = diseaseRecord.doenca.toLowerCase()
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
            period: year ? String(year) : "2024-2025",
            disease: disease || "all",
            totalRecords: timeseries.length,
          }
        })
      }

      case "by-disease": {
        const targetDisease = disease || "Dengue"
        
        const { data, error } = await supabase
          .from("disease_monthly_data")
          .select("*")
          .eq("doenca", targetDisease)
          .order("ano")

        if (error) throw error

        if (data.length === 0) {
          return NextResponse.json({
            success: false,
            error: `Doenca '${targetDisease}' nao encontrada`,
            availableDiseases: ["AIDS", "Dengue", "HIV", "Malaria"]
          }, { status: 404 })
        }

        const monthlyBreakdown = []
        data.forEach(record => {
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
            registros: data,
            detalheMensal: monthlyBreakdown,
            estatisticas: {
              total2024: data.find(r => r.ano === 2024)?.total_anual || 0,
              total2025: data.find(r => r.ano === 2025)?.total_anual || 0,
              mediaMensal2024: Math.round((data.find(r => r.ano === 2024)?.total_anual || 0) / 12),
              mediaMensal2025: Math.round((data.find(r => r.ano === 2025)?.total_anual || 0) / 12),
            }
          }
        })
      }

      case "by-year": {
        const targetYear = year ? parseInt(year) : 2024
        
        const { data, error } = await supabase
          .from("disease_monthly_data")
          .select("*")
          .eq("ano", targetYear)
          .order("doenca")

        if (error) throw error

        if (data.length === 0) {
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
            doencas: data,
            totalGeral: data.reduce((acc, curr) => acc + curr.total_anual, 0),
            porDoenca: data.map(r => ({
              doenca: r.doenca,
              total: r.total_anual,
              percentual: 0
            }))
          }
        })
      }

      case "comparison": {
        const { data, error } = await supabase
          .from("disease_monthly_data")
          .select("*")
          .order("doenca")
          .order("ano")

        if (error) throw error

        const comparisonData = {}
        
        data.forEach(record => {
          if (!comparisonData[record.doenca]) {
            comparisonData[record.doenca] = { doenca: record.doenca }
          }
          comparisonData[record.doenca][`ano_${record.ano}`] = record.total_anual
          
          comparisonData[record.doenca][`mensal_${record.ano}`] = monthKeys.map((key, idx) => ({
            mes: monthNames[idx],
            casos: record[key]
          }))
        })

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
      }

      default:
        return NextResponse.json({
          success: false,
          error: "Tipo de consulta invalido",
          availableTypes: ["all", "summary", "timeseries", "by-disease", "by-year", "comparison"]
        }, { status: 400 })
    }
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({
      success: false,
      error: "Erro ao buscar dados do banco de dados"
    }, { status: 500 })
  }
}
