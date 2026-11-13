'use client'

import { useEffect, useState } from 'react'
import Image, { type StaticImageData } from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Play, X } from 'lucide-react'

export interface VideoDestacado {
  youtubeId: string
  titulo: string
  modulo: string
  icono: StaticImageData
}

/**
 * Los videos destacados del Centro de Extensión. Al tocar uno se abre el mismo reproductor que en
 * /tutoriales (fondo oscuro, video de YouTube; se cierra con la X, Escape o tocando afuera) y, bajo el
 * video, una invitación a ver todos los tutoriales.
 */
export default function VideosDestacados({ videos }: { videos: VideoDestacado[] }) {
  const [abierto, setAbierto] = useState<VideoDestacado | null>(null)

  // Sin scroll de fondo mientras el video está abierto, y Escape para cerrar
  useEffect(() => {
    if (!abierto) return
    document.body.style.overflow = 'hidden'
    const alTeclear = (e: KeyboardEvent) => e.key === 'Escape' && setAbierto(null)
    window.addEventListener('keydown', alTeclear)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', alTeclear)
    }
  }, [abierto])

  return (
    <>
      <ul className="mt-12 grid gap-8 md:grid-cols-3 lg:mt-14">
        {videos.map((v) => (
          <li key={v.youtubeId}>
            <button
              type="button"
              onClick={() => setAbierto(v)}
              aria-label={`Ver el video: ${v.titulo}`}
              className="group block w-full text-left focus-visible:outline-none"
            >
              <span className="relative block aspect-video overflow-hidden rounded-[10px] bg-marca-p50 shadow-[0_8px_24px_rgba(6,47,92,0.14)] ring-offset-2 group-focus-visible:ring-2 group-focus-visible:ring-marca-verde">
                {/* Miniatura de YouTube (dominio externo: img nativa con carga diferida) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
                />
                <span className="absolute inset-0 bg-marca-primario/25 transition-colors group-hover:bg-marca-primario/10" />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-white/95 shadow-[0_8px_20px_rgba(6,47,92,0.25)] transition-transform group-hover:scale-105">
                    <Play className="ml-0.5 h-6 w-6 fill-marca-primario text-marca-primario" aria-hidden="true" />
                  </span>
                </span>
              </span>
              <span className="mt-4 flex items-center gap-2 text-sm font-bold text-marca-suave">
                <Image src={v.icono} alt="" className="h-6 w-6" />
                Módulo {v.modulo}
              </span>
              <span className="mt-1.5 block text-lg font-bold leading-snug text-marca-primario group-hover:underline group-hover:decoration-marca-p300 group-hover:underline-offset-4">
                {v.titulo}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* Reproductor (el mismo de /tutoriales) */}
      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setAbierto(null)}
            role="dialog"
            aria-modal="true"
            aria-label={abierto.titulo}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setAbierto(null)}
                aria-label="Cerrar video"
                className="absolute -top-12 right-0 flex items-center gap-2 text-sm text-white/80 hover:text-white"
              >
                Cerrar <X className="h-5 w-5" />
              </button>
              <div className="aspect-video overflow-hidden rounded-xl bg-black shadow-2xl">
                <iframe
                  src={`https://www.youtube.com/embed/${abierto.youtubeId}?autoplay=1`}
                  title={abierto.titulo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>

              {/* Título y la invitación a ver más tutoriales */}
              <div className="mt-4 flex flex-col gap-4 text-white sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">
                    <Image src={abierto.icono} alt="" className="h-4 w-4" />
                    Módulo {abierto.modulo}
                  </span>
                  <h3 className="text-xl font-semibold">{abierto.titulo}</h3>
                </div>
                <a
                  href="/tutoriales"
                  className="inline-flex h-12 shrink-0 items-center gap-2 self-start rounded-full bg-marca-verde px-6 text-base font-bold text-white shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-colors hover:bg-marca-verdeOscuro sm:self-auto"
                >
                  Ver más tutoriales
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
