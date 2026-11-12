'use client'

import { useEffect, useRef, useState } from 'react'
import Image, { type StaticImageData } from 'next/image'
import { cn } from '@/lib/utils'
import Ondas from './ondas'
import { ICONOS_MODULO } from './modulos_datos'

interface Estrategia {
  id: string
  nombre: string
  /** Ahorro de agua estimado frente a calicatas (agrónomos de Olivos; se publica sin letra chica) */
  ahorro: number
  descripcion: string
  modulos: { nombre: string; icono: StaticImageData }[]
}

const RIEGO = { nombre: 'Riego', icono: ICONOS_MODULO.riego }
const CLIMA = { nombre: 'Clima', icono: ICONOS_MODULO.clima }
const SUELO = { nombre: 'Suelo', icono: ICONOS_MODULO.suelo }
const PLANTA = { nombre: 'Planta', icono: ICONOS_MODULO.planta }

// Ruta de la productividad: cada estrategia más precisa suma un módulo y ahorra más agua.
const ESTRATEGIAS: Estrategia[] = [
  {
    id: 'calicata',
    nombre: 'Calicata',
    ahorro: 0,
    descripcion:
      'Abres un hoyo, miras y tocas la humedad del suelo, y decides cuánto regar. Es simple, pero tiende a regar de más.',
    modulos: [RIEGO],
  },
  {
    id: 'demanda',
    nombre: 'Demanda (ETc)',
    ahorro: 21,
    descripcion:
      'Riegas lo que tu cultivo consume: la ETc te dice cuánta agua pide cada día según el clima y la etapa del cultivo.',
    modulos: [RIEGO, CLIMA],
  },
  {
    id: 'balance',
    nombre: 'Balance hídrico',
    ahorro: 36,
    descripcion:
      'Repones solo el agua que se fue: cruzas lo que riegas y lo que llueve con lo que consume el cultivo, y lo compruebas en el suelo.',
    modulos: [RIEGO, CLIMA, SUELO],
  },
  {
    id: 'umbral',
    nombre: 'Umbral fisiológico',
    ahorro: 43,
    descripcion:
      'Riegas cuando la planta lo pide: el potencial hídrico te avisa cuándo empieza el estrés, antes de que se note en el campo.',
    modulos: [RIEGO, CLIMA, SUELO, PLANTA],
  },
  {
    id: 'rdc',
    nombre: 'Riego deficitario controlado',
    ahorro: 57,
    descripcion:
      'Riegas por debajo de la demanda completa en las etapas en que el cultivo lo tolera, para ahorrar agua cuidando el rendimiento.',
    modulos: [RIEGO, CLIMA, SUELO, PLANTA],
  },
]

/**
 * Ruta del riego: las 5 estrategias como columnas de agua. El agua de cada columna es la que se
 * usa (100 % en calicatas); al entrar en pantalla baja hasta su nivel. Elegir una muestra qué es
 * y qué módulos de Olive+ necesita.
 */
