'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowLeftRight,
  BellRing,
  CalendarDays,
  ChartColumnBig,
  CircleCheck,
  Clock,
  Droplets,
  Gauge,
  Layers,
  Map as IconoMapa,
  Sparkles,
  Sprout,
  TriangleAlert,
  Waypoints,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CabeceraDemo, Ola } from './cabecera_demo'
import { DIAS, ETO, FECHAS, Globo, Leyenda, SECTORES, Selector } from './modulo_comun'

/**
 * Módulo Riego de Olive+ (escritorio), a grandes rasgos. Copia la distribución de
 * olive_next/app/irrigation/desktopIrrigation.tsx: el campo se elige en la cabecera
 * (layouts/MainLayoutRiego.tsx); abajo, la tarjeta del dispositivo (con alarmas, ETo, calendario y
 * comparar) y 5 indicadores; y a todo el ancho un panel con las pestañas Mapa (sectores por
 * desempeño) y Gráficos (riego o fertirriego acumulado por equipo; al tocar un equipo, sus sectores).
 *
 * Desempeño = riego aplicado / referencia del período. El mapa compara con la ETo; al entrar a los
 * gráficos la referencia pasa a la ETc (la ETo ajustada al cultivo, más precisa). Datos ficticios
 * coherentes con ambas: el Equipo 3 (Sector 13) queda bajo el mínimo y el Equipo 6 (Sector 14) sobre
 * el máximo.
 *
 * Elementos que la guía puede enfocar: riego-campo, riego-dispositivo, riego-fecha, riego-eto,
 * riego-indicadores, riego-mapa, riego-tab-graficos, riego-graficos, riego-toggle, riego-barras y
 * riego-resumen (detalle de un sector), riego-comparar, riego-capas, riego-capas-panel y riego-analisis.
 */

export type VistaRiego = 'mapa' | 'equipos' | 'ferti' | 'sectores' | 'detalle'

const ETO_PERIODO = ETO.reduce((a, b) => a + b, 0)
const KC = 0.85

/** Referencia contra la que se compara el riego: ETo, o ETc (la ETo ajustada al cultivo) */
type Referencia = { nombre: string; total: number; diario: number[]; color: string }
const REF_ETO: Referencia = { nombre: 'ETo', total: ETO_PERIODO, diario: ETO, color: '#f98800' }
const REF_ETC: Referencia = { nombre: 'ETc', total: ETO_PERIODO * KC, diario: ETO.map((v) => v * KC), color: '#109a4c' }
const MINIMO = 80
const MAXIMO = 120

type Barra = { nombre: string; riego: number; horas: number }
type Equipo = Barra & { ha: number; sectores: string[]; ferti: [number, number, number] }

// Un equipo es un conjunto de sectores que se riegan juntos
const EQUIPOS: Equipo[] = [
  { nombre: 'Equipo 1', riego: 45, ha: 12, horas: 74, sectores: ['12', '18', '19'], ferti: [320, 140, 60] },
  { nombre: 'Equipo 2', riego: 50, ha: 10, horas: 81, sectores: ['15', '20'], ferti: [280, 120, 90] },
  { nombre: 'Equipo 3', riego: 20, ha: 8.5, horas: 31, sectores: ['13', '21', '22'], ferti: [90, 40, 0] },
  { nombre: 'Equipo 4', riego: 52, ha: 14, horas: 88, sectores: ['16', '23', '24', '25'], ferti: [410, 180, 120] },
  { nombre: 'Equipo 5', riego: 42, ha: 9, horas: 69, sectores: ['26', '27'], ferti: [240, 100, 70] },
  { nombre: 'Equipo 6', riego: 72, ha: 6.5, horas: 117, sectores: ['14', '28'], ferti: [300, 160, 40] },
]
const CANALES = [
  { nombre: 'F1', color: '#0b4f6c' },
  { nombre: 'F2', color: '#2a8fc4' },
  { nombre: 'F3', color: '#7dd3fc' },
]
/**
 * Sectores al bajar un nivel. Para que la demo sea rápida, cualquier equipo muestra los mismos 4
 * sectores (en Olive+ son los del equipo elegido), con desempeños variados.
 */
const SECTORES_EQUIPO: Barra[] = [
  { nombre: 'Sector 1', riego: 33, horas: 24 },
  { nombre: 'Sector 2', riego: 44, horas: 31 },
  { nombre: 'Sector 3', riego: 50, horas: 35 },
  { nombre: 'Sector 4', riego: 66, horas: 44 },
]
// El mismo período de la temporada pasada, para la comparativa de gráficos (PRO)
const EQUIPOS_ANTERIOR: Barra[] = EQUIPOS.map((e, i) => ({ ...e, riego: [48, 47, 41, 55, 44, 60][i], horas: [70, 68, 59, 81, 64, 88][i] }))

const desempeno = (riego: number, ref: Referencia = REF_ETO) => (riego / ref.total) * 100

type Estado = 'sobre' | 'optimo' | 'bajo' | 'sin'
const estado = (d: number): Estado => (d > MAXIMO ? 'sobre' : d >= MINIMO ? 'optimo' : 'bajo')
const COLOR_ESTADO: Record<Estado, string> = { sobre: '#c81e1e', optimo: '#15803d', bajo: '#f4a3a3', sin: '#9ca3af' }
const NOMBRE_ESTADO: Record<Estado, string> = {
  sobre: 'Desempeño sobre el máximo',
  optimo: 'Desempeño óptimo',
  bajo: 'Desempeño bajo el mínimo',
  sin: 'Sin desempeño',
}
// Equipo de cada sector del mapa
const equipoDe = (sector: string) => EQUIPOS.find((e) => e.sectores.includes(sector))!

// Indicadores del período
const VOLUMEN = EQUIPOS.reduce((a, e) => a + e.riego * e.ha * 10, 0)
const HECTAREAS = EQUIPOS.reduce((a, e) => a + e.ha, 0)
const HORAS = EQUIPOS.reduce((a, e) => a + e.horas, 0)
const LAMINA = VOLUMEN / HECTAREAS / 10
const fmt = (n: number, dec = 2) => n.toLocaleString('es-CL', { minimumFractionDigits: dec, maximumFractionDigits: dec })
// `comparativa`: el mismo período de la temporada pasada (comparación de períodos, PRO)
const INDICADORES = [
  { etiqueta: 'Volumen total', valor: `${fmt(VOLUMEN)} m³`, comparativa: '29.840,00 m³', icono: Droplets, fondo: 'from-[#d0708a] to-[#9e3b58]' },
  { etiqueta: 'Horas de riego', valor: `${fmt(HORAS)} h`, comparativa: '431,00 h', icono: Clock, fondo: 'from-[#b993ec] to-[#8257cf]' },
  { etiqueta: 'Superficie', valor: `${fmt(HECTAREAS)} ha`, comparativa: '60,00 ha', icono: Waypoints, fondo: 'from-[#9adcdc] to-[#5fb4b4]' },
  { etiqueta: 'Acumulación por hectárea', valor: `${fmt(LAMINA)} mm`, comparativa: '49,73 mm', icono: Sprout, fondo: 'from-[#fbb36b] to-[#ee8a2a]' },
  { etiqueta: 'Desempeño por equipo', valor: `${fmt(desempeno(LAMINA))} %`, comparativa: '90,25 %', icono: Gauge, fondo: 'from-[#6f93d6] to-[#3c62ad]' },
]

