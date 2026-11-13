'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ChartColumn,
  ChartLine,
  ChevronDown,
  Database,
  Droplets,
  Expand,
  FileSpreadsheet,
  Gauge,
  LayoutGrid,
  List,
  Ruler,
  Waves,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CabeceraDemo, Ola } from './cabecera_demo'
import {
  ANCHO,
  ARRIBA,
  BotonRedondo,
  DIAS,
  EjeFechas,
  FECHAS,
  Globo,
  IZQ,
  Leyenda,
  MapaSectores,
  SECTORES,
  Selector,
  fraccion,
  plotDe,
  useCursorAuto,
  type PropsGrafico,
} from './modulo_comun'

/**
 * Módulo Pozo de Olive+ (escritorio), a grandes rasgos. Copia la distribución de
 * olive_next/app/watersources/page.tsx: a la izquierda el selector de campo y el mapa con los pozos;
 * a la derecha la pestaña Pozo con el "Resumen de Pozos" en tarjetas
 * (components/pozo/cardPozo.tsx). Solo se muestra la pestaña de pozos.
 *
 * Al tocar el detalle del Pozo Norte, el listado se cambia por su detalle (components/pozo/pozoDetail.tsx):
 * indicadores de la última medición, nivel freático y caudal, volumen acumulado y el botón de envíos DGA.
 *
 * Elementos que la guía puede enfocar: pozo-mapa, pozo-listado, pozo-tarjeta, pozo-dga,
 * pozo-detalle-boton, pozo-indicadores, pozo-graficos y pozo-dga-detalle.
 */

type Pozo = {
  nombre: string
  codigoDga?: string
  /** Nivel freático: metros desde la superficie hasta el agua */
  nivel: number
  profundidad: number
  /** l/s */
  caudal: number
  volumen: number
  /** Posición en el mapa (viewBox 400×470) */
  punto: [number, number]
  /** Horas de bombeo en la última semana: [inicio, duración] en horas desde el inicio */
  bombeos: [number, number][]
}

// Pozos ficticios del Fundo Demo
const POZOS: Pozo[] = [
  {
    nombre: 'Pozo Norte',
    codigoDga: 'OB-0000-0001',
    nivel: 12.4,
    profundidad: 60,
    caudal: 18.5,
    volumen: 48320,
    punto: [118, 70],
    bombeos: [[8, 10], [32, 10], [56, 10], [80, 12], [104, 10], [128, 10], [152, 12]],
  },
  {
    nombre: 'Pozo Sur',
    codigoDga: 'OB-0000-0002',
    nivel: 9.8,
    profundidad: 45,
    caudal: 0,
    volumen: 31905,
    punto: [250, 420],
    bombeos: [[20, 14], [68, 14], [116, 14]],
  },
  {
    nombre: 'Noria El Bajo',
    nivel: 2.3,
    profundidad: 7.7,
    caudal: 0,
    volumen: 1693,
    punto: [60, 300],
    bombeos: [[10, 3], [58, 3], [106, 2], [140, 3]],
  },
  {
    nombre: 'Noria Bodega',
    nivel: 0.9,
    profundidad: 5.5,
    caudal: 6.2,
    volumen: 12480,
    punto: [300, 230],
    bombeos: [[4, 2], [18, 2], [40, 3], [62, 2], [90, 2], [110, 3], [134, 2], [158, 4]],
  },
  {
    nombre: 'Pozo Packing',
    nivel: 7.1,
    profundidad: 38,
    caudal: 0,
    volumen: 9870,
    punto: [345, 120],
    bombeos: [[30, 6], [100, 6]],
  },
]

// En el mapa los sectores van neutros: aquí lo importante son los pozos
const COLORES_NEUTROS = Object.fromEntries(SECTORES.map((s) => [s.id, 'rgba(255,255,255,0.35)']))

const fmt = (n: number, dec = 0) => n.toLocaleString('es-CL', { minimumFractionDigits: dec, maximumFractionDigits: dec })

