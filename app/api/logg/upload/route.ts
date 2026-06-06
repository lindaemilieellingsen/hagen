import { put } from "@vercel/blob"
import { NextRequest } from "next/server"
import sql from "@/lib/db"

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const file = formData.get("file") as File
  const entryId = formData.get("entryId") as string

  if (!file) {
    return Response.json({ error: "Ingen fil" }, { status: 400 })
  }

  const blob = await put(`hagen/logg/${Date.now()}-${file.name}`, file, {
    access: "public",
  })

  if (entryId) {
    await sql`
      INSERT INTO log_photos (entry_id, url)
      VALUES (${parseInt(entryId)}, ${blob.url})
    `
  }

  return Response.json({ url: blob.url })
}
