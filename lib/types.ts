export type SunCondition = 'full_sun' | 'partial_shade' | 'shade'
export type WaterNeed = 'low' | 'medium' | 'high'
export type PlantStatus = 'existing' | 'planned' | 'removed'

export interface Zone {
  id: number
  name: string
  description?: string
  sun_condition?: SunCondition
  direction?: string
  map_data?: {
    points?: number[][]
    x?: number
    y?: number
    width?: number
    height?: number
  }
  current_plan?: string
  future_plan?: string
  color?: string
  created_at: string
}

export interface Plant {
  id: number
  name: string
  latin_name?: string
  zone_id?: number
  bloom_month_start?: number
  bloom_month_end?: number
  bloom_color?: string
  height_cm?: number
  sun_requirement?: SunCondition
  water_need?: WaterNeed
  pruning_month?: number
  fertilizing_month?: number
  care_notes?: string
  status: PlantStatus
  created_at: string
}

export interface Photo {
  id: number
  zone_id?: number
  plant_id?: number
  url: string
  caption?: string
  taken_at?: string
  created_at: string
}

export interface Task {
  id: number
  title: string
  description?: string
  zone_id?: number
  plant_id?: number
  due_date?: string
  recurring_month?: number
  completed: boolean
  completed_at?: string
  created_at: string
}

export const MONTHS = [
  'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
]

export const SUN_LABELS: Record<SunCondition, string> = {
  full_sun: 'Full sol',
  partial_shade: 'Halvskygge',
  shade: 'Skygge',
}

export const WATER_LABELS: Record<WaterNeed, string> = {
  low: 'Lite vann',
  medium: 'Moderat vann',
  high: 'Mye vann',
}

export const STATUS_LABELS: Record<PlantStatus, string> = {
  existing: 'Eksisterende',
  planned: 'Planlagt',
  removed: 'Fjernet',
}