export default function PozoDemo({
  enfoque,
  esperando = null,
  detalleAbierto = false,
  onAccion,
  onInicio,
}: {
  enfoque?: string | null
  /** Elemento que la guía espera que el usuario toque (`data-guia`); solo ese responde al clic */
  esperando?: string | null
  /** El panel derecho muestra el detalle del Pozo Norte en vez del listado */
  detalleAbierto?: boolean
  onAccion?: (accion: string) => void
  onInicio?: () => void
}) {
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
        {/* Izquierda: campo y mapa con los pozos */}
        <motion.div
          className="flex w-1/3 flex-col gap-2"
          variants={{ oculto: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="h-[118px] rounded-lg bg-white p-2 shadow-md">
            <div className="flex items-center justify-between gap-2">
              <Selector texto="Fundo Demo" className="w-52" />
              <BotonRedondo className="bg-[#1d6f42]">
                <FileSpreadsheet className="h-[18px] w-[18px]" />
              </BotonRedondo>
            </div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col rounded-lg bg-white pt-2 shadow-md" data-guia="pozo-mapa">
            <MapaSectores colores={COLORES_NEUTROS}>
              {POZOS.map((p) => (
                <span
                  key={p.nombre}
                  title={p.nombre}
                  className="absolute -ml-3.5 -mt-3.5 grid h-7 w-7 place-items-center rounded-lg bg-[#1d6fd8] text-white shadow-md ring-2 ring-white"
                  style={{ left: `${(p.punto[0] / 400) * 100}%`, top: `${(p.punto[1] / 470) * 100}%` }}
                >
                  <IconoPozo className="h-4 w-4" />
                </span>
              ))}
            </MapaSectores>
          </div>
        </motion.div>

        {/* Derecha: pestaña Pozo con el resumen en tarjetas */}
        <motion.div
          className="flex w-2/3 flex-col"
          variants={{ oculto: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="flex">
            <span className="flex items-center gap-1.5 rounded-t-lg bg-white px-6 py-2 text-[13px] font-semibold text-[#212427]">
              <IconoPozo className="h-4 w-4 text-[#084d6e]" /> Pozo
            </span>
          </div>
          <div className="flex min-h-0 flex-1 flex-col rounded-b-lg rounded-tr-lg bg-white shadow-md">
            <AnimatePresence mode="wait" initial={false}>
              {detalleAbierto ? (
                <DetallePozo key="detalle" pozo={POZOS[0]} enfoque={enfoque} />
              ) : (
            <motion.div key="listado" className="flex min-h-0 flex-1 flex-col" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="flex items-start justify-between px-4 pb-2 pt-3">
              <div>
                <p className="text-[17px] font-semibold text-[#212427]">
                  Resumen de Pozos <span className="text-[12px] font-normal text-gray-500">Última semana</span>
                </p>
                <p className="text-[10px] text-gray-500">Total de pozos: {POZOS.length}</p>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-[#212427]">
                Orden
                <span className="flex items-center gap-1 rounded border border-gray-300 px-2 py-0.5">
                  Alfabético <ChevronDown className="h-3 w-3" />
                </span>
                <span className="ml-2">Modo de vista</span>
                <span className="grid h-7 w-7 place-items-center rounded border-2 border-[#084d6e] text-[#084d6e]">
                  <LayoutGrid className="h-4 w-4" />
                </span>
                <span className="grid h-7 w-7 place-items-center text-gray-500">
                  <List className="h-4 w-4" />
                </span>
              </div>
            </div>

            <div data-guia="pozo-listado" className="mx-2 mb-2 grid min-h-0 flex-1 auto-rows-max grid-cols-2 content-start gap-3 overflow-hidden px-1 pt-1">
              {POZOS.map((p, i) => (
                <TarjetaPozo
                  key={p.nombre}
                  pozo={p}
                  principal={i === 0}
                  onDetalle={i === 0 && esperando === 'pozo-detalle-boton' ? () => onAccion?.('pozo-detalle-boton') : undefined}
                />
              ))}
            </div>
            </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.main>
    </div>
  )
}

/** Tarjeta de un pozo (olive_next/app/watersources/components/pozo/cardPozo.tsx) */
function TarjetaPozo({ pozo, principal, onDetalle }: { pozo: Pozo; principal: boolean; onDetalle?: () => void }) {
  const columna = ((pozo.profundidad - pozo.nivel) / pozo.profundidad) * 100
  return (
    <div data-guia={principal ? 'pozo-tarjeta' : undefined} className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
      <div className="flex items-start justify-between border-b border-gray-100 px-3 py-2">
        <div>
          <p className="text-[14px] font-semibold text-[#212427]">
            <span className="border-b border-[#212427] pb-0.5">{pozo.nombre}</span>
            {pozo.codigoDga && <span className="ml-2 text-[10px] font-normal text-gray-400">({pozo.codigoDga})</span>}
          </p>
          <p className="mt-0.5 text-[10px] text-gray-400">Campo: Fundo Demo</p>
          <span className="mt-1 inline-block rounded-full bg-[#22c55e] px-2 py-0.5 text-[10px] font-bold text-white">OK</span>
        </div>
        <div className="flex gap-1.5">
          <span
            data-guia={principal ? 'pozo-detalle-boton' : undefined}
            onClick={onDetalle}
            className={cn(
              'grid h-7 w-7 place-items-center rounded-full bg-[#084d6e] text-white',
              onDetalle && 'cursor-pointer transition-transform hover:scale-110',
            )}
          >
            <Expand className="h-3.5 w-3.5" />
          </span>
          {pozo.codigoDga && (
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#16a34a] text-[8px] font-bold text-white">DGA</span>
          )}
        </div>
      </div>

      <div className="flex">
        {/* Columna de agua del pozo respecto de su profundidad */}
        <div className="flex w-[52px] shrink-0 justify-center border-r border-slate-200 py-2.5">
          <div className="relative h-[120px] w-4 overflow-hidden rounded-full border-2 border-[#3b9be8] bg-[#eaf4fd]">
            <motion.div
              className="absolute inset-x-0 bottom-0 bg-gradient-to-b from-[#38bdf8] to-[#0284c7]"
              initial={{ height: 0 }}
              animate={{ height: `${columna}%` }}
              transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 px-3 py-2">
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <Dato icono={<Waves className="h-3.5 w-3.5 text-[#0ea5e9]" />} etiqueta="Nivel F." valor={`${fmt(pozo.nivel, 2)} m`} />
            <Dato icono={<Ruler className="h-3.5 w-3.5 text-[#6366f1]" />} etiqueta="Profundidad" valor={`${fmt(pozo.profundidad)} m`} />
            <Dato
              icono={<Gauge className="h-3.5 w-3.5 text-[#10b981]" />}
              etiqueta="Caudal"
              valor={`${fmt(pozo.caudal, 1)} l/s`}
              extra={`(${fmt(pozo.caudal * 3.6, 1)} m³/h)`}
            />
            <Dato icono={<Database className="h-3.5 w-3.5 text-[#d97706]" />} etiqueta="Volumen total" valor={`${fmt(pozo.volumen)} m³`} />
          </div>
          <p className="mt-1.5 text-[9px] text-gray-400">Tendencia de nivel y caudal, últimos 7 días</p>
          <Tendencia pozo={pozo} />
          <div className="mt-1 flex justify-center gap-3 text-[8px] text-gray-500">
            <span className="flex items-center gap-1">
              <span className="h-[2px] w-4 bg-[#34695f]" /> Nivel freático
            </span>
            <span className="flex items-center gap-1">
              <span className="h-[2px] w-4 bg-[#00c1c6]" /> Caudal
            </span>
          </div>
        </div>
      </div>

      <div
        data-guia={principal ? 'pozo-dga' : undefined}
        className="mx-3 mb-2.5 rounded bg-gray-100 px-2.5 py-1.5 text-[10px] text-gray-500"
      >
        {pozo.codigoDga ? (
          <>
            <span className="font-medium">Último envío DGA:</span>{' '}
            <span className="font-semibold text-[#16a34a]">{FECHAS[DIAS - 1]}/2026 15:00 (Exitoso)</span>
          </>
        ) : (
          <span className="font-medium">Pozo no reporta DGA</span>
        )}
      </div>
    </div>
  )
}

function Dato({ icono, etiqueta, valor, extra }: { icono: React.ReactNode; etiqueta: string; valor: string; extra?: string }) {
  return (
    <div className="flex gap-1.5">
      <span className="mt-0.5">{icono}</span>
      <div>
        <p className="text-[9px] uppercase leading-tight text-gray-400">{etiqueta}</p>
        <p className="text-[13px] font-bold leading-tight text-[#212427]">
          {valor} {extra && <span className="text-[9px] font-normal text-gray-500">{extra}</span>}
        </p>
      </div>
    </div>
  )
}

/** Mini gráfico: el caudal sube cuando el pozo bombea y el nivel baja un poco */
function Tendencia({ pozo }: { pozo: Pozo }) {
  const horas = 168
  const W = 300
  const H = 40
  const bombeando = (h: number) => pozo.bombeos.some(([ini, dur]) => h >= ini && h < ini + dur)
  const caudal = Array.from({ length: horas }, (_, h) => (bombeando(h) ? 1 : 0))
  const nivel = Array.from({ length: horas }, (_, h) => {
    // El nivel baja mientras bombea y se recupera de a poco
    let baja = 0
    for (const [ini, dur] of pozo.bombeos) {
      if (h >= ini && h < ini + dur) baja = Math.max(baja, Math.min(1, (h - ini) / 3))
      else if (h >= ini + dur) baja = Math.max(baja, Math.exp(-(h - ini - dur) / 2.5))
    }
    return baja
  })
  const x = (h: number) => (h / (horas - 1)) * W
  const path = (serie: number[], base: number, alto: number) =>
    serie.map((v, h) => `${h ? 'L' : 'M'}${x(h).toFixed(1)},${(base - v * alto).toFixed(1)}`).join('')
  return (
    <div className="mt-0.5 h-10 w-full rounded-md bg-slate-100">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-full w-full">
        <path d={path(caudal, H - 4, 26)} fill="none" stroke="#00c1c6" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
        <path d={path(nivel.map((v) => -v), 12, 5)} fill="none" stroke="#34695f" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  )
}

/** Ícono de pozo con bomba, al estilo de los marcadores de Olive+ */
function IconoPozo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn(className)}>
      <rect x="5" y="3" width="14" height="6" rx="1" />
      <path d="M8 9v12M16 9v12M8 14h8M8 18h8" />
    </svg>
  )
}

/* ---------- Detalle del pozo ---------- */

// Caudal permitido del Pozo Norte (l/s): la línea roja del gráfico de caudal
const CAUDAL_PERMITIDO = 25
const HORAS = DIAS * 24

/** Bombeo diario del Pozo Norte en el período: de 8 a 18 h (algunos días hasta las 20) */
const BOMBEA = Array.from({ length: HORAS }, (_, h) => {
  const dia = Math.floor(h / 24)
  const hora = h % 24
  return hora >= 8 && hora < (dia % 4 === 2 ? 20 : 18)
})
const CAUDAL_H = BOMBEA.map((b, h) => (b ? 18.5 + Math.sin(h * 0.9) * 0.6 : 0))
// El nivel baja mientras bombea (cono de depresión) y se recupera después
const NIVEL_H = (() => {
  let v = 12.4
  return BOMBEA.map((b) => {
    v = b ? v + (15.2 - v) * 0.35 : v + (12.4 - v) * 0.3
    return v
  })
})()

function DetallePozo({ pozo, enfoque }: { pozo: Pozo; enfoque?: string | null }) {
  const [cursorUsuario, setCursorUsuario] = useState<number | null>(null)
  const cursorAuto = useCursorAuto(enfoque === 'pozo-graficos' && cursorUsuario === null)
  const cursor = cursorUsuario ?? cursorAuto

  return (
    <motion.div
      className="flex min-h-0 flex-1 flex-col px-4 pb-3 pt-3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Nombre, caudal permitido y acciones */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xl font-bold text-[#212427]">{pozo.nombre}</p>
          <hr className="my-1 w-64 border-gray-600" />
          <p className="text-[11px] text-gray-400">{pozo.codigoDga}</p>
          <p className="text-[11px] text-gray-400">
            Caudal permitido <b className="text-[#212427]">{fmt(CAUDAL_PERMITIDO, 1)} l/s</b> ({fmt(CAUDAL_PERMITIDO * 3.6, 1)} m³/h)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-2 rounded-lg bg-gray-200 px-2 py-1 shadow-lg">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#1d6f42] text-white">
              <FileSpreadsheet className="h-4 w-4" />
            </span>
            <span data-guia="pozo-dga-detalle" className="grid h-8 w-8 place-items-center rounded-full bg-green-600 text-[9px] font-bold text-white">
              DGA
            </span>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-[#084d6e] px-3 py-1.5 text-[11px] text-white shadow-md">
            <ArrowLeft className="h-3.5 w-3.5" /> Volver
          </span>
        </div>
      </div>

      {/* Última medición */}
      <div data-guia="pozo-indicadores" className="mt-3 grid grid-cols-3 gap-3">
        <Indicador
          icono={<Gauge className="h-9 w-9" />}
          etiqueta="Caudal"
          valor={`${fmt(pozo.caudal, 1)} l/s`}
          extra={`${fmt(pozo.caudal * 3.6, 1)} m³/h`}
          fondo="from-[#00a3a8] to-[#007d82]"
        />
        <Indicador icono={<Droplets className="h-9 w-9" />} etiqueta="Nivel freático" valor={`${fmt(pozo.nivel, 2)} m`} fondo="from-[#3b82f6] to-[#1e56b8]" />
        <Indicador icono={<Database className="h-9 w-9" />} etiqueta="Volumen total" valor={`${fmt(pozo.volumen)} m³`} fondo="from-[#f59e0b] to-[#c2700a]" />
      </div>

      {/* Un gráfico a la vista y las pestañas abajo (components/pozo/pozoChartHolder.tsx) */}
      <div data-guia="pozo-graficos" className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200">
        <GraficoNivelCaudal cursor={cursor} onCursor={setCursorUsuario} />
        <div className="flex justify-center gap-4 pb-1 text-[10px] text-gray-500">
          <Leyenda color="#34695f" texto="Nivel freático" />
          <Leyenda color="#00c1c6" texto="Caudal" />
          <Leyenda color="#ef4444" texto="Caudal permitido" />
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-200 px-4 pb-2 pt-1.5" aria-hidden="true">
          <span
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium text-white"
            style={{
              background: 'linear-gradient(135deg, #0a6a94, #084d6e, #072d3d)',
              boxShadow: '0 2px 8px rgba(7,45,61,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <ChartLine className="h-3.5 w-3.5" /> Caudal / Nivel
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-[11px] font-medium text-gray-500">
            <ChartColumn className="h-3.5 w-3.5" /> Vol. Acumulado
          </span>
        </div>
      </div>
    </motion.div>
  )
}

function Indicador({ icono, etiqueta, valor, extra, fondo }: { icono: React.ReactNode; etiqueta: string; valor: string; extra?: string; fondo: string }) {
  return (
    <div className={cn('flex h-[76px] items-center gap-4 rounded-xl bg-gradient-to-br px-4 text-white shadow-md', fondo)}>
      {icono}
      <div>
        <p className="text-[11px]">{etiqueta}</p>
        <p className="text-lg font-bold leading-tight">
          {valor} {extra && <span className="text-[11px] font-normal opacity-90">· {extra}</span>}
        </p>
        <p className="text-[10px] opacity-80">Última medición</p>
      </div>
    </div>
  )
}

const ALTO_POZO = 320
const PLOT_ALTO = ALTO_POZO - ARRIBA - 22

/** Nivel freático (m, crece hacia abajo) y caudal (l/s) con la línea del caudal permitido */
function GraficoNivelCaudal({ cursor, onCursor, ancho = ANCHO }: PropsGrafico) {
  const PLOT = plotDe(ancho)
  const x = (h: number) => IZQ + (h / (HORAS - 1)) * PLOT
  const yQ = (q: number) => ARRIBA + (1 - q / 30) * PLOT_ALTO
  // Nivel en metros bajo superficie: 10 m arriba, 16 m abajo
  const yN = (n: number) => ARRIBA + ((n - 10) / 6) * PLOT_ALTO
  const linea = (serie: number[], y: (v: number) => number) => serie.map((v, h) => `${h ? 'L' : 'M'}${x(h).toFixed(1)},${y(v).toFixed(1)}`).join('')
  const h = cursor === null ? null : Math.round(cursor * (HORAS - 1))

  return (
    <svg viewBox={`0 0 ${ancho} ${ALTO_POZO}`} className="min-h-0 w-full flex-1" onMouseMove={(e) => onCursor(fraccion(e, ancho))} onMouseLeave={() => onCursor(null)}>
      {[0, 10, 20, 30].map((q) => (
        <g key={q}>
          <line x1={IZQ} x2={IZQ + PLOT} y1={yQ(q)} y2={yQ(q)} stroke="#f1f5f9" strokeWidth="0.8" />
          <text x={IZQ - 6} y={yQ(q) + 3} fontSize="8" fill="#64748b" textAnchor="end">
            {q}
          </text>
        </g>
      ))}
      <text x={10} y={ARRIBA + PLOT_ALTO / 2} fontSize="8" fill="#64748b" textAnchor="middle" transform={`rotate(-90 10 ${ARRIBA + PLOT_ALTO / 2})`}>
        l/s · m
      </text>
      <line x1={IZQ} x2={IZQ + PLOT} y1={ARRIBA + PLOT_ALTO} y2={ARRIBA + PLOT_ALTO} stroke="#94a3b8" strokeWidth="0.8" />
      <EjeFechas y={ARRIBA + PLOT_ALTO} plot={PLOT} />
      <line x1={IZQ} x2={IZQ + PLOT} y1={yQ(CAUDAL_PERMITIDO)} y2={yQ(CAUDAL_PERMITIDO)} stroke="#ef4444" strokeWidth="2" strokeDasharray="6 4" />
      <path d={linea(CAUDAL_H, yQ)} fill="none" stroke="#00c1c6" strokeWidth="1.2" />
      <path d={linea(NIVEL_H, yN)} fill="none" stroke="#34695f" strokeWidth="1.5" />
      {h !== null && (
        <g>
          <line x1={x(h)} x2={x(h)} y1={ARRIBA} y2={ARRIBA + PLOT_ALTO} stroke="#084d6e" strokeWidth="1" strokeDasharray="3 3" />
          <Globo
            ancho={ancho}
            x={x(h)}
            y={ARRIBA + 4}
            lineas={[
              `${FECHAS[Math.floor(h / 24)]} ${String(h % 24).padStart(2, '0')}:00`,
              `Caudal ${fmt(CAUDAL_H[h], 1)} l/s · Nivel ${fmt(NIVEL_H[h], 2)} m`,
            ]}
          />
        </g>
      )}
    </svg>
  )
}
