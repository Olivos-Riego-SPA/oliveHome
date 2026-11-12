'use client'

import { useEffect, useState } from 'react'
import Image, { type StaticImageData } from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import fotoCampo from '@/app/public/images/fondocentro.webp'
import capRiego from '@/app/public/images/plataforma/riego-mapa.png'
import capClima from '@/app/public/images/plataforma/clima-etc.png'
import capSuelo from '@/app/public/images/plataforma/suelo-bandas.png'
import capPlanta from '@/app/public/images/plataforma/planta-mapa.png'
import capPozo from '@/app/public/images/plataforma/pozo-resumen.png'
import capIndicadores from '@/app/public/images/plataforma/indicadores-recorte.png'
import Ondas from './ondas'
import Resaltado from './resaltado'
import { ICONOS_MODULO } from './modulos_datos'

import { APP_URL } from './constantes'

const ROTACION_MS = 6500

interface Dato {
  etiqueta: string
  valor: string
  detalle: string
}

interface Vista {
  nombre: string
  icono: StaticImageData
  captura: StaticImageData
  alt: string
  /** Datos reales leídos de la captura (campo Rio Peumo). Máximo 3: arriba, derecha, abajo. */
  datos: Dato[]
}

const VISTAS: Vista[] = [
  {
    nombre: 'Riego',
    icono: ICONOS_MODULO.riego,
    captura: capRiego,
    alt: 'Módulo Riego de Olive+: indicadores del período y mapa satelital con los sectores pintados según su desempeño',
    datos: [
      { etiqueta: 'Desempeño del campo', valor: '111,93 %', detalle: 'Enero 2026' },
      { etiqueta: 'Agua aplicada', valor: '8.915,67 m³', detalle: '215,50 ha regadas' },
      { etiqueta: 'Horas de riego', valor: '2.601,97 h', detalle: 'Todos los equipos' },
    ],
  },
  {
    nombre: 'Clima',
    icono: ICONOS_MODULO.clima,
    captura: capClima,
    alt: 'Módulo Clima de Olive+: indicadores de la estación y gráfico de evapotranspiración del cultivo y lluvia',
    datos: [
      { etiqueta: 'ETc diario', valor: '4,34 mm', detalle: 'Estación del campo · 12/11' },
      { etiqueta: 'Horas frío', valor: '930', detalle: 'Acumuladas en la temporada' },
      { etiqueta: 'Días grado', valor: '422', detalle: 'Base 5 °C' },
    ],
  },
  {
    nombre: 'Suelo',
    icono: ICONOS_MODULO.suelo,
    captura: capSuelo,
    alt: 'Módulo Suelo de Olive+: suma de humedad del suelo con sus bandas agronómicas y balance hídrico del sector',
    datos: [
      { etiqueta: 'Suma de humedad', valor: '+5,99 %', detalle: 'Tras el riego del 04/11' },
      { etiqueta: 'Humedad a 30 cm', valor: '27,0 %', detalle: 'Sector 16' },
    ],
  },
  {
    nombre: 'Planta',
    icono: ICONOS_MODULO.planta,
    captura: capPlanta,
    alt: 'Módulo Planta de Olive+: mapa de sectores pintados por estrés y gráfico de potencial hídrico diario',
    datos: [
      { etiqueta: 'Potencial hídrico', valor: '−4,83 bar', detalle: 'Sector 14 · 12/11' },
      { etiqueta: 'Línea de riego', valor: '−7,60 bar', detalle: 'Sector 14' },
    ],
  },
  {
    nombre: 'Pozos',
    icono: ICONOS_MODULO.pozos,
    captura: capPozo,
    alt: 'Módulo Pozos de Olive+: resumen de pozos con nivel freático, caudal y volumen, junto al mapa del campo',
    datos: [
      { etiqueta: 'Envío a la DGA', valor: 'Exitoso', detalle: 'Pozo · 12/11, 15:00' },
      { etiqueta: 'Nivel freático', valor: '2,72 m', detalle: 'Pozo Cancha Polo' },
      { etiqueta: 'Caudal', valor: '6,8 l/s', detalle: 'Noria Planta Tratamiento' },
    ],
  },
  {
    nombre: 'Indicadores',
    icono: ICONOS_MODULO.indicadores,
    captura: capIndicadores,
    alt: 'Módulo Indicadores de Olive+: tablero con mapa de riego, riego acumulado por equipos e indicadores de desempeño',
    datos: [
      { etiqueta: 'Desempeño promedio', valor: '109,8 %', detalle: '10 equipos activos' },
      { etiqueta: 'Fuera de umbrales', valor: '6 de 10', detalle: 'Equipos · 05/11 al 12/11' },
    ],
  },
]

