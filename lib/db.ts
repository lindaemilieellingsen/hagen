import { neon } from "@neondatabase/serverless"

const client = neon(process.env.DATABASE_URL!)

// Neon free tier setter compute i dvale etter 5 min inaktivitet.
// Første forespørsel etter dvale feiler av og til. Retry etter 2 sek.
export default async function sql(
  strings: TemplateStringsArray,
  ...params: unknown[]
) {
  try {
    return await client(strings, ...params)
  } catch (e: any) {
    if (e?.message?.includes("Error connecting")) {
      await new Promise((r) => setTimeout(r, 2000))
      return await client(strings, ...params)
    }
    throw e
  }
}
