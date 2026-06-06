"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function LoggForm() {
  const [content, setContent] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? [])
    setFiles(selected)
    setPreviews(selected.map((f) => URL.createObjectURL(f)))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)

    const res = await fetch("/api/logg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })
    const entry = await res.json()

    for (const file of files) {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("entryId", String(entry.id))
      await fetch("/api/logg/upload", { method: "POST", body: fd })
    }

    setContent("")
    setFiles([])
    setPreviews([])
    if (fileRef.current) fileRef.current.value = ""
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

      {previews.length > 0 && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {previews.map((src, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-stone-200">
              <Image src={src} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 mt-3">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="text-sm text-stone-500 hover:text-stone-700 flex items-center gap-1.5 transition-colors"
        >
          <span>📎</span> Legg ved bilder
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="hidden"
        />
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="ml-auto rounded-xl bg-stone-800 px-5 py-2 text-sm text-white font-medium hover:bg-stone-700 disabled:opacity-40 transition-colors"
        >
          {loading ? "Lagrer..." : "Lagre"}
        </button>
      </div>
    </form>
  )
}
