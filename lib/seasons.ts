export type Season = "var" | "sommer" | "host" | "vinter"

export const SEASONS: Record<Season, { label: string; months: number[]; color: string }> = {
  var: { label: "Vår", months: [3, 4, 5], color: "bg-green-100 text-green-800 border-green-200" },
  sommer: { label: "Sommer", months: [6, 7, 8], color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  host: { label: "Høst", months: [9, 10, 11], color: "bg-orange-100 text-orange-800 border-orange-200" },
  vinter: { label: "Vinter", months: [12, 1, 2], color: "bg-blue-100 text-blue-800 border-blue-200" },
}

export function getSeason(date: Date): Season {
  const month = date.getMonth() + 1
  if ([3, 4, 5].includes(month)) return "var"
  if ([6, 7, 8].includes(month)) return "sommer"
  if ([9, 10, 11].includes(month)) return "host"
  return "vinter"
}

export function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" })
}
