"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoggForm() {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    await fetch("/api/logg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })
    setContent("")
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="mb-10">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Hva skjer i hagen i dag? Skriv observasjoner, notater eller spørsmål..."
        rows={4}
        className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none text-sm"
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="rounded-xl bg-stone-800 px-5 py-2 text-sm text-white font-medium hover:bg-stone-700 disabled:opacity-40 transition-colors"
        >
          {loading ? "Lagrer..." : "Lagre"}
        </button>
      </div>
    </form>
  )
}
