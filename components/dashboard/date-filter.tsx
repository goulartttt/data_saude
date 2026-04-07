"use client"

import { useState } from "react"
import { CalendarIcon, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DateFilterProps {
  dateRange: { start: Date; end: Date }
  onDateRangeChange: (range: { start: Date; end: Date }) => void
}

const presetRanges = [
  { label: "Últimos 6 meses", months: 6 },
  { label: "Último ano", months: 12 },
  { label: "Últimos 2 anos", months: 24 },
  { label: "2024", year: 2024 },
  { label: "2025", year: 2025 },
]

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

const years = [2023, 2024, 2025, 2026]

export function DateFilter({ dateRange, onDateRangeChange }: DateFilterProps) {
  const [isCustomOpen, setIsCustomOpen] = useState(false)
  const [startMonth, setStartMonth] = useState(dateRange.start.getMonth().toString())
  const [startYear, setStartYear] = useState(dateRange.start.getFullYear().toString())
  const [endMonth, setEndMonth] = useState(dateRange.end.getMonth().toString())
  const [endYear, setEndYear] = useState(dateRange.end.getFullYear().toString())

  const formatDateRange = () => {
    const startStr = dateRange.start.toLocaleDateString("pt-BR", {
      month: "short",
      year: "numeric",
    })
    const endStr = dateRange.end.toLocaleDateString("pt-BR", {
      month: "short",
      year: "numeric",
    })
    return `${startStr} - ${endStr}`
  }

  const handlePresetClick = (preset: typeof presetRanges[0]) => {
    let start: Date
    let end = new Date()

    if (preset.months) {
      start = new Date()
      start.setMonth(start.getMonth() - preset.months)
    } else if (preset.year) {
      start = new Date(preset.year, 0, 1)
      end = new Date(preset.year, 11, 31)
    } else {
      start = new Date()
      start.setMonth(start.getMonth() - 12)
    }

    onDateRangeChange({ start, end })
  }

  const handleCustomApply = () => {
    const start = new Date(parseInt(startYear), parseInt(startMonth), 1)
    const end = new Date(parseInt(endYear), parseInt(endMonth) + 1, 0)
    onDateRangeChange({ start, end })
    setIsCustomOpen(false)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{formatDateRange()}</span>
            <span className="sm:hidden">Período</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {presetRanges.map((preset) => (
            <DropdownMenuItem
              key={preset.label}
              onClick={() => handlePresetClick(preset)}
            >
              {preset.label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsCustomOpen(true)}>
            Personalizado...
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isCustomOpen && (
        <Card className="absolute right-4 top-full z-50 mt-2 w-80 shadow-lg">
          <CardContent className="p-4">
            <div className="space-y-4">
              <h4 className="font-medium">Período Personalizado</h4>

              <div className="space-y-3">
                <Label className="text-sm text-muted-foreground">Data Inicial</Label>
                <div className="flex gap-2">
                  <Select value={startMonth} onValueChange={setStartMonth}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Mês" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month, index) => (
                        <SelectItem key={month} value={index.toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={startYear} onValueChange={setStartYear}>
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm text-muted-foreground">Data Final</Label>
                <div className="flex gap-2">
                  <Select value={endMonth} onValueChange={setEndMonth}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Mês" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month, index) => (
                        <SelectItem key={month} value={index.toString()}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={endYear} onValueChange={setEndYear}>
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Ano" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCustomOpen(false)}
                >
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleCustomApply}>
                  Aplicar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
