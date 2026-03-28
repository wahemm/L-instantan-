'use client'

import { useEffect, useState } from 'react'

export default function ResultPage() {
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem('linstantane:lastResult')
      if (raw) {
        const parsed = JSON.parse(raw)
        const imgs = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed.images)
            ? parsed.images
            : []
        setImages(imgs.filter((b: unknown) => typeof b === 'string' && b.length > 0))
      }
    } catch {
      // nothing
    }
  }, [])

  function download(b64: string, idx: number) {
    const a = document.createElement('a')
    a.href = `data:image/png;base64,${b64}`
    a.download = `linstantane-${idx + 1}.png`
    a.click()
  }

  return (
    <main className="min-h-screen bg-[#FFF9EC] px-4 py-12">
      <div className="mx-auto flex max-w-2xl flex-col gap-10">
        {images.length === 0 ? (
          <p className="text-sm font-semibold text-slate-700">
            Rien à afficher. Va sur{' '}
            <a href="/create" className="underline">
              /create
            </a>{' '}
            pour générer ta BD.
          </p>
        ) : (
          images.map((b64, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <img
                src={`data:image/png;base64,${b64}`}
                alt=""
                className="w-full rounded-2xl border-[3px] border-black shadow-[6px_6px_0_0_#000]"
                style={{ imageOrientation: 'from-image' }}
              />
              <button
                onClick={() => download(b64, idx)}
                className="rounded-full border-[3px] border-black bg-[#FFE55C] px-6 py-2.5 text-sm font-extrabold shadow-[4px_4px_0_0_#000] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#000] transition-transform"
              >
                Télécharger l'image {idx + 1}
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  )
}
