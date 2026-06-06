import Image from "next/image"
import sql from "@/lib/db"
import { getSeason, SEASONS, formatDate } from "@/lib/seasons"
import LoggForm from "./LoggForm"

interface LogEntry {
  id: number
  content: string
  created_at: string
  zone_name?: string
  plant_name?: string
  photos: string[]
}

export const dynamic = "force-dynamic"

export default async function LoggPage() {
  const entries = (await sql`
    SELECT
      l.id,
      l.content,
      l.created_at,
      z.name AS zone_name,
      p.name AS plant_name,
      COALESCE(
        json_agg(lp.url ORDER BY lp.created_at) FILTER (WHERE lp.url IS NOT NULL),
        '[]'
      ) AS photos
    FROM log_entries l
    LEFT JOIN zones z ON z.id = l.zone_id
    LEFT JOIN plants p ON p.id = l.plant_id
    LEFT JOIN log_photos lp ON lp.entry_id = l.id
    GROUP BY l.id, z.name, p.name
    ORDER BY l.created_at DESC
  `) as LogEntry[]

  const grouped: Record<string, LogEntry[]> = {}
  for (const entry of entries) {
    const date = new Date(entry.created_at)
    const season = getSeason(date)
    const year = date.getFullYear()
    const key = `${SEASONS[season].label} ${year}`
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(entry)
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold text-stone-800 mb-2">Hagelogg</h1>
      <p className="text-stone-500 mb-8 text-sm">
        Skriv observasjoner fra hagen. Oppføringene sorteres etter sesong.
      </p>

      <LoggForm />

      {Object.keys(grouped).length === 0 && (
        <p className="text-stone-400 text-sm text-center py-10">
          Ingen oppføringer ennå. Skriv din første observasjon ovenfor.
        </p>
      )}

      {Object.entries(grouped).map(([label, items]) => {
        const season = Object.values(SEASONS).find((s) => label.startsWith(s.label))
        return (
          <div key={label} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-xs font-medium px-3 py-1 rounded-full border ${season?.color}`}>
                {label}
              </span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>
            <div className="flex flex-col gap-4">
              {items.map((entry) => (
                <div key={entry.id} className="rounded-xl border border-stone-200 bg-white p-5">
                  <p className="text-stone-800 text-sm whitespace-pre-wrap leading-relaxed">
                    {entry.content}
                  </p>

                  {entry.photos.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {entry.photos.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-stone-200 hover:opacity-90 transition-opacity">
                            <Image src={url} alt="" fill className="object-cover" />
                          </div>
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-3">
                    {entry.zone_name && (
                      <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                        {entry.zone_name}
                      </span>
                    )}
                    {entry.plant_name && (
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                        {entry.plant_name}
                      </span>
                    )}
                    <span className="text-xs text-stone-400 ml-auto">
                      {formatDate(entry.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </main>
  )
}