// Posición de cada tarjeta flotante sobre la pantalla: arriba a la izquierda, derecha, abajo
const POSICIONES = [
  '-left-6 -top-7 xl:-left-10',
  'right-6 top-[40%] xl:right-24',
  '-bottom-8 left-[16%]',
]

/**
 * Hero "Plataforma en acción": la pantalla real de Olive+ rota por los módulos y las
 * tarjetas flotantes muestran datos reales de cada uno. La fila de íconos indica el módulo
 * a la vista y permite elegirlo. La ola lleva una foto de campo bajo el velo primario.
 */
export default function HeroPlataforma() {
  const [activa, setActiva] = useState(0)
  const [pausado, setPausado] = useState(false)
  const [elegido, setElegido] = useState(false)
  // Solo se piden las capturas ya mostradas y la siguiente (no las 6 de golpe)
  const [cargadas, setCargadas] = useState<Set<number>>(() => new Set([0, 1]))
  const reducido = useReducedMotion()
  const rota = !pausado && !elegido && !reducido

  useEffect(() => {
    if (!rota) return
    const t = setTimeout(() => setActiva((i) => (i + 1) % VISTAS.length), ROTACION_MS)
    return () => clearTimeout(t)
  }, [rota, activa])

  useEffect(() => {
    setCargadas((prev) => {
      const sig = (activa + 1) % VISTAS.length
      if (prev.has(activa) && prev.has(sig)) return prev
      return new Set([...prev, activa, sig])
    })
  }, [activa])

  const vista = VISTAS[activa]

  return (
    <section id="inicio" className="relative overflow-x-clip bg-marca-p50">
      {/* La ola: foto de campo bajo el velo primario, círculos de tono con ondas */}
      <div className="relative bg-marca-primario text-white">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <Image src={fotoCampo} alt="" fill priority sizes="100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-[rgba(8,77,110,0.86)]" />
          <Ondas className="-right-56 -top-80 h-[820px] w-[820px]" />
          <Ondas className="-left-52 top-[52%] h-[460px] w-[460px]" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-[1440px] grid-cols-1 gap-y-12 px-6 pb-14 pt-28 sm:px-10 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:gap-x-14 lg:px-16 lg:pb-0 lg:pt-36 xl:grid-cols-[minmax(0,640px)_minmax(0,1fr)]">
          {/* Mensaje */}
          <div className="max-w-[640px] self-center">
            <h1 className="text-[2.6rem] font-normal leading-[1.05] tracking-[-0.015em] sm:text-6xl lg:text-[3.6rem] xl:text-[4.25rem]">
              Tu campo completo,{' '}
              <b className="block font-extrabold">
                en un solo <Resaltado>lugar</Resaltado>
              </b>
            </h1>
            <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-white/85 sm:text-[19px]">
              <b className="font-bold text-white">Riega con datos, no con intuición.</b> Olive+ reúne riego,
              suelo, planta, clima y pozos en una sola pantalla, con un equipo agronómico que te acompaña.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#contacto"
                className="inline-flex h-[52px] items-center rounded-full bg-marca-verde px-8 text-[19px] font-bold text-white shadow-[0_8px_24px_rgba(2,60,30,0.28)] transition-colors hover:bg-marca-verdeOscuro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-marca-primario"
              >
                Escríbenos
              </a>
              <a
                href={APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[52px] items-center gap-2 rounded-full border border-white/45 px-7 text-lg font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-marca-primario"
              >
                Ingresar a Olive+
                <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>

            {/* Los módulos: indican la pantalla a la vista y permiten elegirla */}
            <div
              className="mt-12 hidden flex-wrap gap-x-4 gap-y-4 sm:flex"
              role="group"
              aria-label="Módulos de Olive+ en la pantalla"
              onMouseEnter={() => setPausado(true)}
              onMouseLeave={() => setPausado(false)}
            >
              {VISTAS.map((v, i) => {
                const sel = i === activa
                return (
                  <button
                    key={v.nombre}
                    type="button"
                    aria-pressed={sel}
                    onClick={() => {
                      setActiva(i)
                      setElegido(true)
                    }}
                    className="group flex w-[68px] flex-col items-center gap-1.5 rounded-xl py-1 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <span
                      className={cn(
                        'rounded-full p-[3px] transition-[box-shadow,opacity] duration-300',
                        sel ? 'opacity-100 shadow-[0_0_0_2px_rgba(255,255,255,0.9)]' : 'opacity-70 group-hover:opacity-100',
                      )}
                    >
                      <Image src={v.icono} alt="" className="h-11 w-11" />
                    </span>
                    <span
                      className={cn(
                        'text-[11px] leading-tight transition-colors',
                        sel ? 'font-bold text-white' : 'font-semibold text-white/75',
                      )}
                    >
                      {v.nombre}
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="sr-only" aria-live="polite">
              Mostrando el módulo {vista.nombre}
            </p>
          </div>

          {/* La plataforma en acción: capturas reales que rotan por módulo */}
          <div
            className="relative lg:-mb-44 lg:-mr-28 lg:self-end xl:-mr-40"
            onMouseEnter={() => setPausado(true)}
            onMouseLeave={() => setPausado(false)}
          >
            <div className="hero-pantalla relative aspect-[1458/821] overflow-hidden rounded-[10px] border border-white/20 bg-white shadow-[0_8px_24px_rgba(6,47,92,0.2),0_30px_70px_rgba(6,47,92,0.28)]">
              {VISTAS.map((v, i) =>
                cargadas.has(i) ? (
                  <Image
                    key={v.nombre}
                    src={v.captura}
                    alt={i === activa ? v.alt : ''}
                    aria-hidden={i !== activa}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className={cn(
                      'object-cover object-left-top transition-opacity duration-700 ease-[cubic-bezier(.2,.7,.2,1)] motion-reduce:transition-none',
                      i === activa ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                ) : null,
              )}
            </div>

            {vista.datos.map((d, i) => (
              <DatoFlotante
                key={`${vista.nombre}-${d.etiqueta}`}
                icono={vista.icono}
                dato={d}
                className={POSICIONES[i]}
                retraso={0.35 + i * 0.15}
              />
            ))}
          </div>
        </div>

        {/* Borde curvo de la ola: la foto sigue bajo la curva; abajo empieza el celeste del explorador */}
        <svg aria-hidden="true" viewBox="0 0 1440 132" preserveAspectRatio="none" className="relative block h-14 w-full lg:h-[110px]">
          <path d="M1440 40C1180 74 960 112 690 116C420 120 190 98 0 82V132H1440Z" fill="#028C44" />
          <path d="M1440 40C1180 74 960 112 690 116C420 120 190 98 0 82V132H1440Z" fill="#EEF4F7" transform="translate(0 8)" />
        </svg>
      </div>

      {/* Prueba: el respaldo, a la vista apenas termina el hero (la pantalla ocupa la derecha) */}
      <div className="mx-auto max-w-[1440px] px-6 pb-8 pt-6 sm:px-10 lg:min-h-[9rem] lg:px-16 lg:pt-4">
        <p className="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-marca-tinta lg:max-w-[52%]">
          <span><b className="text-2xl font-extrabold text-marca-primario [font-variant-numeric:lining-nums]">+258</b> empresas</span>
          <span><b className="text-2xl font-extrabold text-marca-primario [font-variant-numeric:lining-nums]">+30.000</b> hectáreas</span>
          <span className="flex items-center gap-2">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-marca-ambar" />
            Chile, Argentina y EE. UU.
          </span>
        </p>
      </div>
    </section>
  )
}

function DatoFlotante({
  icono,
  dato,
  className,
  retraso,
}: {
  icono: StaticImageData
  dato: Dato
  className?: string
  retraso: number
}) {
  return (
    <div
      style={{ animationDelay: `${retraso}s` }}
      className={cn(
        'tarjeta-entra absolute z-10 hidden items-center gap-3 rounded-[10px] bg-white py-3 pl-3 pr-5 text-marca-tinta shadow-[0_10px_30px_rgba(6,47,92,0.28)] sm:flex',
        className,
      )}
    >
      <Image src={icono} alt="" className="h-10 w-10" />
      <div className="leading-tight">
        <p className="text-xs font-semibold text-marca-suave">{dato.etiqueta}</p>
        <p className="text-xl font-extrabold text-marca-primario [font-variant-numeric:lining-nums]">{dato.valor}</p>
        <p className="text-xs text-marca-suave">{dato.detalle}</p>
      </div>
    </div>
  )
}