export default function RiegoDemo({
  vista = 'mapa',
  comparando = false,
  capasAbiertas = false,
  etc = false,
  informeAbierto = false,
  informeSectorAbierto = false,
  detalleComparando = false,
  esperando = null,
  onAccion,
  onInicio,
}: {
  /** Lo que muestra el panel: lo pide la guía */
  vista?: VistaRiego
  /** Comparación de períodos (PRO): cortina en el mapa e indicadores con la comparativa */
  comparando?: boolean
  /** Panel de capas del mapa (PRO) abierto; en la comparativa, el lado derecho pasa a "Aplicado mm" */
  capasAbiertas?: boolean
  /** Los gráficos comparan con la ETc (el botón ETo pasa a ETc, en verde) */
  etc?: boolean
  /** Informe del Análisis Inteligente (PRO) abierto */
  informeAbierto?: boolean
  /** Informe del Análisis Inteligente del sector, sobre el detalle a pantalla completa (PRO) */
  informeSectorAbierto?: boolean
  /** El detalle del sector compara dos períodos: un gráfico arriba del otro (PRO) */
  detalleComparando?: boolean
  /** Elemento que la guía espera que el usuario toque (`data-guia`); solo ese responde al clic */
  esperando?: string | null
  onAccion?: (accion: string) => void
  onInicio?: () => void
}) {
  // Equipo cuyos sectores se ven al bajar un nivel (por defecto el 3, el que quedó bajo el mínimo)
  const [equipo, setEquipo] = useState(2)
  // Sector cuyo detalle se abre al bajar otro nivel (por defecto el Sector 2)
  const [sector, setSector] = useState(1)
  const enGraficos = vista !== 'mapa'
  // El detalle se abre a pantalla completa sobre el gráfico de sectores
  const panel = vista === 'detalle' ? 'sectores' : vista
  const ref = etc ? REF_ETC : REF_ETO

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#F5F5F7] font-sans">
      <CabeceraDemo variante="modulo" onLogo={onInicio} campo={{ nombre: 'Fundo Demo', guia: 'riego-campo' }} />
      <Ola />

      <motion.main
        className="relative z-[2] flex h-[calc(100%-56px)] w-full flex-col gap-3 p-4 pt-5"
        initial="oculto"
        animate="visible"
        variants={{ oculto: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
      >
        {/* Arriba: dispositivo y período, e indicadores */}
        <motion.div
          className="flex items-start gap-4"
          variants={{ oculto: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="w-[392px] shrink-0 rounded-lg bg-white p-3 shadow-md">
            <div className="flex items-center justify-between gap-2">
              <Selector data-guia="riego-dispositivo" texto="Dispositivo Fundo Demo" className="w-52 text-[13px]" />
              <div className="flex gap-1.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#e0524c] text-white">
                  <BellRing className="h-4 w-4" />
                </span>
                <motion.span
                  data-guia="riego-eto"
                  className="grid h-9 w-9 place-items-center rounded-full text-[10px] font-bold text-white"
                  animate={{ backgroundColor: etc ? '#109a4c' : '#f98800' }}
                  transition={{ duration: 0.4 }}
                >
                  {etc ? 'ETc' : 'ETo'}
                </motion.span>
                <span data-guia="riego-fecha" className="grid h-9 w-9 place-items-center rounded-full bg-[#084d6e] text-white">
                  <CalendarDays className="h-4 w-4" />
                </span>
                {/* Comparar períodos (PRO) */}
                <span
                  data-guia="riego-comparar"
                  onClick={esperando === 'riego-comparar' ? () => onAccion?.('riego-comparar') : undefined}
                  className={cn(
                    'grid h-9 w-9 place-items-center rounded-full border-2 border-[#00a3a8]',
                    comparando ? 'bg-[#00a3a8] text-white shadow-[0_0_0_4px_rgba(0,163,168,0.25)]' : 'bg-white text-[#00a3a8]',
                    esperando === 'riego-comparar' && 'cursor-pointer transition-transform hover:scale-110',
                  )}
                >
                  <ArrowLeftRight className="h-4 w-4" />
                </span>
              </div>
            </div>
            <p className="pt-3 text-right text-[12px] text-[#212427]">
              <b>Período entre:</b> {FECHAS[0]}/2026 y {FECHAS[DIAS - 1]}/2026
            </p>
          </div>

          <div data-guia="riego-indicadores" className="flex flex-1 justify-between pr-1">
            {INDICADORES.map((x) => (
              <div key={x.etiqueta} className="flex flex-col items-center">
                <div className={cn('grid h-[104px] w-[104px] place-items-center rounded-full bg-gradient-to-br text-white shadow-lg', x.fondo)}>
                  <div className="flex flex-col items-center">
                    <x.icono className="h-7 w-7" />
                    <p className="mt-1 text-[14px] font-bold leading-none">{x.valor}</p>
                    {comparando && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 text-center text-[8px] leading-tight opacity-90">
                        COMPARATIVA
                        <br />
                        <b className="text-[10px]">{x.comparativa}</b>
                      </motion.p>
                    )}
                  </div>
                </div>
                <p className="mt-1 max-w-[120px] text-center text-[10px] font-medium leading-tight text-[#3F4650]">{x.etiqueta}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Abajo: panel con pestañas Mapa / Gráficos */}
        <motion.div
          className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-white shadow-md"
          variants={{ oculto: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {enGraficos ? (
            <div data-guia="riego-graficos" className="flex min-h-0 flex-1 flex-col">
              <div className="flex items-center justify-between px-4 pt-2">
                {panel === 'sectores' ? (
                  <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] text-gray-600">
                    <ArrowLeft className="h-3 w-3" /> Equipos
                  </span>
                ) : (
                  <span className="w-20" />
                )}
                <p className="text-[13px] font-semibold text-[#212427]">
                  {panel === 'ferti'
                    ? 'Fertirriego acumulado por equipo'
                    : panel === 'sectores'
                      ? `Riego acumulado por sector · ${EQUIPOS[equipo].nombre}`
                      : 'Riego acumulado por equipo'}{' '}
                  <span className="font-normal text-gray-500">
                    ({FECHAS[0]}/2026 - {FECHAS[DIAS - 1]}/2026)
                  </span>
                </p>
                <span className="flex items-center gap-2">
                {panel !== 'ferti' && (
                  /* Análisis Inteligente (PRO) */
                  <span
                    data-guia="riego-analisis"
                    onClick={esperando === 'riego-analisis' ? () => onAccion?.('riego-analisis') : undefined}
                    className={cn(
                      'grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[#8b5cf6] via-[#6366f1] to-[#4f46e5] text-white shadow',
                      esperando === 'riego-analisis' && 'cursor-pointer transition-transform hover:scale-110',
                    )}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                )}
                <span
                  data-guia="riego-toggle"
                  onClick={esperando === 'riego-toggle' ? () => onAccion?.('riego-toggle') : undefined}
                  className={cn('flex gap-1 rounded-full bg-gray-100 p-0.5 text-[10px]', esperando === 'riego-toggle' && 'cursor-pointer')}
                >
                  <span className={cn('rounded-full px-2 py-0.5', vista === 'ferti' ? 'bg-[#084d6e] text-white' : 'text-gray-500')}>Fertirriego</span>
                  <span className={cn('rounded-full px-2 py-0.5', vista !== 'ferti' ? 'bg-[#084d6e] text-white' : 'text-gray-500')}>Riego</span>
                </span>
                </span>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={panel === 'sectores' ? `sectores-${equipo}` : panel === 'equipos' && comparando ? 'equipos-comparando' : panel}
                  className="flex min-h-0 flex-1 flex-col"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                >
                  {panel === 'ferti' ? (
                    <GraficoFerti />
                  ) : panel === 'equipos' && comparando ? (
                    // Comparativa (PRO): los dos períodos lado a lado
                    <div className="flex min-h-0 flex-1">
                      <MitadComparativa etiqueta="Principal" fechas={`${FECHAS[0]}/2026 - ${FECHAS[DIAS - 1]}/2026`}>
                        <GraficoRiego barras={EQUIPOS} referencia={ref} ancho={640} />
                      </MitadComparativa>
                      <div className="my-3 w-px bg-gray-200" />
                      <MitadComparativa etiqueta="Comparativa" fechas={`${FECHAS[0]}/2025 - ${FECHAS[DIAS - 1]}/2025`} tinte>
                        <GraficoRiego barras={EQUIPOS_ANTERIOR} referencia={ref} ancho={640} />
                      </MitadComparativa>
                    </div>
                  ) : (
                    <GraficoRiego
                      referencia={ref}
                      barras={panel === 'sectores' ? SECTORES_EQUIPO : EQUIPOS}
                      guia="riego-barras"
                      onBarra={
                        esperando === 'riego-barras'
                          ? (i) => {
                              if (panel === 'sectores') setSector(i)
                              else setEquipo(i)
                              onAccion?.('riego-barras')
                            }
                          : undefined
                      }
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <div data-guia="riego-mapa" className="relative min-h-0 flex-1">
              <MapaRiego
                comparando={comparando}
                capasAbiertas={capasAbiertas}
                capasClicable={esperando === 'riego-capas'}
                onCapas={() => onAccion?.('riego-capas')}
              />
            </div>
          )}

          <div className="grid grid-cols-2 border-t border-slate-200 text-[12px]">
            <span className={cn('relative flex items-center justify-center gap-1.5 py-2', !enGraficos ? 'text-[#00a3a8]' : 'text-gray-500')}>
              <IconoMapa className="h-4 w-4" /> Mapa
              {!enGraficos && <motion.span layoutId="pestana-riego" className="absolute inset-x-0 top-0 h-0.5 bg-[#00a3a8]" />}
            </span>
            <span
              data-guia="riego-tab-graficos"
              onClick={esperando === 'riego-tab-graficos' ? () => onAccion?.('riego-tab-graficos') : undefined}
              className={cn(
                'relative flex items-center justify-center gap-1.5 py-2',
                enGraficos ? 'text-[#00a3a8]' : 'text-gray-500',
                esperando === 'riego-tab-graficos' && 'cursor-pointer hover:bg-gray-50',
              )}
            >
              <ChartColumnBig className="h-4 w-4" /> Gráficos
              {enGraficos && <motion.span layoutId="pestana-riego" className="absolute inset-x-0 top-0 h-0.5 bg-[#00a3a8]" />}
            </span>
          </div>
        </motion.div>
      </motion.main>

      {/* Detalle del sector, a pantalla completa (olive_next/app/irrigation/components/openContainerRiego.tsx) */}
      <AnimatePresence>
        {vista === 'detalle' && (
          <motion.div
            className="absolute inset-0 z-[36] flex flex-col bg-[#F5F5F7]"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="relative flex items-center justify-center gap-2.5 bg-gradient-to-br from-[#0a6a90] via-[#084d6e] to-[#063d56] px-4 py-1.5 text-white shadow-md">
              <p className="text-sm font-bold tracking-wide">Detalles</p>
              <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-2 py-0.5 text-[10px] font-semibold">
                <span className="uppercase tracking-wide text-white/70">Sector</span> {SECTORES_EQUIPO[sector].nombre.replace('Sector ', '')}
              </span>
              <button
                type="button"
                onClick={() => onAccion?.('cerrar-detalle')}
                className="absolute right-3 grid h-7 w-7 place-items-center rounded-full hover:bg-white/15"
                aria-label="Cerrar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-between px-4 pt-2">
              <p className="text-[14px] font-semibold text-[#212427]">
                Detalle por sector · {SECTORES_EQUIPO[sector].nombre}{' '}
                <span className="font-normal text-gray-500">
                  ({FECHAS[0]}/2026 - {FECHAS[DIAS - 1]}/2026)
                </span>
              </p>
              <span className="flex items-center gap-2">
                {/* Análisis Inteligente del sector (PRO) */}
                <span
                  data-guia="riego-analisis-detalle"
                  onClick={esperando === 'riego-analisis-detalle' ? () => onAccion?.('riego-analisis-detalle') : undefined}
                  className={cn(
                    'grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#8b5cf6] via-[#6366f1] to-[#4f46e5] text-white shadow',
                    esperando === 'riego-analisis-detalle' && 'cursor-pointer transition-transform hover:scale-110',
                  )}
                >
                  <Sparkles className="h-4 w-4" />
                </span>
                <span className="flex gap-1 rounded-full bg-gray-200 p-0.5 text-[10px]">
                  <span className="px-2 py-0.5 text-gray-500">Fertirriego</span>
                  <span className="rounded-full bg-[#084d6e] px-2 py-0.5 text-white">Riego</span>
                </span>
              </span>
            </div>
            <DetalleSector barra={SECTORES_EQUIPO[sector]} referencia={ref} comparando={detalleComparando} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{informeAbierto && <InformeRiego referencia={ref} onCerrar={() => onAccion?.('cerrar-informe')} />}</AnimatePresence>
      <AnimatePresence>
        {informeSectorAbierto && (
          <InformeSector barra={SECTORES_EQUIPO[sector]} referencia={ref} onCerrar={() => onAccion?.('cerrar-informe-sector')} />
        )}
      </AnimatePresence>
    </div>
  )
}

/** Mitad de la comparativa de gráficos, con su etiqueta y período */
function MitadComparativa({ etiqueta, fechas, tinte, children }: { etiqueta: string; fechas: string; tinte?: boolean; children: React.ReactNode }) {
  return (
    <div className={cn('flex min-w-0 flex-1 flex-col', tinte && 'bg-[#f2f8fa]')}>
      <p className="pt-1 text-center text-[11px] text-[#212427]">
        <span className="mr-1.5 rounded-full bg-gray-200 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-gray-600">{etiqueta}</span>
        {fechas}
      </p>
      {children}
    </div>
  )
}

/* ---------- Mapa ---------- */

// Desempeño de cada sector en el mismo período de la temporada pasada (comparativa)
const ESTADO_ANTERIOR: Record<string, Estado> = { '12': 'optimo', '13': 'optimo', '14': 'sobre', '15': 'optimo', '16': 'bajo' }

/** Capa "Aplicado mm": del rojo (poco) al celeste y al azul (mucho) */
function colorAplicado(mm: number) {
  const t = Math.max(0, Math.min(1, (mm - 20) / 65))
  const escala = ['#d73027', '#fc8d59', '#7dd3fc', '#3b82f6', '#1e40af']
  return escala[Math.round(t * (escala.length - 1))]
}

const CAPAS = [
  { nombre: 'Desempeño', fondo: 'linear-gradient(135deg, #fab500, #e09800)' },
  { nombre: 'Reposición', fondo: 'linear-gradient(135deg, #0a6a94, #084d6e, #072d3d)' },
  { nombre: 'Aplicado mm', fondo: 'linear-gradient(135deg, #d73027, #7dd3fc, #1e40af)' },
  { nombre: 'Aplicado m³', fondo: 'linear-gradient(135deg, #7c3aed, #c4b5fd, #4c1d95)' },
]

/** Fondo satelital y sectores del fundo pintados con `colorDe` */
function CapaMapa({ colorDe }: { colorDe: (sector: string) => string }) {
  return (
    <svg viewBox="0 0 1240 470" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
      <defs>
        <pattern id="hileras-riego" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="#000" strokeOpacity="0.16" strokeWidth="1.6" />
        </pattern>
        <filter id="relieve-riego">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="7" />
          <feColorMatrix values="0 0 0 0 0.24  0 0 0 0 0.25  0 0 0 0 0.17  0 0 0 0.55 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      <rect width="1240" height="470" fill="#6d6a4c" />
      <rect width="1240" height="470" fill="#6d6a4c" filter="url(#relieve-riego)" />
      {/* Parcelas vecinas */}
      {[
        ['40,60 190,20 220,150 70,190', '#5f6b3e'],
        ['60,240 210,200 240,340 90,380', '#77704f'],
        ['230,330 380,290 400,430 250,470', '#56663a'],
        ['900,40 1050,10 1080,140 930,170', '#6f7449'],
        ['960,210 1110,170 1140,300 990,340', '#7b7353'],
        ['1080,340 1220,300 1240,440 1100,470', '#5d6940'],
        ['760,300 880,270 900,400 780,430', '#64703f'],
      ].map(([p, c]) => (
        <g key={p}>
          <polygon points={p} fill={c} />
          <polygon points={p} fill="url(#hileras-riego)" />
        </g>
      ))}
      <path d="M0,330 C300,300 450,280 640,170 S1000,40 1240,30" fill="none" stroke="#c8bb98" strokeWidth="3" strokeOpacity="0.8" />
      {/* El Fundo Demo, al centro */}
      <g transform="translate(420 0)">
        {SECTORES.map((s) => {
          const c = colorDe(s.id)
          return (
            <g key={s.id}>
              <polygon points={s.puntos} fill="#4d5a33" />
              <polygon points={s.puntos} fill={c} fillOpacity={0.62} stroke={c} strokeWidth={2} />
            </g>
          )
        })}
      </g>
    </svg>
  )
}

/** Cortina de la comparativa: se mueve sola hasta que el usuario la arrastra */
function useCortina(activa: boolean) {
  const [x, setX] = useState(50)
  const arrastrada = useRef(false)
  useEffect(() => {
    if (!activa) {
      arrastrada.current = false
      return setX(48)
    }
    let id = 0
    const inicio = performance.now()
    const paso = (t: number) => {
      // Oscila sobre el fundo (ocupa ~39–57 % del ancho), para que siempre se vea la diferencia
      if (!arrastrada.current) setX(48 + Math.sin((t - inicio) / 1100) * 8)
      id = requestAnimationFrame(paso)
    }
    id = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(id)
  }, [activa])
  return { x, setX, arrastrada }
}

/** Mapa a todo el ancho; en la comparativa, partido por la cortina (principal | temporada pasada) */
function MapaRiego({
  comparando,
  capasAbiertas,
  capasClicable,
  onCapas,
}: {
  comparando: boolean
  capasAbiertas: boolean
  capasClicable: boolean
  onCapas: () => void
}) {
  const caja = useRef<HTMLDivElement>(null)
  const { x, setX, arrastrada } = useCortina(comparando)
  const principal = (id: string) => COLOR_ESTADO[estado(desempeno(equipoDe(id).riego))]
  const anterior = (id: string) => COLOR_ESTADO[ESTADO_ANTERIOR[id]]
  // Con las capas abiertas, el lado derecho se pinta con "Aplicado mm" (comparar capas)
  const derecha = capasAbiertas ? (id: string) => colorAplicado(equipoDe(id).riego * 0.9) : anterior

  const arrastrar = (e: React.PointerEvent) => {
    const r = caja.current?.getBoundingClientRect()
    if (!r) return
    arrastrada.current = true
    setX(Math.max(8, Math.min(92, ((e.clientX - r.left) / r.width) * 100)))
  }

  return (
    <div ref={caja} className="absolute inset-0 overflow-hidden">
      <CapaMapa colorDe={principal} />
      <AnimatePresence>
        {comparando && (
          <motion.div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 0 0 ${x}%)` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CapaMapa colorDe={derecha} />
          </motion.div>
        )}
      </AnimatePresence>

      {comparando && (
        <>
          <div className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow" style={{ left: `${x}%` }} />
          <span
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              arrastrar(e)
            }}
            onPointerMove={(e) => e.buttons && arrastrar(e)}
            className="absolute top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-white text-[#084d6e] shadow-md"
            style={{ left: `${x}%` }}
          >
            <ArrowLeftRight className="h-4 w-4" />
          </span>
          <span className="absolute left-3 top-3 rounded-md bg-white px-2.5 py-1 text-[10px] leading-tight shadow-md">
            <b className="block text-[8px] tracking-wide text-[#00a3a8]">PRINCIPAL</b>
            {FECHAS[0]}/26 - {FECHAS[DIAS - 1]}/26
          </span>
          <span className="absolute right-3 top-3 rounded-md bg-white px-2.5 py-1 text-right text-[10px] leading-tight shadow-md">
            <b className="block text-[8px] tracking-wide text-[#00a3a8]">COMPARATIVA</b>
            {FECHAS[0]}/25 - {FECHAS[DIAS - 1]}/25
          </span>
        </>
      )}

      <div className="absolute bottom-3 left-3 rounded-md bg-white px-3 py-2 text-[10px] leading-tight text-gray-600 shadow-md">
        <p className="mb-0.5 text-[11px] text-[#212427]">Simbología</p>
        {(['sobre', 'optimo', 'bajo', 'sin'] as Estado[]).map((e) => (
          <p key={e} className="flex items-center gap-1">
            <span className="h-2 w-2" style={{ background: COLOR_ESTADO[e] }} />
            {NOMBRE_ESTADO[e]}
          </p>
        ))}
      </div>

      {/* Capas del mapa (PRO) */}
      <AnimatePresence>
        {capasAbiertas && (
          <motion.div
            data-guia="riego-capas-panel"
            className="absolute bottom-16 right-3 w-[250px] rounded-xl bg-white p-3 shadow-xl"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-[13px] font-semibold text-[#212427]">Capas del mapa</p>
            <p className="mt-2 text-[10px] font-medium uppercase tracking-wide text-gray-400">Pintado del mapa</p>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5">
              {CAPAS.map((c, i) => (
                <span
                  key={c.nombre}
                  className={cn('rounded-full px-2.5 py-1.5 text-center text-[10px] font-semibold', i === 0 ? 'text-white' : 'bg-gray-100 text-gray-600')}
                  style={i === 0 ? { background: c.fondo } : undefined}
                >
                  {c.nombre}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[10px] font-medium uppercase tracking-wide text-gray-400">Comparar capas</p>
            <div className="mt-1.5 grid grid-cols-2 gap-1.5 text-[10px]">
              <span className="rounded-lg border border-gray-200 px-2 py-1">
                <span className="block text-[8px] text-gray-400">Izquierda</span>
                <b className="text-[#212427]">Desempeño</b>
              </span>
              <span className="rounded-lg border border-[#3b82f6] bg-blue-50 px-2 py-1">
                <span className="block text-[8px] text-gray-400">Derecha</span>
                <b className="text-[#1e40af]">Aplicado mm</b>
              </span>
            </div>
            <div className="mt-2.5 h-1.5 rounded-full" style={{ background: 'linear-gradient(90deg, #d73027, #fc8d59, #7dd3fc, #3b82f6, #1e40af)' }} />
            <div className="mt-0.5 flex justify-between text-[8px] text-gray-400">
              <span>Menos mm</span>
              <span>Más mm</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <span
        data-guia="riego-capas"
        onClick={capasClicable ? onCapas : undefined}
        className={cn(
          'absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-[#f5b301] text-white shadow-md',
          capasClicable && 'cursor-pointer transition-transform hover:scale-110',
        )}
      >
        <Layers className="h-5 w-5" />
      </span>
    </div>
  )
}

/* ---------- Gráficos ---------- */

const W = 1200
const H = 330
const IZQ = 56
const DER = 56
const ARRIBA = 14
const ABAJO = 40
const PLOT = W - IZQ - DER
const ALTO = H - ARRIBA - ABAJO

/** Riego acumulado (barras ETo y riego) con la línea de desempeño, por equipo o por sector */
function GraficoRiego({
  barras,
  referencia,
  ancho: W = 1200,
  guia,
  onBarra,
}: {
  barras: Barra[]
  referencia: Referencia
  ancho?: number
  guia?: string
  onBarra?: (i: number) => void
}) {
  const [hover, setHover] = useState<number | null>(null)
  const PLOT = W - IZQ - DER
  const ref = referencia
  const col = PLOT / barras.length
  const yR = (mm: number) => ARRIBA + (1 - mm / 100) * ALTO
  const yD = (p: number) => ARRIBA + (1 - p / 180) * ALTO
  const cx = (i: number) => IZQ + (i + 0.5) * col
  const anchoBarra = Math.min(col * 0.22, 46)
  const linea = barras.map((e, i) => `${i ? 'L' : 'M'}${cx(i)},${yD(desempeno(e.riego, ref))}`).join('')

  return (
    <>
      {/* Envoltorio HTML: la guía mide elementos HTML (no SVG) */}
      <div data-guia={guia} className="flex min-h-0 flex-1">
        <svg viewBox={`0 0 ${W} ${H}`} className="min-h-0 w-full flex-1" onMouseLeave={() => setHover(null)}>
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line x1={IZQ} x2={IZQ + PLOT} y1={yR(v)} y2={yR(v)} stroke="#f1f5f9" />
              <text x={IZQ - 8} y={yR(v) + 3} fontSize="10" fill="#64748b" textAnchor="end">
                {v}
              </text>
            </g>
          ))}
          {[0, 45, 90, 135, 180].map((v) => (
            <text key={v} x={IZQ + PLOT + 8} y={yD(v) + 3} fontSize="10" fill="#64748b">
              {v}
            </text>
          ))}
          <text x={14} y={ARRIBA + ALTO / 2} fontSize="10" fill="#64748b" textAnchor="middle" transform={`rotate(-90 14 ${ARRIBA + ALTO / 2})`}>
            Riego (mm)
          </text>
          <text x={W - 12} y={ARRIBA + ALTO / 2} fontSize="10" fill="#64748b" textAnchor="middle" transform={`rotate(90 ${W - 12} ${ARRIBA + ALTO / 2})`}>
            Desempeño (%)
          </text>
          {/* Límites del desempeño óptimo */}
          {[MINIMO, MAXIMO].map((v) => (
            <line key={v} x1={IZQ} x2={IZQ + PLOT} y1={yD(v)} y2={yD(v)} stroke="#ef4444" strokeWidth="1.4" strokeDasharray="4 4" />
          ))}
          {barras.map((e, i) => (
            <g
              key={e.nombre}
              onMouseEnter={() => setHover(i)}
              onClick={onBarra ? () => onBarra(i) : undefined}
              className={onBarra ? 'cursor-pointer' : undefined}
            >
              <rect x={IZQ + i * col} y={ARRIBA} width={col} height={ALTO} fill={hover === i ? '#084d6e' : 'transparent'} fillOpacity={0.05} />
              <rect x={cx(i) - anchoBarra - 2} y={yR(ref.total)} width={anchoBarra} height={yR(0) - yR(ref.total)} fill={ref.color} />
              <rect x={cx(i) + 2} y={yR(e.riego)} width={anchoBarra} height={yR(0) - yR(e.riego)} fill="#0b4f6c" />
              <text x={cx(i)} y={H - ABAJO + 18} fontSize="11" fill="#3F4650" textAnchor="middle">
                {e.nombre}
              </text>
            </g>
          ))}
          <line x1={IZQ} x2={IZQ + PLOT} y1={ARRIBA + ALTO} y2={ARRIBA + ALTO} stroke="#94a3b8" />
          <path d={linea} fill="none" stroke="#f5b301" strokeWidth="2.5" strokeLinejoin="round" pointerEvents="none" />
          {barras.map((e, i) => (
            <circle key={i} cx={cx(i)} cy={yD(desempeno(e.riego, ref))} r="5" fill="#f5b301" stroke="#fff" strokeWidth="1.5" pointerEvents="none" />
          ))}
          {hover !== null && (
            <Globo
              ancho={W}
              x={cx(hover)}
              y={ARRIBA + 20}
              lineas={[
                barras[hover].nombre,
                `${ref.nombre} ${fmt(ref.total, 1)} mm · Riego ${fmt(barras[hover].riego, 1)} mm`,
                `Desempeño ${fmt(desempeno(barras[hover].riego, ref), 1)} % · ${fmt(barras[hover].horas, 0)} h de riego`,
              ]}
            />
          )}
        </svg>
      </div>
      <div className="flex justify-center gap-4 pb-1.5 text-[10px] text-gray-500">
        <Leyenda color={ref.color} texto={ref.nombre} />
        <Leyenda color="#0b4f6c" texto="Riego" />
        <Leyenda color="#f5b301" texto="Desempeño" />
        <Leyenda color="#ef4444" texto="Límites mínimo y máximo" />
      </div>
    </>
  )
}

/** Fertilizante aplicado por equipo, canal por canal (litros) */
function GraficoFerti() {
  const [hover, setHover] = useState<number | null>(null)
  const col = PLOT / EQUIPOS.length
  const y = (l: number) => ARRIBA + (1 - l / 800) * ALTO
  const cx = (i: number) => IZQ + (i + 0.5) * col
  const ancho = col * 0.3
  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} className="min-h-0 w-full flex-1" onMouseLeave={() => setHover(null)}>
        {[0, 200, 400, 600, 800].map((v) => (
          <g key={v}>
            <line x1={IZQ} x2={IZQ + PLOT} y1={y(v)} y2={y(v)} stroke="#f1f5f9" />
            <text x={IZQ - 8} y={y(v) + 3} fontSize="10" fill="#64748b" textAnchor="end">
              {v}
            </text>
          </g>
        ))}
        <text x={14} y={ARRIBA + ALTO / 2} fontSize="10" fill="#64748b" textAnchor="middle" transform={`rotate(-90 14 ${ARRIBA + ALTO / 2})`}>
          Fertilizante (L)
        </text>
        {EQUIPOS.map((e, i) => {
          let base = 0
          return (
            <g key={e.nombre} onMouseEnter={() => setHover(i)}>
              <rect x={IZQ + i * col} y={ARRIBA} width={col} height={ALTO} fill={hover === i ? '#084d6e' : 'transparent'} fillOpacity={0.05} />
              {e.ferti.map((l, k) => {
                const y0 = y(base)
                base += l
                return l > 0 ? <rect key={k} x={cx(i) - ancho / 2} y={y(base)} width={ancho} height={y0 - y(base)} fill={CANALES[k].color} /> : null
              })}
              <text x={cx(i)} y={H - ABAJO + 18} fontSize="11" fill="#3F4650" textAnchor="middle">
                {e.nombre}
              </text>
            </g>
          )
        })}
        <line x1={IZQ} x2={IZQ + PLOT} y1={ARRIBA + ALTO} y2={ARRIBA + ALTO} stroke="#94a3b8" />
        {hover !== null && (
          <Globo
            ancho={W}
            x={cx(hover)}
            y={ARRIBA + 20}
            lineas={[EQUIPOS[hover].nombre, EQUIPOS[hover].ferti.map((l, k) => `${CANALES[k].nombre} ${fmt(l, 0)} L`).join(' · ')]}
          />
        )}
      </svg>
      <div className="flex justify-center gap-4 pb-1.5 text-[10px] text-gray-500">
        {CANALES.map((c) => (
          <Leyenda key={c.nombre} color={c.color} texto={`Canal ${c.nombre}`} />
        ))}
      </div>
    </>
  )
}

/* ---------- Detalle de un sector ---------- */

// Días con riego en el período y peso de cada riego (suman 8)
const DIAS_RIEGO = [1, 3, 5, 6, 8, 10, 12, 13]
const PESOS = [0.9, 1.1, 1.0, 0.8, 1.2, 1.0, 1.1, 0.9]

/** Riego y horas de cada día del período para un sector */
function diarioDe(b: Barra, dias = DIAS_RIEGO, factor = 1) {
  const riego = ETO.map((_, d) => {
    const k = dias.indexOf(d)
    return k < 0 ? 0 : (b.riego * factor * PESOS[k]) / 8
  })
  return { riego, horas: riego.map((r) => (r ? r * 0.62 : 0)) }
}
// El mismo sector en la temporada pasada (comparativa): otros días de riego y algo menos de agua
const DIAS_RIEGO_ANTERIOR = [0, 2, 4, 7, 9, 11, 13, 14]

/** Vista de detalle (olive_next/app/irrigation/components/charts/DetailSectorChart.tsx) */
function DetalleSector({ barra, referencia, comparando = false }: { barra: Barra; referencia: Referencia; comparando?: boolean }) {
  const { riego, horas } = diarioDe(barra)
  const tarjetas = [
    { titulo: 'Riegos', valor: `${DIAS_RIEGO.length}` },
    { titulo: 'Total regado', valor: `${fmt(barra.riego)} mm` },
    { titulo: 'Riego/ETc', valor: `${fmt((barra.riego / REF_ETC.total) * 100, 0)} %` },
    { titulo: 'Riego/ETo', valor: `${fmt((barra.riego / ETO_PERIODO) * 100, 0)} %` },
    { titulo: 'Riegos en rango', valor: '6', color: 'bg-[#FFF176]/60' },
    { titulo: 'Fuera de rango', valor: '2', color: 'bg-red-50' },
    { titulo: 'Bajo caudal', valor: '1' },
    { titulo: 'Sobre caudal', valor: '1' },
  ]
  const balance = barra.riego - referencia.total
  return (
    <div className="flex min-h-0 flex-1 gap-3 p-3">
      {/* Resumen del período */}
      <div data-guia="riego-resumen" className="flex w-[320px] shrink-0 flex-col rounded-lg bg-white p-3 shadow-md">
        <p className="text-[15px] font-semibold text-[#084d6e]">Resumen del período</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {tarjetas.map((t) => (
            <div key={t.titulo} className={cn('rounded-md border border-slate-200 px-2.5 py-2', t.color)}>
              <p className="text-[11px] text-gray-500">{t.titulo}</p>
              <p className="text-[19px] font-bold leading-tight text-[#212427]">{t.valor}</p>
            </div>
          ))}
        </div>
        <ul className="mt-4 space-y-2.5 text-[12.5px] leading-snug text-[#3F4650]">
          <li>
            Este período se ha regado en total <b className="text-[#084d6e]">{fmt(barra.riego)} mm</b>, distribuido en{' '}
            <b className="text-[#084d6e]">{DIAS_RIEGO.length} riegos</b>.
          </li>
          <li>
            <b className={balance < 0 ? 'text-red-600' : 'text-[#084d6e]'}>{balance < 0 ? 'Déficit hídrico' : 'Exceso hídrico'}</b>:{' '}
            {fmt(barra.riego)} mm regado / {fmt(referencia.total)} mm de {referencia.nombre}.
          </li>
          <li>
            <b>Días sin riego: {DIAS - DIAS_RIEGO.length}</b>
            <span className="block text-[11px] text-gray-500">Días con demanda climática pero sin riego</span>
          </li>
        </ul>
      </div>

      {/* Día a día; en la comparativa, un período arriba del otro */}
      {comparando ? (
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <PeriodoDiario etiqueta="Principal" fechas={`${FECHAS[0]}/2026 - ${FECHAS[DIAS - 1]}/2026`}>
            <GraficoDiario riego={riego} horas={horas} referencia={referencia} alto={300} />
          </PeriodoDiario>
          <PeriodoDiario etiqueta="Comparativa" fechas={`${FECHAS[0]}/2025 - ${FECHAS[DIAS - 1]}/2025`} tinte>
            <GraficoDiario {...diarioDe(barra, DIAS_RIEGO_ANTERIOR, 0.8)} dias={DIAS_RIEGO_ANTERIOR} referencia={referencia} alto={300} />
          </PeriodoDiario>
        </div>
      ) : (
        <div className="flex min-w-0 flex-1 flex-col rounded-lg bg-white p-2 shadow-md">
          <GraficoDiario riego={riego} horas={horas} referencia={referencia} />
        </div>
      )}
    </div>
  )
}

const WD = 900
const HD = 560

/** Un período del detalle en la comparativa, con su etiqueta */
function PeriodoDiario({ etiqueta, fechas, tinte, children }: { etiqueta: string; fechas: string; tinte?: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      className={cn('flex min-h-0 flex-1 flex-col rounded-lg p-2 shadow-md', tinte ? 'bg-[#f2f8fa]' : 'bg-white')}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <p className="text-[11px] text-[#212427]">
        <span className="mr-1.5 rounded-full bg-gray-200 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-gray-600">{etiqueta}</span>
        {fechas}
      </p>
      {children}
    </motion.div>
  )
}

/** ETo, riego y horas de riego por día, con la línea de desempeño de los días regados */
function GraficoDiario({
  riego,
  horas,
  referencia,
  dias = DIAS_RIEGO,
  alto: HD_ = HD,
}: {
  riego: number[]
  horas: number[]
  referencia: Referencia
  dias?: number[]
  alto?: number
}) {
  const REF = referencia.diario
  const [hover, setHover] = useState<number | null>(null)
  const plot = WD - IZQ - DER
  const alto = HD_ - ARRIBA - 30
  const dia = plot / DIAS
  // Escala izquierda según los datos (múltiplo de 4 para marcas redondas)
  const tope = Math.ceil(Math.max(...riego, ...REF, ...horas) / 4) * 4
  const marcas = [0, 1, 2, 3, 4].map((k) => (tope / 4) * k)
  const y = (v: number) => ARRIBA + (1 - v / tope) * alto
  const yD = (p: number) => ARRIBA + (1 - Math.min(p, 200) / 200) * alto
  const cx = (d: number) => IZQ + (d + 0.5) * dia
  const b = dia * 0.22
  // Desempeño de cada riego: lo regado frente a la ETo acumulada desde el riego anterior
  const regados = dias.map((d, k) => {
    const desde = k === 0 ? 0 : dias[k - 1] + 1
    const etoAcum = REF.slice(desde, d + 1).reduce((a, v) => a + v, 0)
    return { d, p: (riego[d] / etoAcum) * 100 }
  })
  const desempenoDia = (d: number) => regados.find((r) => r.d === d)?.p
  return (
    <>
      <svg viewBox={`0 0 ${WD} ${HD_}`} className="min-h-0 w-full flex-1" onMouseLeave={() => setHover(null)}>
        {marcas.map((v) => (
          <g key={v}>
            <line x1={IZQ} x2={IZQ + plot} y1={y(v)} y2={y(v)} stroke="#f1f5f9" />
            <text x={IZQ - 8} y={y(v) + 3} fontSize="9" fill="#64748b" textAnchor="end">
              {fmt(v, 0)}
            </text>
          </g>
        ))}
        {[0, 50, 100, 150, 200].map((v) => (
          <text key={v} x={IZQ + plot + 8} y={yD(v) + 3} fontSize="9" fill="#64748b">
            {v}
          </text>
        ))}
        <text x={14} y={ARRIBA + alto / 2} fontSize="9" fill="#64748b" textAnchor="middle" transform={`rotate(-90 14 ${ARRIBA + alto / 2})`}>
          mm · h
        </text>
        <text x={WD - 12} y={ARRIBA + alto / 2} fontSize="9" fill="#64748b" textAnchor="middle" transform={`rotate(90 ${WD - 12} ${ARRIBA + alto / 2})`}>
          Desempeño (%)
        </text>
        {REF.map((eto, d) => (
          <g key={d} onMouseEnter={() => setHover(d)}>
            <rect x={IZQ + d * dia} y={ARRIBA} width={dia} height={alto} fill={hover === d ? '#084d6e' : 'transparent'} fillOpacity={0.06} />
            <rect x={cx(d) - b * 1.6} y={y(eto)} width={b} height={y(0) - y(eto)} fill={referencia.color} />
            {riego[d] > 0 && <rect x={cx(d) - b * 0.5} y={y(riego[d])} width={b} height={y(0) - y(riego[d])} fill="#0b4f6c" />}
            {horas[d] > 0 && <rect x={cx(d) + b * 0.6} y={y(horas[d])} width={b} height={y(0) - y(horas[d])} fill="#00c1c6" />}
            {(d % 3 === 0 || d === DIAS - 1) && (
              <text x={cx(d)} y={ARRIBA + alto + 14} fontSize="9" fill="#64748b" textAnchor="middle">
                {FECHAS[d]}
              </text>
            )}
          </g>
        ))}
        <line x1={IZQ} x2={IZQ + plot} y1={ARRIBA + alto} y2={ARRIBA + alto} stroke="#94a3b8" />
        <path
          d={regados.map((r, k) => `${k ? 'L' : 'M'}${cx(r.d)},${yD(r.p)}`).join('')}
          fill="none"
          stroke="#fab500"
          strokeWidth="2"
          strokeLinejoin="round"
          pointerEvents="none"
        />
        {regados.map((r) => (
          <circle key={r.d} cx={cx(r.d)} cy={yD(r.p)} r="3.5" fill="#fab500" stroke="#fff" strokeWidth="1.2" pointerEvents="none" />
        ))}
        {hover !== null && (
          <Globo
            ancho={WD}
            x={cx(hover)}
            y={ARRIBA + 6}
            lineas={[
              FECHAS[hover],
              `${referencia.nombre} ${fmt(REF[hover], 1)} mm · Riego ${fmt(riego[hover], 1)} mm · ${fmt(horas[hover], 1)} h`,
              riego[hover] ? `Desempeño ${fmt(desempenoDia(hover) ?? 0, 0)} %` : 'Sin riego',
            ]}
          />
        )}
      </svg>
      <div className="flex justify-center gap-4 pb-0.5 text-[10px] text-gray-500">
        <Leyenda color={referencia.color} texto={referencia.nombre} />
        <Leyenda color="#0b4f6c" texto="Riego" />
        <Leyenda color="#00c1c6" texto="Horas de riego" />
        <Leyenda color="#fab500" texto="Desempeño" />
      </div>
    </>
  )
}

/* ---------- Análisis Inteligente (PRO) ---------- */

/** Informe conceptual del Análisis Inteligente de Riego (olive_next/app/irrigation/components/analisis/equipos) */
function InformeRiego({ referencia, onCerrar }: { referencia: Referencia; onCerrar: () => void }) {
  const filas = EQUIPOS.map((e) => ({ nombre: e.nombre, d: desempeno(e.riego, referencia), riego: e.riego }))
  const enRango = filas.filter((f) => estado(f.d) === 'optimo').length
  const bajo = filas.filter((f) => estado(f.d) === 'bajo')
  const sobre = filas.filter((f) => estado(f.d) === 'sobre')
  const reposicion = (EQUIPOS.reduce((a, e) => a + e.riego * e.ha, 0) / HECTAREAS / referencia.total) * 100
  const kpis = [
    { titulo: 'Equipos en rango', valor: `${enRango} de ${filas.length}`, sub: `entre ${MINIMO} y ${MAXIMO} %`, color: 'text-emerald-600' },
    { titulo: 'Reposición del período', valor: `${fmt(reposicion, 0)} %`, sub: `riego frente a la ${referencia.nombre}`, color: 'text-[#084d6e]' },
    { titulo: 'Bajo el mínimo', valor: bajo.map((f) => f.nombre).join(', ') || '—', sub: bajo.map((f) => `${fmt(f.d, 0)} %`).join(', '), color: 'text-red-600' },
    { titulo: 'Sobre el máximo', valor: sobre.map((f) => f.nombre).join(', ') || '—', sub: sobre.map((f) => `${fmt(f.d, 0)} %`).join(', '), color: 'text-red-600' },
  ]
  const hallazgos = [
    ...bajo.map((f) => ({
      alerta: true,
      texto: `El ${f.nombre} regó ${fmt(f.riego, 0)} mm frente a ${fmt(referencia.total, 1)} mm de ${referencia.nombre}: repuso solo el ${fmt(f.d, 0)} %.`,
    })),
    ...sobre.map((f) => ({
      alerta: true,
      texto: `El ${f.nombre} regó ${fmt(f.riego, 0)} mm: un ${fmt(f.d - 100, 0)} % más de lo que pedía la ${referencia.nombre}.`,
    })),
    { alerta: false, texto: `Los otros ${enRango} equipos se mantuvieron dentro del rango de ${MINIMO} a ${MAXIMO} %.` },
  ]
  return (
    <motion.div className="absolute inset-0 z-[35] flex items-center justify-center bg-black/40 p-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className="w-[900px] overflow-hidden rounded-xl bg-white shadow-2xl"
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div className="flex items-center gap-3 bg-gradient-to-br from-[#8b5cf6] via-[#6366f1] to-[#4f46e5] px-5 py-3.5 text-white">
          <Sparkles className="h-6 w-6" />
          <div className="flex-1">
            <p className="text-base font-bold leading-tight">Análisis Inteligente · Riego</p>
            <p className="text-[11px] leading-tight opacity-90">
              Desempeño y reposición por equipo · {FECHAS[0]}/2026 - {FECHAS[DIAS - 1]}/2026
            </p>
          </div>
          <span className="rounded-full bg-gradient-to-br from-[#ffd24d] via-[#fab500] to-[#b57f00] px-2.5 py-1 text-[10px] font-extrabold tracking-[0.18em] text-[#032f44]">PRO</span>
          <button type="button" onClick={onCerrar} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 pb-6 pt-5">
          <div className="grid grid-cols-4 gap-3">
            {kpis.map((k) => (
              <div key={k.titulo} className="rounded-lg border border-gray-200 px-3 py-2.5">
                <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500">{k.titulo}</p>
                <p className={cn('text-lg font-bold leading-tight', k.color)}>{k.valor}</p>
                <p className="text-[10px] text-gray-400">{k.sub}</p>
              </div>
            ))}
          </div>
          <h3 className="mb-2.5 mt-5 border-l-[3px] border-[#084d6e] pl-2.5 text-[15px] font-bold text-[#084d6e]">1. Resumen</h3>
          <ul className="space-y-2">
            {hallazgos.map((h) => (
              <li key={h.texto} className={cn('flex gap-2.5 rounded-lg px-3 py-2 text-[13px] text-[#3F4650]', h.alerta ? 'bg-red-50' : 'bg-emerald-50')}>
                {h.alerta ? <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" /> : <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />}
                {h.texto}
              </li>
            ))}
          </ul>
          <h3 className="mb-2.5 mt-5 border-l-[3px] border-[#084d6e] pl-2.5 text-[15px] font-bold text-[#084d6e]">2. Desempeño por equipo</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
            {filas.map((f) => (
              <div key={f.nombre} className="flex items-center gap-2 text-[12px] text-[#3F4650]">
                <span className="w-16 shrink-0">{f.nombre}</span>
                <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <span className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${Math.min(100, f.d / 1.8)}%`, background: COLOR_ESTADO[estado(f.d)] }} />
                </span>
                <span className="w-11 text-right font-semibold">{fmt(f.d, 0)} %</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/**
 * Informe conceptual del Análisis Inteligente de un sector, día a día
 * (olive_next/app/irrigation/components/analisis/detalle).
 */
function InformeSector({ barra, referencia, onCerrar }: { barra: Barra; referencia: Referencia; onCerrar: () => void }) {
  const { riego } = diarioDe(barra)
  const reposicion = (barra.riego / referencia.total) * 100
  const sinRiego = DIAS - DIAS_RIEGO.length
  // Días fuera de rango de caudal: uno bajo y uno sobre (coherente con el resumen del detalle)
  const FUERA: Record<number, string> = { 5: 'Bajo caudal', 10: 'Sobre caudal' }
  const kpis = [
    { titulo: 'Riegos en rango', valor: `${DIAS_RIEGO.length - 2} de ${DIAS_RIEGO.length}`, color: 'text-emerald-600' },
    { titulo: `Riego/${referencia.nombre}`, valor: `${fmt(reposicion, 0)} %`, color: estado(reposicion) === 'optimo' ? 'text-emerald-600' : 'text-red-600' },
    { titulo: 'Fuera de rango', valor: '2 riegos', color: 'text-red-600' },
    { titulo: 'Días sin riego', valor: `${sinRiego}`, color: 'text-[#084d6e]' },
  ]
  const hallazgos = [
    {
      alerta: estado(reposicion) !== 'optimo',
      texto:
        reposicion > 100
          ? `Exceso hídrico: regó ${fmt(barra.riego, 0)} mm frente a ${fmt(referencia.total, 1)} mm de ${referencia.nombre} (${fmt(reposicion, 0)} %).`
          : `Déficit hídrico: regó ${fmt(barra.riego, 0)} mm frente a ${fmt(referencia.total, 1)} mm de ${referencia.nombre} (${fmt(reposicion, 0)} %).`,
    },
    { alerta: true, texto: `Dos riegos con el caudal fuera de rango: bajo caudal el ${FECHAS[5]} y sobre caudal el ${FECHAS[10]}.` },
    { alerta: false, texto: `${sinRiego} días con demanda climática pero sin riego, repartidos en el período.` },
  ]
  return (
    <motion.div className="absolute inset-0 z-[40] flex items-center justify-center bg-black/40 p-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className="w-[900px] overflow-hidden rounded-xl bg-white shadow-2xl"
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div className="flex items-center gap-3 bg-gradient-to-br from-[#8b5cf6] via-[#6366f1] to-[#4f46e5] px-5 py-3.5 text-white">
          <Sparkles className="h-6 w-6" />
          <div className="flex-1">
            <p className="text-base font-bold leading-tight">Análisis Inteligente · {barra.nombre}</p>
            <p className="text-[11px] leading-tight opacity-90">
              Comportamiento hidráulico y balance hídrico, día a día · {FECHAS[0]}/2026 - {FECHAS[DIAS - 1]}/2026
            </p>
          </div>
          <span className="rounded-full bg-gradient-to-br from-[#ffd24d] via-[#fab500] to-[#b57f00] px-2.5 py-1 text-[10px] font-extrabold tracking-[0.18em] text-[#032f44]">PRO</span>
          <button type="button" onClick={onCerrar} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 pb-6 pt-5">
          <div className="grid grid-cols-4 gap-3">
            {kpis.map((k) => (
              <div key={k.titulo} className="rounded-lg border border-gray-200 px-3 py-2.5">
                <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500">{k.titulo}</p>
                <p className={cn('text-lg font-bold leading-tight', k.color)}>{k.valor}</p>
              </div>
            ))}
          </div>
          <h3 className="mb-2.5 mt-5 border-l-[3px] border-[#084d6e] pl-2.5 text-[15px] font-bold text-[#084d6e]">1. Resumen</h3>
          <ul className="space-y-2">
            {hallazgos.map((h) => (
              <li key={h.texto} className={cn('flex gap-2.5 rounded-lg px-3 py-2 text-[13px] text-[#3F4650]', h.alerta ? 'bg-red-50' : 'bg-sky-50')}>
                {h.alerta ? <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" /> : <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />}
                {h.texto}
              </li>
            ))}
          </ul>
          <h3 className="mb-2.5 mt-5 border-l-[3px] border-[#084d6e] pl-2.5 text-[15px] font-bold text-[#084d6e]">2. Día a día</h3>
          <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1">
            {riego.map((r, d) => {
              const fuera = FUERA[d]
              const color = !r ? 'bg-gray-100 text-gray-400' : fuera ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
              return (
                <div key={d} className={cn('rounded-md px-0.5 py-1.5 text-center', color)} title={fuera ?? (r ? 'En rango' : 'Sin riego')}>
                  <p className="text-[9px] font-semibold">{FECHAS[d]}</p>
                  <p className="text-[10px]">{r ? `${fmt(r, 1)}` : '—'}</p>
                </div>
              )
            })}
          </div>
          <div className="mt-2 flex gap-4 text-[10px] text-gray-500">
            <Leyenda color="#a7f3d0" texto="Riego en rango" />
            <Leyenda color="#fecaca" texto="Fuera de rango de caudal" />
            <Leyenda color="#e5e7eb" texto="Sin riego" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