export default function RutaRiego() {
  const [activa, setActiva] = useState(2)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const elegir = (i: number, foco = false) => {
    setActiva(i)
    if (foco) tabsRef.current[i]?.focus()
  }
  const onTeclas = (e: React.KeyboardEvent) => {
    const n = ESTRATEGIAS.length
    if (e.key === 'ArrowRight') elegir((activa + 1) % n, true)
    else if (e.key === 'ArrowLeft') elegir((activa - 1 + n) % n, true)
    else return
    e.preventDefault()
  }

  const e = ESTRATEGIAS[activa]

  return (
    <section id="ruta-riego" className="relative overflow-hidden bg-white py-20 lg:py-28">
      <Ondas tono="claro" className="-left-72 -top-72 h-[760px] w-[760px]" />

      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:items-end lg:gap-16">
          <h2 className="text-balance text-4xl font-normal leading-[1.1] tracking-[-0.01em] text-marca-primario sm:text-5xl">
            Riega con más precisión, <b className="font-extrabold">usa menos agua</b>
          </h2>
          <p className="text-lg leading-relaxed text-marca-tinta">
            Cada estrategia de riego necesita un poco más de información de tu campo, y a cambio ahorra más agua.
            Olive+ te acompaña en todas: empieza donde estás hoy y avanza un paso a la vez.
          </p>
        </div>

        {/* Las columnas de agua */}
        <div
          ref={ref}
          role="tablist"
          aria-label="Estrategias de riego"
          onKeyDown={onTeclas}
          className="mt-14 grid grid-cols-5 gap-2 sm:gap-4 lg:mt-16 lg:gap-6"
        >
          {ESTRATEGIAS.map((x, i) => {
            const sel = i === activa
            const agua = 100 - x.ahorro
            return (
              <button
                key={x.id}
                ref={(el) => {
                  tabsRef.current[i] = el
                }}
                role="tab"
                id={`tab-ruta-${x.id}`}
                aria-selected={sel}
                aria-controls="panel-ruta"
                aria-label={`${x.nombre}: ${x.ahorro === 0 ? 'punto de partida' : `${x.ahorro} % menos agua`}`}
                tabIndex={sel ? 0 : -1}
                onClick={() => elegir(i)}
                className="group flex flex-col items-center text-center"
              >
                <span
                  className={cn(
                    'text-xl font-extrabold transition-colors duration-200 sm:text-3xl lg:text-[2.6rem]',
                    sel ? 'text-marca-primario' : 'text-marca-p300 group-hover:text-marca-primario/70',
                  )}
                >
                  {x.ahorro === 0 ? '0 %' : `−${x.ahorro} %`}
                </span>
                <span className="mt-1 hidden text-xs font-semibold text-marca-suave sm:block">
                  {x.ahorro === 0 ? 'Punto de partida' : 'de agua'}
                </span>

                {/* Tubo: el agua es la que se usa */}
                <span
                  className={cn(
                    'relative mt-4 block h-44 w-full max-w-[120px] overflow-hidden rounded-[999px] border-2 bg-marca-p50 transition-[border-color,box-shadow] duration-300 sm:h-56 lg:h-64',
                    sel ? 'border-marca-primario shadow-[0_10px_30px_rgba(6,47,92,0.18)]' : 'border-marca-p100',
                  )}
                >
                  <span
                    className={cn(
                      'absolute inset-x-0 bottom-0 block transition-[height,background-color] duration-[1400ms] ease-[cubic-bezier(.2,.7,.2,1)] motion-reduce:transition-none',
                      sel ? 'bg-marca-primario' : 'bg-marca-p300 group-hover:bg-marca-primario/80',
                    )}
                    style={{ height: visible ? `${agua}%` : '100%', transitionDelay: `${i * 120}ms` }}
                  >
                    {/* Superficie del agua */}
                    <span className={cn('absolute inset-x-0 top-0 block h-1.5', sel ? 'bg-marca-p300' : 'bg-marca-p100')} />
                  </span>
                  <span
                    className={cn(
                      'absolute inset-x-0 bottom-3 text-[11px] font-bold text-white/85 transition-opacity sm:text-xs',
                      sel ? 'opacity-100' : 'opacity-0',
                    )}
                  >
                    {agua} %
                  </span>
                </span>

                <span
                  className={cn(
                    'mt-4 min-h-[2.5em] text-xs font-bold leading-tight sm:text-sm lg:text-base',
                    sel ? 'text-marca-primario' : 'text-marca-tinta',
                  )}
                >
                  {x.nombre}
                </span>
                <span className="mt-2 flex flex-wrap justify-center gap-0.5 sm:gap-1">
                  {x.modulos.map((m) => (
                    <Image key={m.nombre} src={m.icono} alt="" className="h-4 w-4 sm:h-6 sm:w-6" />
                  ))}
                </span>
              </button>
            )
          })}
        </div>
        <p className="mt-3 flex justify-between text-xs font-semibold text-marca-suave sm:text-sm">
          <span>Más agua</span>
          <span>Menos agua</span>
        </p>

        {/* Detalle de la estrategia */}
        <div
          id="panel-ruta"
          role="tabpanel"
          aria-labelledby={`tab-ruta-${e.id}`}
          className="mt-10 grid gap-8 rounded-[18px] bg-marca-p50 px-6 py-7 sm:px-9 sm:py-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-14"
        >
          <div key={e.id} className="tarjeta-entra">
            <h3 className="text-2xl font-extrabold text-marca-primario sm:text-[1.75rem]">{e.nombre}</h3>
            <p className="mt-2 max-w-[62ch] text-lg leading-relaxed text-marca-tinta">{e.descripcion}</p>
          </div>
          <div key={`mod-${e.id}`} className="tarjeta-entra">
            <p className="text-sm font-semibold text-marca-suave">Lo que usas en Olive+</p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-3">
              {e.modulos.map((m) => (
                <li key={m.nombre} className="flex items-center gap-2 font-bold text-marca-primario">
                  <Image src={m.icono} alt="" className="h-9 w-9" />
                  {m.nombre}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
