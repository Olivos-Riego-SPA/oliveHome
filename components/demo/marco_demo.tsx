'use client'

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { Lock } from 'lucide-react'

/**
 * Ventana de navegador que muestra la demo "con zoom alejado": el contenido se dibuja siempre a
 * su tamaño real de escritorio (`ancho` × `alto`) y se escala como un todo para caber en el
 * espacio disponible. No se reacomoda como un diseño responsivo — se ve igual que Olive+, solo
 * que más chico.
 *
 * Ojo: dentro del contenido las clases `sm:`/`lg:`/`xl:` responden al ancho real de la pantalla,
 * no al del lienzo, así que el contenido de la demo debe usar medidas fijas de escritorio.
 */
export default function MarcoDemo({
  children,
  ancho = 1280,
  alto = 760,
  url = 'oliveplus.cl/home',
}: {
  children: ReactNode
  ancho?: number
  alto?: number
  url?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [escala, setEscala] = useState(0)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const medir = () => setEscala(Math.min(1, el.clientWidth / ancho))
    medir()
    const ro = new ResizeObserver(medir)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ancho])

  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(6,47,72,0.18)] ring-1 ring-black/[0.06]">
      {/* Barra del navegador: fuera del escalado para que se lea nítida */}
      <div className="flex h-9 items-center gap-3 border-b border-black/[0.06] bg-[#F3F5F7] px-3.5">
        <div aria-hidden="true" className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
        </div>
        <div className="mx-auto flex h-6 w-full max-w-[320px] items-center justify-center gap-1.5 rounded-md bg-white px-3 text-[12px] text-slate-500 ring-1 ring-black/[0.05]">
          <Lock className="h-3 w-3" aria-hidden="true" />
          <span className="truncate">{url}</span>
        </div>
        <div className="w-[42px]" aria-hidden="true" />
      </div>

      <div ref={ref} className="relative w-full overflow-hidden" style={{ height: alto * escala }}>
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: ancho,
            height: alto,
            transform: `scale(${escala})`,
            visibility: escala ? 'visible' : 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
