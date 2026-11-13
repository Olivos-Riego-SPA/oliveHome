'use client'

import { useEffect, useState, type RefObject } from 'react'
import { motion } from 'framer-motion'

type Caja = { x: number; y: number; w: number; h: number }

const MARGEN = 10

/**
 * Posición de `el` relativa a `raiz`, sumando offsets. Usa el layout y no getBoundingClientRect:
 * así no le afectan ni el escalado de MarcoDemo ni las animaciones (entrada de la grilla, hover).
 */
function medir(raiz: HTMLElement, el: HTMLElement): Caja {
  let x = 0
  let y = 0
  let n: HTMLElement | null = el
  while (n && n !== raiz) {
    x += n.offsetLeft
    y += n.offsetTop
    n = n.offsetParent as HTMLElement | null
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight }
}

/**
 * Foco de la guía: oscurece la demo salvo el elemento `[data-guia=objetivo]` y se desliza de un
 * objetivo al siguiente. No captura clics: la demo sigue siendo usable por debajo.
 */
export default function FocoGuia({
  raiz,
  objetivo,
  radio = 32,
}: {
  raiz: RefObject<HTMLElement | null>
  objetivo: string | null
  radio?: number
}) {
  const [caja, setCaja] = useState<Caja | null>(null)

  // useEffect (no useLayoutEffect): el foco es hijo de `raiz`, y en el primer montaje sus efectos de
  // layout corren antes de que React asigne la ref del padre. Un cuadro después ya está todo puesto.
  // Si el objetivo aún no existe (entra con animación, p. ej. tras otra que sale), sigue buscando
  // hasta ~1,5 s.
  useEffect(() => {
    let id = 0
    let intentos = 90
    const buscar = () => {
      const r = raiz.current
      const el = r && objetivo ? r.querySelector<HTMLElement>(`[data-guia="${objetivo}"]`) : null
      if (r && el) return setCaja(medir(r, el))
      if (!objetivo || --intentos <= 0) return setCaja(null)
      id = requestAnimationFrame(buscar)
    }
    id = requestAnimationFrame(buscar)
    return () => cancelAnimationFrame(id)
  }, [raiz, objetivo])

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute z-40"
      initial={false}
      animate={
        caja
          ? {
              opacity: 1,
              left: caja.x - MARGEN,
              top: caja.y - MARGEN,
              width: caja.w + MARGEN * 2,
              height: caja.h + MARGEN * 2,
              borderRadius: radio,
            }
          : { opacity: 0 }
      }
      transition={{ type: 'spring', stiffness: 140, damping: 24 }}
      style={{ boxShadow: '0 0 0 4000px rgba(3, 28, 42, 0.58)' }}
    >
      <span className="absolute inset-0 rounded-[inherit] ring-[3px] ring-marca-ambar" />
      <span className="foco-pulso absolute inset-0 rounded-[inherit] ring-[3px] ring-marca-ambar" />
    </motion.div>
  )
}
