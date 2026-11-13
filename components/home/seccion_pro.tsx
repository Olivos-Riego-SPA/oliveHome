'use client'

import { useEffect, useRef, useState } from 'react'
import Image, { type StaticImageData } from 'next/image'
import { MonitorPlay, Tv, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import capAnalisis from '@/app/public/images/plataforma/analisis-inteligente-comparativo.png'
import capComparar from '@/app/public/images/plataforma/riego-mapa-comparativa.png'
import capCompararGraficos from '@/app/public/images/plataforma/riego-graficos-comparativa-recorte.png'
import capPronostico from '@/app/public/images/plataforma/clima-pronostico.png'
import capPronosticoDetalle from '@/app/public/images/plataforma/clima-pronostico-detalle-recorte.png'
import capMonitoreo from '@/app/public/images/plataforma/monitoreo.png'
import fondoSatelital from '@/app/public/images/pro-fondo-satelital.webp'
import Ondas from './ondas'
import Topografia from './topografia'
import { ICONOS_MODULO } from './modulos_datos'

type IdVerbo = 'entender' | 'comparar' | 'anticipar' | 'vigilar'

interface Verbo {
  id: IdVerbo
  verbo: string
  pregunta: string
  respuesta: string
  donde: { nombre: string; icono: StaticImageData }[]
  dondeNota?: string
}

// Los 4 verbos del PRO, contados desde la pregunta del agricultor.
// Verificado contra lo que existe hoy en PRO (Análisis Inteligente, dos períodos, pronóstico, Monitoreo).
const VERBOS: Verbo[] = [
  {
    id: 'entender',
    verbo: 'Entender',
    pregunta: '¿Qué pasó y qué hago?',
    respuesta:
      'El Análisis Inteligente lee tus datos y te entrega un informe con el diagnóstico, los riesgos y las recomendaciones, listo en PDF o para pegar en un correo.',
    donde: [
      { nombre: 'Riego', icono: ICONOS_MODULO.riego },
      { nombre: 'Suelo', icono: ICONOS_MODULO.suelo },
    ],
  },
  {
    id: 'comparar',
    verbo: 'Comparar',
    pregunta: '¿Vamos mejor que el año pasado?',
    respuesta:
      'Pon dos períodos lado a lado: el mapa partido por una cortina que deslizas, los indicadores de cada uno y los gráficos sincronizados.',
    donde: [
      { nombre: 'Riego', icono: ICONOS_MODULO.riego },
      { nombre: 'Suelo', icono: ICONOS_MODULO.suelo },
    ],
  },
  {
    id: 'anticipar',
    verbo: 'Anticipar',
    pregunta: '¿Qué viene esta semana?',
    respuesta:
      'El pronóstico de las próximas horas y de los próximos 7 días llega a la estación de tu campo, con la ETc proyectada de cada día para planificar el riego antes de que cambie el clima.',
    donde: [{ nombre: 'Clima', icono: ICONOS_MODULO.clima }],
  },
  {
    id: 'vigilar',
    verbo: 'Vigilar',
    pregunta: '¿Cómo están todos mis campos?',
    respuesta:
      'Monitoreo es tu sala de control: una pantalla que dejas en la oficina, rota sola por tus campos, sectores, estaciones y pozos, y todo el equipo mira lo mismo.',
    donde: [{ nombre: 'Monitoreo', icono: ICONOS_MODULO.monitoreo }],
    dondeNota: 'Y en todos los módulos, el ranking de alarmas por dispositivo te dice dónde mirar primero.',
  },
]

const BENEFICIOS_MONITOREO = [
  { icono: MonitorPlay, titulo: 'Sin tocar nada', texto: 'Los campos y sectores pasan solos.' },
  { icono: Users, titulo: 'Un equipo alineado', texto: 'Riego, agronomía y administración leen lo mismo.' },
  { icono: Tv, titulo: 'En cualquier televisor', texto: 'Solo necesitas un navegador.' },
]

/**
 * Sección PRO: los 4 verbos (entender, comparar, anticipar, vigilar) como estructura.
 * Cada verbo responde una pregunta del agricultor y muestra dónde vive en Olive+.
 * Monitoreo es el protagonista de "Vigilar", en su televisor.
 *
 * En escritorio el bloque de los verbos queda fijo (sticky) bajo la cabecera mientras se hace scroll:
 * cada tramo de scroll pasa al verbo siguiente y, después del último, la página sigue bajando.
 * No se bloquea el scroll del navegador: el contenedor es más alto y el scroll se traduce en verbo.
 * En pantallas chicas el bloque no cabe en la pantalla, así que quedan las pestañas de siempre.
 */

/** Alto de la cabecera fija en escritorio (site_header.tsx, lg:h-20) */
const CABECERA = 80
/** Scroll que dura cada verbo, en altos de pantalla */
const TRAMO_VH = 70
export default function SeccionPro() {
  const [activo, setActivo] = useState(0)
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])
  const fijoRef = useRef<HTMLDivElement>(null)
  // Destino del desplazamiento automático al tocar un verbo: mientras dura, el scroll no cambia el
  // verbo (si no, pasaría por los verbos intermedios y la imagen parpadearía)
  const destinoRef = useRef<number | null>(null)
  // Bloque fijo solo en escritorio
  const [fijado, setFijado] = useState(false)
  const v = VERBOS[activo]

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const aplicar = () => setFijado(mq.matches)
    aplicar()
    mq.addEventListener('change', aplicar)
    return () => mq.removeEventListener('change', aplicar)
  }, [])

  // El avance del scroll dentro del contenedor alto elige el verbo
  useEffect(() => {
    if (!fijado) return
    let cuadro = 0
    const medir = () => {
      cuadro = 0
      const el = fijoRef.current
      if (!el) return
      if (destinoRef.current !== null) {
        // Todavía viajando hacia el verbo tocado: se mantiene; al llegar, el scroll retoma el mando
        if (Math.abs(window.scrollY - destinoRef.current) > 4) return
        destinoRef.current = null
      }
      const r = el.getBoundingClientRect()
      const recorrido = r.height - (window.innerHeight - CABECERA)
      const avance = Math.min(1, Math.max(0, (CABECERA - r.top) / recorrido))
      const i = Math.min(VERBOS.length - 1, Math.floor(avance * VERBOS.length))
      setActivo((a) => (a === i ? a : i))
    }
    const alScroll = () => {
      if (!cuadro) cuadro = requestAnimationFrame(medir)
    }
    // Si el usuario mueve la rueda, toca la pantalla o usa el teclado a mitad de camino, manda él
    const soltar = () => {
      destinoRef.current = null
    }
    // Del teclado, solo las teclas que desplazan la página (las flechas ←/→ cambian de verbo)
    const TECLAS_SCROLL = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']
    const soltarTecla = (e: KeyboardEvent) => {
      if (TECLAS_SCROLL.includes(e.key)) soltar()
    }
    medir()
    window.addEventListener('scroll', alScroll, { passive: true })
    window.addEventListener('resize', alScroll)
    window.addEventListener('wheel', soltar, { passive: true })
    window.addEventListener('touchstart', soltar, { passive: true })
    window.addEventListener('keydown', soltarTecla)
    return () => {
      window.removeEventListener('scroll', alScroll)
      window.removeEventListener('resize', alScroll)
      window.removeEventListener('wheel', soltar)
      window.removeEventListener('touchstart', soltar)
      window.removeEventListener('keydown', soltarTecla)
      cancelAnimationFrame(cuadro)
    }
  }, [fijado])

  const elegir = (i: number, foco = false) => {
    setActivo(i)
    if (foco) tabsRef.current[i]?.focus()
    // Con el bloque fijo, el verbo lo manda el scroll: se lleva la página al centro de su tramo
    const el = fijoRef.current
    if (fijado && el) {
      const r = el.getBoundingClientRect()
      const recorrido = r.height - (window.innerHeight - CABECERA)
      const max = document.documentElement.scrollHeight - window.innerHeight
      const destino = Math.round(Math.min(max, window.scrollY + r.top - CABECERA + ((i + 0.5) / VERBOS.length) * recorrido))
      destinoRef.current = destino
      window.scrollTo({ top: destino, behavior: 'smooth' })
    }
  }
  const onTeclas = (e: React.KeyboardEvent) => {
    const n = VERBOS.length
    if (e.key === 'ArrowRight') elegir((activo + 1) % n, true)
    else if (e.key === 'ArrowLeft') elegir((activo - 1 + n) % n, true)
    else return
    e.preventDefault()
  }

  return (
    <section id="pro" className="relative overflow-clip bg-marca-p700 text-white">
      {/* Borde superior curvo: el celeste del explorador entra en la sección */}
      <svg aria-hidden="true" viewBox="0 0 1440 120" preserveAspectRatio="none" className="relative block h-12 w-full lg:h-24">
        <path d="M0 0H1440V60C1180 96 900 108 640 96C380 84 170 64 0 70Z" fill="#028C44" transform="translate(0 6)" />
        <path d="M0 0H1440V60C1180 96 900 108 640 96C380 84 170 64 0 70Z" fill="#FFFFFF" />
      </svg>

      {/* Materia bajo el color: el campo real visto desde el satélite, teñido con el azul de marca */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 top-12 lg:top-24">
        <Image
          src={fondoSatelital}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.22] mix-blend-luminosity"
        />
        {/* Se desvanece hacia abajo para que el texto y las capturas respiren */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,61,88,0)_0%,rgba(6,61,88,0.55)_45%,#063D58_85%)]" />
      </div>
      <Topografia className="text-white/[0.06]" />
      <Ondas className="-right-72 top-24 h-[900px] w-[900px]" />
      <Ondas className="-left-64 bottom-[-260px] h-[620px] w-[620px]" animada={false} />

      <div className="relative mx-auto max-w-[1440px] px-6 pb-20 pt-10 sm:px-10 lg:px-16 lg:pb-28 lg:pt-14">
        <h2 className="max-w-4xl text-balance text-4xl font-normal leading-[1.1] tracking-[-0.01em] text-white/75 sm:text-5xl lg:text-[3.4rem]">
          Con Base ves tu campo.{' '}
          <span className="block font-extrabold text-white">
            Con <SelloPro className="mx-1 translate-y-[-0.12em] align-middle" /> decides mejor.
          </span>
        </h2>
        <p className="mt-6 max-w-[60ch] text-pretty text-lg leading-relaxed text-white/80">
          Con Base tienes el dato. PRO va más allá: te ayuda a <b className="text-white">entender</b>,{' '}
          <b className="text-white">comparar</b>, <b className="text-white">anticipar</b> y{' '}
          <b className="text-white">vigilar</b> lo que pasa en tu campo.
        </p>

        {/* Los 4 verbos. En escritorio: contenedor alto + bloque fijo bajo la cabecera */}
        <div
          ref={fijoRef}
          className="mt-14 lg:mt-16"
          style={fijado ? { height: `calc(${VERBOS.length * TRAMO_VH}vh + 100vh - ${CABECERA}px)` } : undefined}
        >
          <div className={cn(fijado && 'sticky flex flex-col justify-center')} style={fijado ? { top: CABECERA, height: `calc(100vh - ${CABECERA}px)` } : undefined}>
            <div
              role="tablist"
              aria-label="Lo que hace PRO"
              onKeyDown={onTeclas}
              className="grid grid-cols-2 gap-x-4 gap-y-2 border-b border-white/15 lg:grid-cols-4 lg:gap-x-8"
            >
              {VERBOS.map((x, i) => {
                const sel = i === activo
                return (
                  <button
                    key={x.id}
                    ref={(el) => {
                      tabsRef.current[i] = el
                    }}
                    role="tab"
                    id={`tab-pro-${x.id}`}
                    aria-selected={sel}
                    aria-controls="panel-pro"
                    tabIndex={sel ? 0 : -1}
                    onClick={() => elegir(i)}
                    className="group relative pb-5 pt-2 text-left"
                  >
                    <span
                      className={cn(
                        'block text-[1.9rem] font-extrabold leading-none tracking-[-0.01em] transition-colors duration-200 sm:text-[2.6rem]',
                        sel ? 'text-white' : 'text-white/55 group-hover:text-white/80',
                      )}
                    >
                      {x.verbo}
                    </span>
                    <span
                      className={cn(
                        'mt-2 block text-[15px] font-semibold transition-colors duration-200',
                        sel ? 'text-white/85' : 'text-white/70 group-hover:text-white/85',
                      )}
                    >
                      {x.pregunta}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-0 -bottom-px h-[3px] origin-left rounded-full bg-marca-ambar transition-transform duration-300 ease-[cubic-bezier(.2,.7,.2,1)]',
                        sel ? 'scale-x-100' : 'scale-x-0',
                      )}
                    />
                  </button>
                )
              })}
            </div>

            {/* Panel del verbo: alto constante para que lo de abajo no se mueva al cambiar de verbo */}
            <div
              id="panel-pro"
              role="tabpanel"
              aria-labelledby={`tab-pro-${v.id}`}
              className="mt-12 grid items-center gap-12 lg:grid-cols-[minmax(0,460px)_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[minmax(0,500px)_minmax(0,1fr)]"
            >
              {/* Los 4 textos ocupan la misma celda: la celda mide lo que el más largo */}
              <div className="grid">
                {VERBOS.map((x) => (
                  <div
                    key={x.id}
                    aria-hidden={x.id !== v.id}
                    className={cn('lg:[grid-area:1/1]', x.id === v.id ? 'tarjeta-entra' : 'hidden lg:block lg:invisible')}
                  >
                    <TextoVerbo verbo={x} />
                  </div>
                ))}
              </div>

              <div className="relative aspect-[16/10]">
                <div key={`visual-${v.id}`} className="tarjeta-entra absolute inset-0">
                  <VisualVerbo id={v.id} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cierre */}
        <div className="mt-20 flex flex-col gap-6 rounded-[18px] bg-white/[0.06] px-7 py-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[60ch] text-lg leading-relaxed text-white/85">
            <b className="text-white">PRO crece contigo:</b> cada tres meses llega una tanda nueva de funciones, sin que
            tengas que hacer nada.
          </p>
          <a
            href="#contacto"
            className="inline-flex h-[52px] shrink-0 items-center justify-center rounded-full bg-marca-verde px-8 text-lg font-bold text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-colors hover:bg-marca-verdeOscuro"
          >
            Quiero conocer PRO
          </a>
        </div>
      </div>

      {/* Salida curva hacia la sección del equipo (celeste) */}
      <svg aria-hidden="true" viewBox="0 0 1440 120" preserveAspectRatio="none" className="relative -mt-6 block h-12 w-full lg:-mt-10 lg:h-24">
        <path d="M0 120V64C260 34 560 18 820 30C1080 42 1280 74 1440 56V120Z" fill="#EEF4F7" />
      </svg>
    </section>
  )
}

