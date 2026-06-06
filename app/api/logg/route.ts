import { NextRequest } from "next/server"
import sql from "@/lib/db"

export async function GET() {
  const entries = await sql`
    SELECT
      l.id,
      l.content,
      l.created_at,
      l.zone_id,
      l.plant_id,
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
  `
  return Response.json(entries)
}

export async function POST(req: NextRequest) {
  const { content, zone_id, plant_id } = await req.json()
  if (!content?.trim()) {
    return Response.json({ error: "Innhold mangler" }, { status: 400 })
  }
  const [entry] = await sql`
    INSERT INTO log_entries (content, zone_id, plant_id)
    VALUES (${content}, ${zone_id ?? null}, ${plant_id ?? null})
    RETURNING *
  `
  return Response.json(entry, { status: 201 })
}
