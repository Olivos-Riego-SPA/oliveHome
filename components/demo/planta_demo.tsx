'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, ChartNoAxesGantt, ChartSpline, Clock, FileSpreadsheet, Map as IconoMapa, PenLine, Radio, Sprout, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CabeceraDemo, Ola } from './cabecera_demo'
import {
  ALTO_H,
  ALTO_PLOT,
  ANCHO,
  ARRIBA,
  BotonRedondo,
  DIAS,
  EjeFechas,
  ETO,
  FECHAS,
  Globo,
  GraficoBalance,
  IZQ,
  Leyenda,
  MapaSectores,
  PUNTOS,
  RIEGO_SECTOR,
  Selector,
  Simbologia,
  TRANSICION,
  fraccion,
  plotDe,
  useCursorAuto,
  type PropsGrafico,
} from './modulo_comun'

/**
 * Módulo Planta de Olive+ (escritorio), a grandes rasgos. Copia la distribución de
 * olive_next/app/plant/page.tsx: a la izquierda el selector de campo y el mapa de estrés (o el
 * resumen de sectores); a la derecha el potencial hídrico diario y el balance hídrico con la ETc.
 *
 * Es el mismo Fundo Demo que en Suelo, con el mismo riego: el Sector 16 está bien y el 13 —seco en
 * Suelo— cruza la línea de riego.
 *
 * Elementos que la guía puede enfocar: planta-campo, planta-mapa, planta-graficos, planta-sector,
 * planta-resumen-boton y planta-resumen.
 */

export type SectorPlanta = '13' | '16'

// Líneas de referencia del potencial hídrico (bar): sobre la de base hay exceso de agua; bajo la
// de riego, la planta está pidiendo agua
const LINEA_BASE = -3.5
const LINEA_RIEGO = -8
const MARGEN_LEVE = 1.3

type Estres = 'saturacion' | 'adecuado' | 'leve' | 'moderado'
const COLOR_ESTRES: Record<Estres, string> = {
  saturacion: '#2563eb',
  adecuado: '#16a34a',
  leve: '#ca8a04',
  moderado: '#dc2626',
}
const NOMBRE_ESTRES: Record<Estres, string> = {
  saturacion: 'Estrés por saturación',
  adecuado: 'Estrés adecuado',
  leve: 'Estrés leve',
  moderado: 'Estrés moderado',
}
function estres(v: number): Estres {
  if (v > LINEA_BASE) return 'saturacion'
  if (v >= LINEA_RIEGO + MARGEN_LEVE) return 'adecuado'
  if (v >= LINEA_RIEGO) return 'leve'
  return 'moderado'
}

/** Potencial hídrico (bar): baja día a día y se recupera con cada riego (día, recuperación) */
function potencial(inicio: number, baja: number, riegos: [number, number][]) {
  const crudo = Array.from({ length: PUNTOS }, (_, i) => {
    let v = inicio - (i / 8) * baja
    for (const [dia, alza] of riegos) if (i >= dia * 8) v += alza * (1 - Math.exp(-(i - dia * 8) / 4))
    return v
  })
  // Suavizado: en Olive+ es una curva diaria
  return crudo.map((_, i) => {
    const ventana = crudo.slice(Math.max(0, i - 6), i + 7)
    return ventana.reduce((a, b) => a + b, 0) / ventana.length
  })
}

const DATOS: Record<SectorPlanta, { potencial: number[]; riego: number[] }> = {
  '16': { potencial: potencial(-4.3, 0.3, [[3, 1.2], [7, 1.2], [11, 1.2]]), riego: RIEGO_SECTOR['16'] },
  '13': { potencial: potencial(-5.2, 0.45, [[5, 0.6]]), riego: RIEGO_SECTOR['13'] },
}

// ETc: la ETo ajustada al cultivo (Kc fijo para la demo)
const ETC_REF = { nombre: 'ETc', valores: ETO.map((v) => Math.round(v * 0.85 * 10) / 10), color: '#109a4c' }

// Último valor de cada sector (resumen y colores del mapa)
const ULTIMO: Record<string, number> = {
  '12': -5.0,
  '13': DATOS['13'].potencial[PUNTOS - 1],
  '14': -2.7,
  '15': -7.4,
  '16': DATOS['16'].potencial[PUNTOS - 1],
}
const COLORES_MAPA = Object.fromEntries(Object.entries(ULTIMO).map(([id, v]) => [id, COLOR_ESTRES[estres(v)]]))
const SIMBOLOGIA = (['saturacion', 'adecuado', 'leve', 'moderado'] as Estres[]).map((e) => ({
  color: COLOR_ESTRES[e],
  nombre: NOMBRE_ESTRES[e],
}))

