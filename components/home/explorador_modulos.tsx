'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { MODULOS_HOME } from './modulos_datos'
import Topografia from './topografia'

// La escena 3D (three.js) se descarga recién cuando la sección se acerca a la pantalla
const EscenaModulos3D = dynamic(() => import('@/components/escena_modulos_3d'), {
  ssr: false,
  loading: () => <CargandoCampo />,
})

const AVANCE_MS = 7000

/**
 * Explorador de módulos: pestañas con los íconos oficiales, beneficio y equipos compatibles,
 * y a la derecha la escena 3D del campo con el equipo que alimenta cada módulo. Las capturas de
 * la plataforma quedan para el hero y la demo guiada (no se repiten aquí).
 * Avanza solo; se pausa al pasar el mouse o con foco, y deja de avanzar al elegir una pestaña.
 */
export default function ExploradorModulos() {
  const [activo, setActivo] = useState(0)
  const [automatico, setAutomatico] = useState(true)
  const [pausado, setPausado] = useState(false)
  const [montarEscena, setMontarEscena] = useState(false)
  const [escenaVisible, setEscenaVisible] = useState(false)
  const reducido = useReducedMotion()
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])
  const escenaRef = useRef<HTMLDivElement>(null)
  const modulo = MODULOS_HOME[activo]
  const avanza = automatico && !pausado && !reducido && escenaVisible

  // Monta la escena al acercarse y la pausa (sin render) cuando sale de la vista
  useEffect(() => {
    const el = escenaRef.current
    if (!el) return
    const cerca = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setMontarEscena(true)
          cerca.disconnect()
        }
      },
      { rootMargin: '600px 0px' },
    )
    const vista = new IntersectionObserver(([e]) => setEscenaVisible(e.isIntersecting), { threshold: 0.15 })
    cerca.observe(el)
    vista.observe(el)
    return () => {
      cerca.disconnect()
      vista.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!avanza) return
    const t = setTimeout(() => setActivo((i) => (i + 1) % MODULOS_HOME.length), AVANCE_MS)
    return () => clearTimeout(t)
  }, [avanza, activo])

  const elegir = useCallback((i: number, foco = false) => {
    setActivo(i)
    setAutomatico(false)
    if (foco) tabsRef.current[i]?.focus()
  }, [])

  const onTeclas = (e: React.KeyboardEvent) => {
    const n = MODULOS_HOME.length
    if (e.key === 'ArrowRight') elegir((activo + 1) % n, true)
    else if (e.key === 'ArrowLeft') elegir((activo - 1 + n) % n, true)
    else if (e.key === 'Home') elegir(0, true)
    else if (e.key === 'End') elegir(n - 1, true)
    else return
    e.preventDefault()
  }

  return (
    <section
      id="modulos"
      className="relative overflow-hidden bg-marca-p50 pb-20 pt-6 lg:pb-28 lg:pt-4"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocusCapture={() => setPausado(true)}
      onBlurCapture={() => setPausado(false)}
    >

      <Topografia className="text-marca-primario/[0.06]" />

      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="max-w-3xl">
          <h2 className="text-balance text-4xl font-normal leading-[1.1] tracking-[-0.01em] text-marca-primario sm:text-5xl">
            Cada decisión de riego, <b className="font-extrabold">con evidencia</b>
          </h2>
          <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-marca-tinta">
            Decides con el clima, compruebas en el suelo y confirmas con la planta. Olive+ ordena todo lo
            que pasa en tu campo por módulo, conectado a los equipos que ya tienes.
          </p>
        </div>

        {/* Pestañas */}
        <div
          role="tablist"
          aria-label="Módulos de Olive+"
          onKeyDown={onTeclas}
          className="-mx-6 mt-12 flex snap-x gap-2 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {MODULOS_HOME.map((m, i) => {
            const sel = i === activo
            return (
              <button
                key={m.id}
                ref={(el) => {
                  tabsRef.current[i] = el
                }}
                role="tab"
                id={`tab-${m.id}`}
                aria-selected={sel}
                aria-controls="panel-modulo"
                tabIndex={sel ? 0 : -1}
                onClick={() => elegir(i)}
                className={cn(
                  'relative flex h-14 shrink-0 snap-start items-center gap-2.5 overflow-hidden rounded-full pl-2 pr-5 text-[15px] font-bold transition-[background-color,box-shadow,color] duration-200',
                  sel
                    ? 'bg-white text-marca-primario shadow-[0_6px_18px_rgba(6,47,92,0.14)]'
                    : 'text-marca-tinta hover:bg-white/70',
                )}
              >
                <Image src={m.icono} alt="" className="h-10 w-10" />
                {m.nombre}
                {sel && avanza && (
                  <span
                    key={`avance-${activo}`}
                    aria-hidden="true"
                    className="avance-pestana absolute inset-x-5 bottom-1.5 h-0.5 origin-left rounded-full bg-marca-ambar"
                    style={{ animationDuration: `${AVANCE_MS}ms` }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Panel */}
        <div
          id="panel-modulo"
          role="tabpanel"
          aria-labelledby={`tab-${modulo.id}`}
          className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:items-center lg:gap-14 xl:gap-20"
        >
          <div key={modulo.id} className="tarjeta-entra">
            <div className="flex items-center gap-3">
              <Image src={modulo.icono} alt="" className="h-12 w-12" />
              <p className="text-lg font-bold text-marca-primario">Módulo {modulo.nombre}</p>
            </div>
            <h3 className="mt-4 text-balance text-[1.9rem] font-extrabold leading-tight text-marca-primario">
              {modulo.beneficio}
            </h3>
            <ul className="mt-5 space-y-3 text-[17px] leading-relaxed text-marca-tinta">
              {modulo.puntos.map((p) => (
                <li key={p} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-marca-verde" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-marca-p100 pt-5">
              <p className="text-sm font-semibold text-marca-suave">Funciona con</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-3">
                {modulo.funcionaCon.map((c) =>
                  c.logo ? (
                    <Image key={c.nombre} src={c.logo} alt={c.nombre} className="h-10 w-auto max-w-[150px] object-contain" />
                  ) : (
                    <span key={c.nombre} className="text-[15px] font-bold text-marca-primario">
                      {c.nombre}
                    </span>
                  ),
                )}
              </div>
              {modulo.notaCompatibles && <p className="mt-2 text-sm text-marca-suave">{modulo.notaCompatibles}</p>}
            </div>
          </div>

          {/* Tu campo en 3D: el equipo que alimenta cada módulo */}
          <figure>
            <div
              ref={escenaRef}
              className="relative aspect-[4/4.2] sm:aspect-[16/13]"
            >
              <OndaDelCampo color={modulo.color} pulso={activo} />
              <div className="absolute inset-0">
                {montarEscena ? (
                  <EscenaModulos3D
                    moduloId={modulo.id}
                    voxels
                    mostrarAviso={false}
                    pausada={!escenaVisible}
                    onSeleccionModulo={(id) => {
                      const i = MODULOS_HOME.findIndex((m) => m.id === id)
                      if (i !== -1) elegir(i)
                    }}
                  />
                ) : (
                  <CargandoCampo />
                )}
              </div>
            </div>
            <figcaption className="mt-3 text-sm text-marca-suave lg:text-right">
              Ilustración de tu campo: cada módulo y el equipo que lo alimenta. Toca un equipo para verlo.
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

function CargandoCampo() {
  return (
    <div className="flex h-full items-center justify-center text-sm font-semibold text-marca-primario/85">
      Cargando tu campo en 3D…
    </div>
  )
}

/**
 * El campo es la gota: una onda grande y concéntrica bajo el bloque 3D, teñida muy suave con el
 * color del módulo activo. Al cambiar de módulo sale un pulso desde el centro.
 */
const ANILLOS = [
  { inset: 0, alfa: '2b' },
  { inset: 8, alfa: '36' },
  { inset: 15, alfa: '42' },
  { inset: 22, alfa: '52' },
]

function OndaDelCampo({ color, pulso }: { color: string; pulso: number }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[54%] aspect-square w-[150%] -translate-x-1/2 -translate-y-1/2 sm:w-[125%]"
    >
      {/* Mancha de tono: el agua bajo el campo */}
      <span
        className="absolute inset-[22%] rounded-full transition-[background-color] duration-700"
        style={{ backgroundColor: `${color}1c` }}
      />
      <span
        className="absolute inset-[33%] rounded-full transition-[background-color] duration-700"
        style={{ backgroundColor: `${color}22` }}
      />
      {/* Anillos fijos: más marcados hacia el centro */}
      {ANILLOS.map(({ inset, alfa }) => (
        <span
          key={inset}
          className="absolute rounded-full border transition-[border-color] duration-700"
          style={{ inset: `${inset}%`, borderColor: `${color}${alfa}` }}
        />
      ))}
      {/* Pulso al cambiar de módulo */}
      <span
        key={pulso}
        className="onda-pulso absolute inset-[33%] rounded-full border-2"
        style={{ borderColor: `${color}66` }}
      />
    </div>
  )
}
