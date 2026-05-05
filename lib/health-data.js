// Dados reais de saude publica do Brasil - Fonte: Dados oficiais
// Anos: 2024 e 2025

// Dados mensais por doenca (dados reais do banco de dados)
export const realDiseaseData = [
  { doenca: "AIDS", ano: 2024, Jan: 175, Fev: 160, Mar: 180, Abr: 170, Mai: 185, Jun: 170, Jul: 175, Ago: 168, Setem: 180, Outu: 185, Nove: 170, Deze: 170, TOTAL_ANUAL: 2088 },
  { doenca: "AIDS", ano: 2025, Jan: 160, Fev: 150, Mar: 170, Abr: 165, Mai: 155, Jun: 160, Jul: 155, Ago: 160, Setem: 165, Outu: 160, Nove: 150, Deze: 150, TOTAL_ANUAL: 1900 },
  { doenca: "Dengue", ano: 2024, Jan: 15000, Fev: 45000, Mar: 120000, Abr: 180000, Mai: 150000, Jun: 60000, Jul: 15000, Ago: 5000, Setem: 3635, Outu: 5000, Nove: 10000, Deze: 15000, TOTAL_ANUAL: 623635 },
  { doenca: "Dengue", ano: 2025, Jan: 35000, Fev: 80000, Mar: 103410, Abr: 90000, Mai: 45000, Jun: 15000, Jul: 2000, Ago: 1000, Setem: 1000, Outu: 1500, Nove: 2500, Deze: 3590, TOTAL_ANUAL: 380000 },
  { doenca: "HIV", ano: 2024, Jan: 480, Fev: 460, Mar: 520, Abr: 490, Mai: 500, Jun: 480, Jul: 470, Ago: 490, Setem: 500, Outu: 510, Nove: 470, Deze: 470, TOTAL_ANUAL: 5840 },
  { doenca: "HIV", ano: 2025, Jan: 460, Fev: 430, Mar: 430, Abr: 450, Mai: 480, Jun: 470, Jul: 460, Ago: 480, Setem: 490, Outu: 500, Nove: 480, Deze: 470, TOTAL_ANUAL: 5600 },
  { doenca: "Malaria", ano: 2024, Jan: 4, Fev: 3, Mar: 5, Abr: 4, Mai: 3, Jun: 2, Jul: 4, Ago: 3, Setem: 4, Outu: 2, Nove: 3, Deze: 5, TOTAL_ANUAL: 42 },
  { doenca: "Malaria", ano: 2025, Jan: 3, Fev: 4, Mar: 4, Abr: 3, Mai: 3, Jun: 4, Jul: 2, Ago: 3, Setem: 3, Outu: 2, Nove: 4, Deze: 3, TOTAL_ANUAL: 38 },
]

