'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { MODULOS_DEMO, type ModuloDemo } from './demo_datos'
import { CabeceraDemo, Ola } from './cabecera_demo'

/**
 * Réplica del home de Olive+ (escritorio) para la demo guiada. Copia la estructura y medidas de
 * olive_next: `layouts/HomeLayout.tsx` (header + ola), `home/components/HomeDesktop.tsx` (grilla
 * 5×2) y `home/components/ModuleCard.tsx` (ícono + medallón PRO).
 *
 * Usa medidas fijas de escritorio (sin `xl:`/`lg:`): se dibuja a 1280 px y `MarcoDemo` la escala.
 */
export default function OliveHomeDemo({
  onAbrirModulo,
  onClickModulo,
}: {
  onAbrirModulo?: (id: string) => void
  /** Si viene, reemplaza la apertura del módulo (la usa la guía para saltar al paso). */
  onClickModulo?: (id: string) => void
}) {
  const [cargando, setCargando] = useState<ModuloDemo | null>(null)

  // "Iniciando…" y después avisa qué módulo abrir (los que aún no existen en la demo vuelven al home)
  useEffect(() => {
    if (!cargando) return
    const t = setTimeout(() => {
      onAbrirModulo?.(cargando.id)
      setCargando(null)
    }, 1600)
    return () => clearTimeout(t)
  }, [cargando, onAbrirModulo])

  return (
    <div className="relative h-full w-full overflow-hidden bg-white font-sans">
      <CabeceraDemo />
      <Ola />

      <main className="relative h-[calc(100%-56px)] w-full p-2">
        {/* Cambiar cliente: en Olive+ va anclado arriba a la derecha sobre la grilla */}
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-4 top-36 z-20 rounded-full bg-[#084d6e] px-4 py-2 text-[15px] text-white"
        >
          Cambiar Cliente
        </button>

        <div className="flex h-full flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {cargando ? (
              <motion.div
                key="cargando"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
                  <Image src={cargando.icono} alt="" width={160} height={160} />
                </motion.div>
                <motion.span
                  className="mt-8 animate-pulse text-2xl text-[#084d6e]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  Iniciando {cargando.nombre}...
                </motion.span>
              </motion.div>
            ) : (
              <motion.div
                key="grilla"
                initial="oculto"
                animate="visible"
                exit={{ opacity: 0 }}
                variants={{ oculto: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
                className="-mt-6 grid grid-cols-5 gap-x-4 gap-y-6"
                data-guia="grilla"
              >
                {MODULOS_DEMO.map((m) => (
                  <motion.div
                    key={m.id}
                    data-guia={m.id}
                    variants={{ oculto: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <TarjetaModulo modulo={m} onClick={() => (onClickModulo ? onClickModulo(m.id) : setCargando(m))} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <p className="absolute bottom-8 text-center text-xl text-[#084d6e]">
            Una plataforma que permite hacer más productivo el uso del agua.
          </p>
        </div>
      </main>
    </div>
  )
}

/** Ícono del módulo (olive_next/app/home/components/ModuleCard.tsx), siempre activo en la demo. */
function TarjetaModulo({ modulo, onClick }: { modulo: ModuloDemo; onClick: () => void }) {
  // Módulo que no se abre en la demo: en blanco y negro, sin hover ni clic
  if (modulo.inactivo) {
    return (
      <div className="flex w-[176px] cursor-default flex-col items-center" aria-disabled="true">
        <Image src={modulo.icono} alt="" width={140} height={140} className="h-[140px] w-[140px] rounded-full opacity-60 shadow-lg grayscale" />
        <span className="mt-4 text-center text-xl text-gray-400">{modulo.nombre}</span>
      </div>
    )
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-[176px] cursor-pointer flex-col items-center transition-transform duration-300 hover:scale-110 focus-visible:outline-none"
    >
      <span className="relative">
        <Image src={modulo.icono} alt="" width={140} height={140} className="h-[140px] w-[140px] rounded-full shadow-lg" />
        {modulo.pro && <MedallonPro />}
      </span>
      <span className="mt-4 text-center text-xl text-[#084d6e]">{modulo.nombre}</span>
    </button>
  )
}

function MedallonPro() {
  return (
    <span className="pointer-events-none absolute left-[85.4%] top-[14.6%] z-30 grid h-[3.4em] w-[3.4em] -translate-x-1/2 -translate-y-1/2 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#ffd24d] via-[#fab500] to-[#b57f00] text-[11px] shadow-[0_0_10px_rgba(250,181,0,0.35),inset_0_-1px_0_rgba(0,0,0,0.18)] ring-1 ring-inset ring-[#ffe38a]/70">
      <span className="relative z-10 pl-[0.18em] font-extrabold leading-none tracking-[0.18em] text-[#032f44]">PRO</span>
      <span aria-hidden="true" className="demo-pro-brillo pointer-events-none absolute inset-y-0 left-0 w-1/2 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
    </span>
  )
}