const MARCO = 'overflow-hidden rounded-[10px] border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.3)]'
const INSERTO = 'absolute overflow-hidden rounded-[10px] shadow-[0_18px_44px_rgba(0,0,0,0.42)]'

/** Texto de un verbo: pregunta, respuesta, beneficios (Vigilar) y dónde vive en Olive+ */
function TextoVerbo({ verbo: x }: { verbo: Verbo }) {
  return (
    <>
      <h3 className="text-balance text-3xl font-extrabold leading-tight sm:text-[2.2rem]">{x.pregunta}</h3>
      <p className="mt-4 text-lg leading-relaxed text-white/80">{x.respuesta}</p>

      {x.id === 'vigilar' && (
        <ul className="mt-6 space-y-3">
          {BENEFICIOS_MONITOREO.map(({ icono: Icono, titulo, texto }) => (
            <li key={titulo} className="flex items-center gap-3.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10">
                <Icono className="h-[18px] w-[18px] text-white" aria-hidden="true" />
              </span>
              <span className="text-white/75">
                <b className="font-bold text-white">{titulo}:</b> {texto.charAt(0).toLowerCase() + texto.slice(1)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 border-t border-white/15 pt-5">
        <p className="text-sm font-semibold text-white/60">Dónde lo encuentras</p>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
          {x.donde.map((d) => (
            <li key={d.nombre} className="flex items-center gap-2.5 font-bold">
              <Image src={d.icono} alt="" className="h-9 w-9" />
              {d.nombre}
            </li>
          ))}
        </ul>
        {x.dondeNota && <p className="mt-3 text-[15px] text-white/70">{x.dondeNota}</p>}
      </div>
    </>
  )
}

/**
 * La imagen de cada verbo, compuesta dentro de un marco 16:10 común (alto constante):
 * captura principal arriba y, donde suma, un detalle superpuesto abajo.
 */
function VisualVerbo({ id }: { id: IdVerbo }) {
  if (id === 'vigilar') {
    return (
      <figure className="absolute inset-x-[7%] top-0">
        <div className="rounded-[18px] bg-marca-ink p-2 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-3">
          <div className="relative overflow-hidden rounded-[8px]">
            <Image
              src={capMonitoreo}
              alt="Monitoreo de Olive+: sala de control con el mapa de riego, la humedad del suelo, el riego por equipos, el pozo, el balance hídrico, los días grado y las horas frío de un campo"
              sizes="(min-width: 1024px) 54vw, 96vw"
              className="block h-auto w-full"
            />
            {/* La rotación entre campos, sugerida con su barra de avance */}
            <span aria-hidden="true" className="monitoreo-avance absolute inset-x-0 top-0 h-[3px] origin-left bg-marca-ambar/90" />
          </div>
        </div>
        {/* Pie del televisor */}
        <div aria-hidden="true" className="mx-auto h-3 w-24 rounded-b-md bg-marca-ink/80" />
        <div aria-hidden="true" className="mx-auto h-1.5 w-56 rounded-full bg-black/30 blur-[2px]" />
      </figure>
    )
  }

  if (id === 'entender') {
    return (
      <div className={cn(MARCO, 'absolute inset-x-0 top-0')}>
        <Image
          src={capAnalisis}
          alt="Análisis Inteligente de Olive+: informe comparativo de sectores con resumen ejecutivo, dónde mejoró, dónde empeoró y el detalle por sector"
          sizes="(min-width: 1024px) 56vw, 100vw"
          className="block h-auto w-full"
        />
      </div>
    )
  }

  if (id === 'comparar') {
    return (
      <>
        <div className={cn(MARCO, 'absolute right-0 top-0 w-[86%]')}>
          <Image
            src={capComparar}
            alt="Comparación de períodos en Olive+: mapa de riego de enero de 2026 junto a enero de 2025, separados por una cortina"
            sizes="(min-width: 1024px) 48vw, 86vw"
            className="block h-auto w-full"
          />
        </div>
        <div className={cn(INSERTO, 'bottom-0 left-0 w-[64%]')}>
          <Image
            src={capCompararGraficos}
            alt="Gráficos sincronizados del riego acumulado por equipo: enero de 2026 junto a enero de 2025, con ETo, riego y desempeño"
            sizes="(min-width: 1024px) 36vw, 64vw"
            className="block h-auto w-full"
          />
        </div>
      </>
    )
  }

  return (
    <>
      <div className={cn(MARCO, 'absolute inset-x-0 top-0')}>
        <Image
          src={capPronostico}
          alt="Módulo Clima de Olive+ con el pronóstico de 7 días de la estación del campo y el gráfico de evapotranspiración y lluvia"
          sizes="(min-width: 1024px) 56vw, 100vw"
          className="block h-auto w-full"
        />
      </div>
      <div className={cn(INSERTO, '-right-2 bottom-0 w-[48%] sm:-right-6')}>
        <Image
          src={capPronosticoDetalle}
          alt="Detalle del pronóstico de un día: temperatura máxima y mínima, precipitación, ETc proyectada de 4,79 mm, radiación, viento, amanecer y atardecer"
          sizes="(min-width: 1024px) 27vw, 48vw"
          className="block h-auto w-full"
        />
      </div>
    </>
  )
}

/** Sello PRO de la app: pill dorado con texto oscuro */
function SelloPro({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex h-[1.05em] min-h-6 items-center rounded-full bg-marca-ambar px-[0.45em] text-[0.62em] font-extrabold uppercase leading-none tracking-[0.08em] text-marca-ink',
        className,
      )}
    >
      PRO
    </span>
  )
}
