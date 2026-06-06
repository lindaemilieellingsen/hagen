import Link from "next/link"
import sql from "@/lib/db"
import { getSeason, SEASONS } from "@/lib/seasons"

const MONTH_NAMES = ["Januar", "Februar", "Mars", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Desember"]

export const dynamic = "force-dynamic"

export default async function OppgaverPage() {
  const tasks = (await sql`
    SELECT t.*, p.name AS plant_name, z.name AS zone_name
    FROM tasks t
    LEFT JOIN plants p ON p.id = t.plant_id
    LEFT JOIN zones z ON z.id = t.zone_id
    ORDER BY t.recurring_month NULLS LAST, t.due_date NULLS LAST, t.created_at
  `) as any[]

  const currentMonth = new Date().getMonth() + 1

  const grouped: Record<string, any[]> = {}
  for (const task of tasks) {
    const month = task.recurring_month ?? new Date(task.due_date ?? task.created_at).getMonth() + 1
    const date = new Date(2026, month - 1, 1)
    const season = getSeason(date)
    const key = SEASONS[season].label
    if (!grouped[key]) grouped[key] = []
    grouped[key].push({ ...task, month })
  }

  const seasonOrder = ["Vår", "Sommer", "Høst", "Vinter"]

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-sm text-stone-400 hover:text-stone-600 mb-4 block">← Hjem</Link>
        <h1 className="text-3xl font-semibold text-stone-800 mb-1">Oppgaver</h1>
        <p className="text-stone-500 text-sm">Sesongoppgaver tilpasset Oslo-klima</p>
      </div>

      {seasonOrder.map((seasonLabel) => {
        const items = grouped[seasonLabel]
        if (!items?.length) return null
        const season = Object.values(SEASONS).find((s) => s.label === seasonLabel)!
        return (
          <div key={seasonLabel} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-medium px-3 py-1 rounded-full border ${season.color}`}>
                {seasonLabel}
              </span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>
            <div className="flex flex-col gap-2">
              {items.map((task) => {
                const isCurrent = task.month === currentMonth
                return (
                  <div
                    key={task.id}
                    className={`rounded-xl border p-4 ${
                      isCurrent
                        ? "border-green-300 bg-green-50"
                        : "border-stone-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          isCurrent ? "bg-green-200 text-green-800" : "bg-stone-100 text-stone-500"
                        }`}>
                          {MONTH_NAMES[task.month - 1].slice(0, 3)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-800 text-sm">{task.title}</p>
                        {task.description && (
                          <p className="text-xs text-stone-500 mt-1 leading-relaxed">{task.description}</p>
                        )}
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {task.plant_name && (
                            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                              {task.plant_name}
                            </span>
                          )}
                          {task.zone_name && (
                            <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                              {task.zone_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </main>
  )
}