export default function PlantaDemo({
  enfoque,
  sector = '16',
  esperando = null,
  resumenAbierto = false,
  onAccion,
  onInicio,
}: {
  enfoque?: string | null
  sector?: SectorPlanta
  /** Elemento que la guía espera que el usuario toque (`data-guia`); solo ese responde al clic */
  esperando?: string | null
  /** El panel izquierdo muestra el resumen de sectores en vez del mapa */
  resumenAbierto?: boolean
  onAccion?: (accion: string) => void
  onInicio?: () => void
}) {
  const [cursorUsuario, setCursorUsuario] = useState<number | null>(null)
  const cursorAuto = useCursorAuto(enfoque === 'planta-graficos' && cursorUsuario === null)
  const cursor = cursorUsuario ?? cursorAuto
  const datos = DATOS[sector]

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#F5F5F7] font-sans">
      <CabeceraDemo variante="modulo" onLogo={onInicio} />
      <Ola />

      <motion.main
        className="relative z-[2] flex h-[calc(100%-56px)] w-full gap-2 p-4 pt-5"
        initial="oculto"
        animate="visible"
        variants={{ oculto: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } }}
      >
        {/* Izquierda: campo, período y mapa o resumen */}
        <motion.div
          className="flex w-1/3 flex-col gap-2"
          variants={{ oculto: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="rounded-lg bg-white p-2 shadow-md">
            <div className="flex items-center justify-between gap-2">
              <Selector data-guia="planta-campo" texto="Fundo Demo" className="w-52" />
              <div className="flex gap-1.5">
                <BotonRedondo className="bg-[#109a4c] text-[11px] font-bold">ETc</BotonRedondo>
                <BotonRedondo className="bg-[#1d6f42]">
                  <FileSpreadsheet className="h-[18px] w-[18px]" />
                </BotonRedondo>
                <BotonRedondo className="bg-[#2a7aa0]">
                  <ChartNoAxesGantt className="h-[18px] w-[18px]" />
                </BotonRedondo>
                <BotonRedondo className="bg-[#084d6e]">
                  <CalendarDays className="h-[18px] w-[18px]" />
                </BotonRedondo>
              </div>
            </div>
            <p className="pb-1 pr-2 pt-5 text-right text-sm text-[#212427]">
              Período entre {FECHAS[0]}/2026 y {FECHAS[DIAS - 1]}/2026
            </p>
          </div>

          <div className="flex min-h-0 flex-1 flex-col rounded-lg bg-white shadow-md" data-guia="planta-mapa">
            <div className="flex items-center justify-between p-2">
              <Selector texto={`Sector ${sector}`} className="w-52" />
              <div className="flex gap-1.5">
                <span className={cn('grid h-9 w-9 place-items-center rounded-full', resumenAbierto ? 'bg-gray-100 text-gray-500' : 'bg-[#084d6e] text-white')}>
                  <IconoMapa className="h-4 w-4" />
                </span>
                <span
                  data-guia="planta-resumen-boton"
                  onClick={esperando === 'planta-resumen-boton' ? () => onAccion?.('planta-resumen-boton') : undefined}
                  className={cn(
                    'grid h-9 w-9 place-items-center rounded-full',
                    resumenAbierto ? 'bg-[#084d6e] text-white' : 'bg-gray-100 text-gray-500',
                    esperando === 'planta-resumen-boton' && 'cursor-pointer transition-transform hover:scale-110',
                  )}
                >
                  <ChartNoAxesGantt className="h-4 w-4" />
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              {resumenAbierto ? (
                <ResumenSectores key="resumen" sector={sector} />
              ) : (
                <motion.div key="mapa" className="flex min-h-0 flex-1 flex-col" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <MapaSectores
                    seleccionado={sector}
                    colores={COLORES_MAPA}
                    objetivo={{ id: '13', guia: 'planta-sector' }}
                    clicable={esperando === 'planta-sector'}
                    onSector={() => onAccion?.('planta-sector')}
                    sensor={{ icono: <Sprout className="h-3 w-3" />, color: '#109a4c' }}
                  >
                    <div className="absolute right-2 top-2 rounded-lg bg-white p-1.5 shadow-md">
                      <span className="flex items-center gap-1.5 px-3 py-1 text-[11px] text-gray-500">
                        <PenLine className="h-3 w-3" /> Registro manual
                      </span>
                      <span className="mt-1 flex items-center gap-1.5 rounded-full bg-[#109a4c] px-3 py-1 text-[11px] text-white">
                        <Radio className="h-3 w-3" /> Microtensiómetro
                      </span>
                    </div>
                    <Simbologia items={SIMBOLOGIA} />
                  </MapaSectores>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Derecha: potencial hídrico y balance, sincronizados */}
        <motion.div
          className="flex w-2/3 flex-col rounded-lg bg-white shadow-md"
          data-guia="planta-graficos"
          variants={{ oculto: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="flex justify-end gap-1 px-3 pt-2 text-[11px]">
            <span className="flex items-center gap-1 rounded-full bg-[#084d6e] px-3 py-1 text-white">
              <ChartSpline className="h-3 w-3" /> Gráficos
            </span>
            <span className="flex items-center gap-1 px-3 py-1 text-gray-500">
              <ChartNoAxesGantt className="h-3 w-3" /> Resumen
            </span>
          </div>
          <p className="text-center text-[13px] font-semibold text-[#212427]">Potencial hídrico diario</p>
          <GraficoPotencial potencial={datos.potencial} cursor={cursor} onCursor={setCursorUsuario} />
          <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500">
            <Leyenda color="#22c55e" texto="Microtensiómetro" />
            <Leyenda color="#1d4ed8" texto="Línea de base" />
            <Leyenda color="#ef4444" texto="Línea de riego" />
          </div>
          <p className="mt-2 text-center text-[13px] font-semibold text-[#212427]">Balance hídrico</p>
          <GraficoBalance riego={datos.riego} referencia={ETC_REF} cursor={cursor} onCursor={setCursorUsuario} />
          <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500">
            <Leyenda color="#A9BFDB" texto="Precipitación" />
            <Leyenda color="#084d6e" texto="Riego" />
            <Leyenda color="#109a4c" texto="ETc" />
          </div>
          <div className="flex justify-center gap-1 py-1.5 text-[11px]">
            <span className="flex items-center gap-1 rounded-full bg-[#109a4c] px-3 py-1 text-white">
              <CalendarDays className="h-3 w-3" /> Diario
            </span>
            <span className="flex items-center gap-1 px-3 py-1 text-gray-500">
              <Clock className="h-3 w-3" /> Horario
            </span>
          </div>
        </motion.div>
      </motion.main>
    </div>
  )
}

/* ---------- Gráfico ---------- */

const Y_MIN = -12
const Y_MAX = -1

function GraficoPotencial({ potencial, cursor, onCursor, ancho = ANCHO }: PropsGrafico & { potencial: number[] }) {
  const PLOT = plotDe(ancho)
  const y = (v: number) => ARRIBA + (1 - (v - Y_MIN) / (Y_MAX - Y_MIN)) * ALTO_PLOT
  const x = (i: number) => IZQ + (i / (PUNTOS - 1)) * PLOT
  const linea = potencial.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('')
  const i = cursor === null ? null : Math.round(cursor * (PUNTOS - 1))

  return (
    <svg
      viewBox={`0 0 ${ancho} ${ALTO_H}`}
      className="min-h-0 w-full flex-1"
      onMouseMove={(e) => onCursor(fraccion(e, ancho))}
      onMouseLeave={() => onCursor(null)}
    >
      {[-2, -4, -6, -8, -10].map((v) => (
        <g key={v}>
          <line x1={IZQ} x2={IZQ + PLOT} y1={y(v)} y2={y(v)} stroke="#f1f5f9" strokeWidth="0.8" />
          <text x={IZQ - 6} y={y(v) + 3} fontSize="8" fill="#64748b" textAnchor="end">
            {v}
          </text>
        </g>
      ))}
      <text x={10} y={ARRIBA + ALTO_PLOT / 2} fontSize="8" fill="#64748b" textAnchor="middle" transform={`rotate(-90 10 ${ARRIBA + ALTO_PLOT / 2})`}>
        (bar)
      </text>
      <line x1={IZQ} x2={IZQ} y1={ARRIBA} y2={ARRIBA + ALTO_PLOT} stroke="#94a3b8" strokeWidth="0.8" />
      <line x1={IZQ} x2={IZQ + PLOT} y1={ARRIBA + ALTO_PLOT} y2={ARRIBA + ALTO_PLOT} stroke="#94a3b8" strokeWidth="0.8" />
      <EjeFechas y={ARRIBA + ALTO_PLOT} plot={PLOT} />

      {/* Línea de base y línea de riego del sector */}
      <line x1={IZQ} x2={IZQ + PLOT} y1={y(LINEA_BASE)} y2={y(LINEA_BASE)} stroke="#1d4ed8" strokeWidth="1.6" />
      <line x1={IZQ} x2={IZQ + PLOT} y1={y(LINEA_RIEGO)} y2={y(LINEA_RIEGO)} stroke="#ef4444" strokeWidth="1.6" />

      <motion.path initial={false} animate={{ d: linea }} transition={TRANSICION} fill="none" stroke="#22c55e" strokeWidth="2" strokeLinejoin="round" />

      {i !== null && (
        <g>
          <line x1={x(i)} x2={x(i)} y1={ARRIBA} y2={ARRIBA + ALTO_PLOT} stroke="#084d6e" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={x(i)} cy={y(potencial[i])} r="4" fill="#22c55e" stroke="#fff" strokeWidth="1.5" />
          <Globo
            ancho={ancho}
            x={x(i)}
            y={ARRIBA + 4}
            lineas={[
              FECHAS[Math.min(DIAS - 1, Math.floor(i / 8))],
              `${potencial[i].toFixed(1)} bar · ${NOMBRE_ESTRES[estres(potencial[i])]}`,
            ]}
          />
        </g>
      )}
    </svg>
  )
}

/* ---------- Resumen de sectores ---------- */

// Escala de la barra: de -14 bar (izquierda, más estrés) a 0 (derecha, más agua)
const ESCALA_MIN = -14
const pos = (v: number) => `${((v - ESCALA_MIN) / -ESCALA_MIN) * 100}%`
const TRAMOS: { desde: number; hasta: number; color: string }[] = [
  { desde: ESCALA_MIN, hasta: LINEA_RIEGO, color: COLOR_ESTRES.moderado },
  { desde: LINEA_RIEGO, hasta: LINEA_RIEGO + MARGEN_LEVE, color: COLOR_ESTRES.leve },
  { desde: LINEA_RIEGO + MARGEN_LEVE, hasta: LINEA_BASE, color: COLOR_ESTRES.adecuado },
  { desde: LINEA_BASE, hasta: 0, color: COLOR_ESTRES.saturacion },
]

/** Lista de sectores con su barra de estrés (olive_next/app/plant/components/charts/resumenPotencialHidrico.tsx) */
function ResumenSectores({ sector }: { sector: string }) {
  return (
    <motion.div
      data-guia="planta-resumen"
      className="mx-2 mb-2 min-h-0 flex-1 space-y-1.5 overflow-hidden"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-center text-[12px] font-semibold text-[#212427]">Resumen</p>
      {Object.entries(ULTIMO).map(([id, v]) => {
        const e = estres(v)
        return (
          <div key={id} className={cn('rounded-lg border px-2.5 py-1.5', id === sector ? 'border-[#084d6e]' : 'border-gray-200')}>
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1 font-semibold text-[#212427]">
                Sector {id}
                {(e === 'moderado' || e === 'saturacion') && <TriangleAlert className="h-3 w-3" style={{ color: COLOR_ESTRES[e] }} />}
              </span>
              <span className="text-[9px] text-gray-500">
                LB <b className="text-[#1d4ed8]">{LINEA_BASE.toFixed(2)}</b> · LR <b className="text-[#ef4444]">{LINEA_RIEGO.toFixed(2)}</b>
              </span>
            </div>
            <div className="mt-0.5 flex items-center justify-between text-[9px] text-gray-500">
              <span className="flex items-center gap-1">
                <Radio className="h-2.5 w-2.5" /> MICROTEN. · {FECHAS[DIAS - 1]}/2026
              </span>
              <span className="text-[13px] font-bold" style={{ color: COLOR_ESTRES[e] }}>
                {v.toFixed(2)} <span className="text-[9px] font-normal text-gray-500">bar</span>
              </span>
            </div>
            <div className="relative mt-1 flex h-1.5 overflow-visible rounded-full">
              {TRAMOS.map((t) => (
                <span key={t.desde} className="h-full first:rounded-l-full last:rounded-r-full" style={{ width: `${((t.hasta - t.desde) / -ESCALA_MIN) * 100}%`, background: t.color }} />
              ))}
              <span
                className="absolute -top-1.5 h-0 w-0 -translate-x-1/2 border-x-[4px] border-t-[6px] border-x-transparent border-t-[#16191D]"
                style={{ left: pos(Math.max(ESCALA_MIN, Math.min(0, v))) }}
              />
            </div>
          </div>
        )
      })}
    </motion.div>
  )
}