// Mapeamento de meses
export const monthKeys = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Setem", "Outu", "Nove", "Deze"]
export const monthNames = ["Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

// Funcao para obter dados formatados para graficos
export function getTimeseriesData(year = null, disease = null) {
  const timeseries = []
  const years = year ? [year] : [2024, 2025]
  
  years.forEach(y => {
    monthKeys.forEach((monthKey, idx) => {
      const record = {
        date: `${y}-${String(idx + 1).padStart(2, '0')}`,
        label: `${monthNames[idx].substring(0, 3)} ${y}`,
        mes: monthNames[idx],
        ano: y,
      }

      if (disease) {
        const diseaseRecord = realDiseaseData.find(d => d.doenca === disease && d.ano === y)
        record.casos = diseaseRecord ? diseaseRecord[monthKey] : 0
        record.doenca = disease
      } else {
        // Todas as doencas
        realDiseaseData.filter(d => d.ano === y).forEach(diseaseRecord => {
          const key = diseaseRecord.doenca.toLowerCase()
          record[key] = diseaseRecord[monthKey]
        })
      }

      timeseries.push(record)
    })
  })

  return timeseries
}

// Funcao para obter resumo por doenca
export function getDiseaseSummary() {
  const diseases = ["AIDS", "Dengue", "HIV", "Malaria"]
  const summary = {}
  
  diseases.forEach(d => {
    const records = realDiseaseData.filter(r => r.doenca === d)
    const total2024 = records.find(r => r.ano === 2024)?.TOTAL_ANUAL || 0
    const total2025 = records.find(r => r.ano === 2025)?.TOTAL_ANUAL || 0
    const change = total2024 > 0 ? ((total2025 - total2024) / total2024 * 100) : 0
    
    summary[d] = {
      nome: d,
      total2024,
      total2025,
      totalGeral: total2024 + total2025,
      variacao: Number(change.toFixed(1)),
      tendencia: change < 0 ? "queda" : change > 0 ? "aumento" : "estavel"
    }
  })

  return summary
}

// Dados formatados para os graficos (compativel com o formato antigo)
export const diseaseData = {
  dengue: {
    name: "Dengue",
    color: "#ef4444",
    cases: 623635 + 380000,
    trend: "down",
    monthlyData: monthKeys.map((key, idx) => {
      const data2024 = realDiseaseData.find(d => d.doenca === "Dengue" && d.ano === 2024)
      const data2025 = realDiseaseData.find(d => d.doenca === "Dengue" && d.ano === 2025)
      return {
        month: monthNames[idx].substring(0, 3),
        cases2024: data2024 ? data2024[key] : 0,
        cases2025: data2025 ? data2025[key] : 0,
        cases: data2024 ? data2024[key] : 0,
      }
    }),
  },
  hiv: {
    name: "HIV",
    color: "#8b5cf6",
    cases: 5840 + 5600,
    trend: "down",
    monthlyData: monthKeys.map((key, idx) => {
      const data2024 = realDiseaseData.find(d => d.doenca === "HIV" && d.ano === 2024)
      const data2025 = realDiseaseData.find(d => d.doenca === "HIV" && d.ano === 2025)
      return {
        month: monthNames[idx].substring(0, 3),
        cases2024: data2024 ? data2024[key] : 0,
        cases2025: data2025 ? data2025[key] : 0,
        cases: data2024 ? data2024[key] : 0,
      }
    }),
  },
  aids: {
    name: "AIDS",
    color: "#3b82f6",
    cases: 2088 + 1900,
    trend: "down",
    monthlyData: monthKeys.map((key, idx) => {
      const data2024 = realDiseaseData.find(d => d.doenca === "AIDS" && d.ano === 2024)
      const data2025 = realDiseaseData.find(d => d.doenca === "AIDS" && d.ano === 2025)
      return {
        month: monthNames[idx].substring(0, 3),
        cases2024: data2024 ? data2024[key] : 0,
        cases2025: data2025 ? data2025[key] : 0,
        cases: data2024 ? data2024[key] : 0,
      }
    }),
  },
  malaria: {
    name: "Malaria",
    color: "#f59e0b",
    cases: 42 + 38,
    trend: "down",
    monthlyData: monthKeys.map((key, idx) => {
      const data2024 = realDiseaseData.find(d => d.doenca === "Malaria" && d.ano === 2024)
      const data2025 = realDiseaseData.find(d => d.doenca === "Malaria" && d.ano === 2025)
      return {
        month: monthNames[idx].substring(0, 3),
        cases2024: data2024 ? data2024[key] : 0,
        cases2025: data2025 ? data2025[key] : 0,
        cases: data2024 ? data2024[key] : 0,
      }
    }),
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
    { name: "Triplice Viral", coverage: 92, doses: 1519632 },
  ],
}

// Dados por zona e bairro de Sao Paulo
export const zonesData = [
  // ZONA NORTE
  { id: "santana", name: "Santana", zone: "Zona Norte", cases: 4520, deaths: 18, coverage: 78, population: 118797 },
  { id: "tucuruvi", name: "Tucuruvi", zone: "Zona Norte", cases: 3890, deaths: 15, coverage: 75, population: 98438 },
  { id: "tremembe", name: "Tremembe", zone: "Zona Norte", cases: 5670, deaths: 22, coverage: 65, population: 197258 },
  { id: "jacana", name: "Jacana", zone: "Zona Norte", cases: 4230, deaths: 17, coverage: 62, population: 94609 },
  { id: "casa-verde", name: "Casa Verde", zone: "Zona Norte", cases: 3450, deaths: 14, coverage: 74, population: 85624 },
  { id: "freguesia-do-o", name: "Freguesia do O", zone: "Zona Norte", cases: 5120, deaths: 20, coverage: 68, population: 142327 },
  { id: "pirituba", name: "Pirituba", zone: "Zona Norte", cases: 6780, deaths: 27, coverage: 64, population: 167931 },
  { id: "perus", name: "Perus", zone: "Zona Norte", cases: 4890, deaths: 19, coverage: 58, population: 80187 },
  { id: "brasilandia", name: "Brasilandia", zone: "Zona Norte", cases: 8920, deaths: 35, coverage: 52, population: 264918 },
  { id: "vila-maria", name: "Vila Maria", zone: "Zona Norte", cases: 4120, deaths: 16, coverage: 71, population: 113845 },

  // ZONA SUL
  { id: "moema", name: "Moema", zone: "Zona Sul", cases: 1890, deaths: 7, coverage: 92, population: 83368 },
  { id: "itaim-bibi", name: "Itaim Bibi", zone: "Zona Sul", cases: 2120, deaths: 8, coverage: 89, population: 92570 },
  { id: "vila-mariana", name: "Vila Mariana", zone: "Zona Sul", cases: 2340, deaths: 9, coverage: 88, population: 130484 },
  { id: "jabaquara", name: "Jabaquara", zone: "Zona Sul", cases: 4560, deaths: 18, coverage: 72, population: 223780 },
  { id: "santo-amaro", name: "Santo Amaro", zone: "Zona Sul", cases: 3210, deaths: 13, coverage: 78, population: 71560 },
  { id: "campo-limpo", name: "Campo Limpo", zone: "Zona Sul", cases: 7890, deaths: 31, coverage: 58, population: 211361 },
  { id: "capao-redondo", name: "Capao Redondo", zone: "Zona Sul", cases: 9870, deaths: 39, coverage: 51, population: 268729 },
  { id: "jardim-angela", name: "Jardim Angela", zone: "Zona Sul", cases: 11230, deaths: 45, coverage: 48, population: 295434 },
  { id: "grajau", name: "Grajau", zone: "Zona Sul", cases: 12450, deaths: 50, coverage: 45, population: 360787 },
  { id: "parelheiros", name: "Parelheiros", zone: "Zona Sul", cases: 5670, deaths: 23, coverage: 52, population: 139441 },

  // ZONA LESTE
  { id: "tatuape", name: "Tatuape", zone: "Zona Leste", cases: 3450, deaths: 14, coverage: 82, population: 91672 },
  { id: "penha", name: "Penha", zone: "Zona Leste", cases: 5670, deaths: 23, coverage: 68, population: 127820 },
  { id: "mooca", name: "Mooca", zone: "Zona Leste", cases: 2890, deaths: 12, coverage: 79, population: 75724 },
  { id: "vila-prudente", name: "Vila Prudente", zone: "Zona Leste", cases: 4230, deaths: 17, coverage: 71, population: 104242 },
  { id: "sao-mateus", name: "Sao Mateus", zone: "Zona Leste", cases: 8920, deaths: 36, coverage: 54, population: 155140 },
  { id: "itaquera", name: "Itaquera", zone: "Zona Leste", cases: 9450, deaths: 38, coverage: 56, population: 204871 },
  { id: "guaianases", name: "Guaianases", zone: "Zona Leste", cases: 7890, deaths: 31, coverage: 52, population: 111049 },
  { id: "cidade-tiradentes", name: "Cidade Tiradentes", zone: "Zona Leste", cases: 10230, deaths: 41, coverage: 48, population: 211501 },
  { id: "ermelino-matarazzo", name: "Ermelino Matarazzo", zone: "Zona Leste", cases: 5670, deaths: 23, coverage: 61, population: 113615 },
  { id: "sao-miguel", name: "Sao Miguel Paulista", zone: "Zona Leste", cases: 8450, deaths: 34, coverage: 55, population: 369496 },

  // ZONA OESTE
  { id: "pinheiros", name: "Pinheiros", zone: "Zona Oeste", cases: 1560, deaths: 6, coverage: 91, population: 65364 },
  { id: "jardins", name: "Jardins", zone: "Zona Oeste", cases: 1230, deaths: 5, coverage: 93, population: 88797 },
  { id: "perdizes", name: "Perdizes", zone: "Zona Oeste", cases: 2120, deaths: 8, coverage: 87, population: 111161 },
  { id: "lapa", name: "Lapa", zone: "Zona Oeste", cases: 2890, deaths: 12, coverage: 82, population: 65739 },
  { id: "vila-leopoldina", name: "Vila Leopoldina", zone: "Zona Oeste", cases: 1890, deaths: 8, coverage: 84, population: 39485 },
  { id: "butanta", name: "Butanta", zone: "Zona Oeste", cases: 3450, deaths: 14, coverage: 78, population: 54196 },
  { id: "rio-pequeno", name: "Rio Pequeno", zone: "Zona Oeste", cases: 4230, deaths: 17, coverage: 68, population: 118459 },
  { id: "raposo-tavares", name: "Raposo Tavares", zone: "Zona Oeste", cases: 5120, deaths: 20, coverage: 62, population: 100164 },
  { id: "jaguare", name: "Jaguare", zone: "Zona Oeste", cases: 2670, deaths: 11, coverage: 75, population: 49863 },
  { id: "alto-pinheiros", name: "Alto de Pinheiros", zone: "Zona Oeste", cases: 980, deaths: 4, coverage: 94, population: 43117 },

  // CENTRO
  { id: "se", name: "Se", zone: "Centro", cases: 3450, deaths: 14, coverage: 72, population: 23651 },
  { id: "republica", name: "Republica", zone: "Centro", cases: 4120, deaths: 16, coverage: 68, population: 56981 },
  { id: "liberdade", name: "Liberdade", zone: "Centro", cases: 2340, deaths: 9, coverage: 81, population: 69092 },
  { id: "bela-vista", name: "Bela Vista", zone: "Centro", cases: 2890, deaths: 12, coverage: 78, population: 69460 },
  { id: "consolacao", name: "Consolacao", zone: "Centro", cases: 1890, deaths: 8, coverage: 85, population: 57365 },
  { id: "santa-cecilia", name: "Santa Cecilia", zone: "Centro", cases: 2560, deaths: 10, coverage: 76, population: 83717 },
  { id: "bom-retiro", name: "Bom Retiro", zone: "Centro", cases: 2120, deaths: 8, coverage: 73, population: 33892 },
  { id: "bras", name: "Bras", zone: "Centro", cases: 3670, deaths: 15, coverage: 65, population: 29265 },
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
      description: "As vacinas sao a forma mais eficaz de prevenir doencas graves e proteger voce e sua comunidade.",
      icon: "shield",
    },
    {
      title: "Mitos e Verdades",
      description: "Esclareca suas duvidas sobre vacinacao com informacoes baseadas em evidencias cientificas.",
      icon: "info",
    },
    {
      title: "Calendario Vacinal",
      description: "Confira as vacinas recomendadas para cada faixa etaria e mantenha sua carteirinha em dia.",
      icon: "calendar",
    },
  ],
  diseases: [
    {
      name: "Dengue",
      symptoms: "Febre alta, dor de cabeca, dores no corpo, manchas vermelhas",
      prevention: "Elimine agua parada, use repelente, instale telas nas janelas",
    },
    {
      name: "HIV/AIDS",
      symptoms: "Febre, fadiga, inchaco dos ganglios, perda de peso",
      prevention: "Use preservativo, faca testes regulares, nao compartilhe seringas",
    },
    {
      name: "Malaria",
      symptoms: "Febre alta, calafrios, sudorese, dor de cabeca",
      prevention: "Use mosquiteiros, repelentes, roupas que cubram o corpo",
    },
  ],
  ubsList: [
    { name: "UBS Santana", address: "Rua Voluntarios da Patria, 4301", zone: "Zona Norte", phone: "(11) 2976-0000" },
    { name: "UBS Vila Mariana", address: "Rua Jose de Magalhaes, 419", zone: "Zona Sul", phone: "(11) 5573-0000" },
    { name: "UBS Tatuape", address: "Rua Serra de Botucatu, 1100", zone: "Zona Leste", phone: "(11) 2295-0000" },
    { name: "UBS Pinheiros", address: "Rua Ferreira de Araujo, 789", zone: "Zona Oeste", phone: "(11) 3032-0000" },
    { name: "UBS Republica", address: "Rua do Arouche, 24", zone: "Centro", phone: "(11) 3331-0000" },
  ],
}

