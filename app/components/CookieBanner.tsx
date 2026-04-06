'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const COOKIE_CONSENT_KEY = 'cookie-consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      setVisible(true)
    }
  }, [])

  function accept() {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-xl rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-sm px-5 py-4 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 text-sm text-slate-300">
        <p className="flex-1 leading-relaxed">
          Ce site utilise uniquement des cookies essentiels au fonctionnement.{' '}
          <Link
            href="/mentions-legales"
            className="underline underline-offset-2 hover:text-white transition-colors"
          >
            En savoir plus
          </Link>
        </p>
        <button
          onClick={accept}
          className="shrink-0 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          Accepter
        </button>
      </div>
    </div>
  )
}