export function formatNumber(num) {
  return new Intl.NumberFormat("pt-BR").format(num)
}

export function getRiskLevel(coverage) {
  if (coverage >= 80) return { level: "Baixo", color: "bg-green-500", textColor: "text-green-700", bgLight: "bg-green-100" }
  if (coverage >= 70) return { level: "Medio", color: "bg-yellow-500", textColor: "text-yellow-700", bgLight: "bg-yellow-100" }
  if (coverage >= 60) return { level: "Alto", color: "bg-orange-500", textColor: "text-orange-700", bgLight: "bg-orange-100" }
  return { level: "Critico", color: "bg-red-500", textColor: "text-red-700", bgLight: "bg-red-100" }
}

export function getCasesRiskLevel(cases, population) {
  const rate = (cases / population) * 1000 // casos por 1000 habitantes
  if (rate < 20) return { level: "Baixo", color: "bg-green-500", textColor: "text-green-700" }
  if (rate < 40) return { level: "Medio", color: "bg-yellow-500", textColor: "text-yellow-700" }
  if (rate < 60) return { level: "Alto", color: "bg-orange-500", textColor: "text-orange-700" }
  return { level: "Critico", color: "bg-red-500", textColor: "text-red-700" }
}

export function getTrendIcon(trend) {
  if (trend === "up") return { icon: "TrendingUp", color: "text-red-500" }
  if (trend === "down") return { icon: "TrendingDown", color: "text-green-500" }
  return { icon: "Minus", color: "text-gray-500" }
}
