'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeftRight,
  CalendarDays,
  Droplet,
  Droplets,
  FileSpreadsheet,
  Layers,
  LineChart,
  Sigma,
  Sparkles,
  TrendingUp,
  TriangleAlert,
  X,
} from 'lucide-react'
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
  LLUVIA,
  Leyenda,
  MapaSectores,
  PUNTOS,
  RIEGO_SECTOR,
  Selector,
  Simbologia,
  TRANSICION,
  Tarjeta,
  fraccion,
  plotDe,
  useCursorAuto,
  type PropsGrafico,
} from './modulo_comun'

/**
 * Módulo Suelo de Olive+ (escritorio), a grandes rasgos. Copia la distribución de
 * olive_next/app/soil/page.tsx: a la izquierda (1/3) el selector de campo y el mapa de sectores;
 * a la derecha (2/3) "Suma de humedad de suelo" y "Balance Hídrico", sincronizados.
 *
 * Datos ficticios pero coherentes con el color de cada sector en el mapa:
 * - Sector 16 (verde): tres riegos que mantienen la humedad en la banda óptima.
 * - Sector 13 (rojo): un solo riego corto; la humedad cae hasta la banda seca con la ETo alta.
 *
 * Elementos que la guía puede enfocar: suelo-campo, suelo-fecha, suelo-mapa, suelo-graficos, suelo-sector,
 * suelo-analisis y suelo-pantalla-completa. La guía también abre el informe del Análisis Inteligente y
 * la vista de pantalla completa (3 gráficos, 5 sensores por profundidad).
 */

export type SectorSuelo = '13' | '16'


/** Suma de humedad (%): baja con el consumo y sube con cada riego (día, alza en %) */
function serie(inicio: number, consumo: number, riegos: [number, number][]) {
  return Array.from({ length: PUNTOS }, (_, i) => {
    let v = inicio - i * consumo
    for (const [dia, alza] of riegos) {
      const d = i - dia * 8
      if (d >= 0) v += alza * (0.4 + 0.6 * Math.exp(-d / 3)) * Math.exp(-d / 45)
    }
    return v + Math.sin(i * 1.7) * 0.18
  })
}

// El riego de cada sector es el mismo en todos los módulos (modulo_comun.tsx)
const DATOS: Record<SectorSuelo, { suma: number[]; riego: number[] }> = {
  '16': { suma: serie(49, 0.05, [[3, 5], [7, 5], [11, 5]]), riego: RIEGO_SECTOR['16'] },
  '13': { suma: serie(41, 0.09, [[5, 2.5]]), riego: RIEGO_SECTOR['13'] },
}

/** Humedad por profundidad (%): 5 sensores; el riego moja primero el de arriba */
const PROFUNDIDADES = [20, 40, 60, 80, 100] as const
const COLOR_PROF = ['#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#db2777']
function perfil(inicios: number[], caidas: number[], riegos: [number, number][]) {
  return inicios.map((ini, k) =>
    Array.from({ length: PUNTOS }, (_, i) => {
      let v = ini - (i / PUNTOS) * caidas[k]
      for (const [dia, mm] of riegos) {
        // Cada sensor más profundo recibe menos agua y más tarde
        const alza = mm * 2.2 * Math.pow(0.32, k)
        const d = i - dia * 8 - k * 2
        if (d >= 0 && alza > 0.05) v += alza * Math.exp(-d / 14)
      }
      return v + Math.sin(i * 1.3 + k) * 0.12
    }),
  )
}
const PERFIL: Record<SectorSuelo, number[][]> = {
  '16': perfil([27, 28, 29, 30, 31], [3, 2.5, 2, 1.5, 1], [[3, 4], [7, 4.2], [11, 4.1]]),
  '13': perfil([24, 26, 28, 30, 31], [10, 8, 5, 3, 1.5], [[5, 1.5]]),
}

// Mapa: cada sector pintado por la humedad de su suelo
const COLOR_SUELO = { saturado: '#2563eb', optimo: '#16a34a', moderado: '#eab308', seco: '#dc2626' }
const COLORES_MAPA: Record<string, string> = {
  '12': COLOR_SUELO.optimo,
  '13': COLOR_SUELO.seco,
  '14': COLOR_SUELO.saturado,
  '15': COLOR_SUELO.moderado,
  '16': COLOR_SUELO.optimo,
}
const SIMBOLOGIA = [
  { color: COLOR_SUELO.saturado, nombre: 'Saturado' },
  { color: COLOR_SUELO.optimo, nombre: 'Óptimo' },
  { color: COLOR_SUELO.moderado, nombre: 'Moderado' },
  { color: COLOR_SUELO.seco, nombre: 'Seco' },
]
const ETO_REF = { nombre: 'ETo', valores: ETO, color: '#F98800' }

// Bandas agronómicas de la suma de humedad (%)
const Y_MIN = 28
const Y_MAX = 64
const BANDAS = [
  { desde: 52, hasta: Y_MAX, color: '#dbeafe', nombre: 'Saturado' },
  { desde: 42, hasta: 52, color: '#dcfce7', nombre: 'Óptimo' },
  { desde: 35, hasta: 42, color: '#ffedd5', nombre: 'Moderado' },
  { desde: Y_MIN, hasta: 35, color: '#fee2e2', nombre: 'Seco' },
]

export default function SueloDemo({
  enfoque,
  sector = '16',
  esperando = null,
  informeAbierto = false,
  detalleAbierto = false,
  onAccion,
  onInicio,
}: {
  enfoque?: string | null
  sector?: SectorSuelo
  /** Elemento que la guía espera que el usuario toque (`data-guia`); solo ese responde al clic */
  esperando?: string | null
  informeAbierto?: boolean
  detalleAbierto?: boolean
  /** Avisa a la guía qué tocó el usuario: el `data-guia` del elemento, o 'cerrar-informe' / 'cerrar-detalle' */
  onAccion?: (accion: string) => void
  onInicio?: () => void
}) {
  // Cursor compartido: fracción 0–1 del período. La guía lo pasea sola en los pasos de gráficos.
  const [cursorUsuario, setCursorUsuario] = useState<number | null>(null)
  const cursorAuto = useCursorAuto((enfoque === 'suelo-graficos' || detalleAbierto) && cursorUsuario === null)
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
        {/* Izquierda: campo, período y mapa */}
        <motion.div
          className="flex w-1/3 flex-col gap-2"
          variants={{ oculto: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="rounded-lg bg-white p-2 shadow-md">
            <div className="flex items-center justify-between gap-2">
              <Selector data-guia="suelo-campo" texto="Fundo Demo" className="w-52" />
              <div className="flex gap-1.5">
                {/* Análisis Inteligente (PRO) */}
                <BotonRedondo
                  className="bg-gradient-to-br from-[#8b5cf6] via-[#6366f1] to-[#4f46e5]"
                  data-guia="suelo-analisis"
                  onClick={esperando === 'suelo-analisis' ? () => onAccion?.('suelo-analisis') : undefined}
                >
                  <Sparkles className="h-[18px] w-[18px]" />
                </BotonRedondo>
                <BotonRedondo className="bg-[#1d6f42]">
                  <FileSpreadsheet className="h-[18px] w-[18px]" />
                </BotonRedondo>
                <BotonRedondo className="bg-[#2563a8]">
                  <LineChart className="h-[18px] w-[18px]" />
                </BotonRedondo>
                <BotonRedondo className="bg-[#084d6e]" data-guia="suelo-fecha">
                  <CalendarDays className="h-[18px] w-[18px]" />
                </BotonRedondo>
                <BotonRedondo className="border-2 border-[#00a3a8] bg-white !text-[#00a3a8]">
                  <ArrowLeftRight className="h-[18px] w-[18px]" />
                </BotonRedondo>
              </div>
            </div>
            <p className="pb-1 pr-2 pt-5 text-right text-sm text-[#212427]">
              Período entre {FECHAS[0]}/2026 y {FECHAS[DIAS - 1]}/2026
            </p>
          </div>

          <div className="flex min-h-0 flex-1 flex-col rounded-lg bg-white shadow-md" data-guia="suelo-mapa">
            <div className="p-2">
              <Selector texto={`Sector ${sector}`} className="w-52" />
            </div>
            <MapaSectores
              seleccionado={sector}
              colores={COLORES_MAPA}
              objetivo={{ id: '13', guia: 'suelo-sector' }}
              clicable={esperando === 'suelo-sector'}
              onSector={() => onAccion?.('suelo-sector')}
              sensor={{ icono: <Droplet className="h-3 w-3" />, color: '#845B35' }}
            >
              <div className="absolute left-2 top-2 rounded-lg bg-white p-1.5 shadow-md">
                <span className="flex items-center gap-1 rounded-full bg-[#084d6e] px-3 py-1 text-[11px] text-white">
                  <Sigma className="h-3 w-3" /> Sumatoria
                </span>
                <span className="mt-1 flex items-center gap-1 px-3 py-1 text-[11px] text-gray-500">
                  <TrendingUp className="h-3 w-3" /> Promedio
                </span>
              </div>
              <Simbologia items={SIMBOLOGIA} />
            </MapaSectores>
          </div>
        </motion.div>

        {/* Derecha: gráficos sincronizados */}
        <motion.div
          className="flex w-2/3 flex-col gap-2"
          data-guia="suelo-graficos"
          variants={{ oculto: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Tarjeta
            titulo="Suma de humedad de suelo"
            guiaExpandir="suelo-pantalla-completa"
            onExpandir={esperando === 'suelo-pantalla-completa' ? () => onAccion?.('suelo-pantalla-completa') : undefined}
          >
            <GraficoHumedad suma={datos.suma} cursor={cursor} onCursor={setCursorUsuario} />
            <div className="flex items-center justify-center gap-1.5 pb-1.5 text-[10px] font-medium">
              <span className="flex items-center gap-1 rounded-full bg-blue-500 px-2 py-0.5 text-white">
                <Droplet className="h-3 w-3" /> Humedad acum.
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 text-gray-500">
                <Droplets className="h-3 w-3" /> Humedad prom.
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 text-gray-500">
                <Layers className="h-3 w-3" /> Por profundidad
              </span>
            </div>
          </Tarjeta>
          <Tarjeta
            titulo="Balance Hídrico"
            extra={<span className="grid h-7 w-7 place-items-center rounded-full bg-[#F98800] text-[9px] font-bold text-white">ETo</span>}
          >
            <GraficoBalance riego={datos.riego} referencia={ETO_REF} cursor={cursor} onCursor={setCursorUsuario} />
            <div className="flex items-center justify-center gap-4 pb-2 text-[10px] text-gray-500">
              <Leyenda color="#A9BFDB" texto="Precipitación" />
              <Leyenda color="#084d6e" texto="Riego" />
              <Leyenda color="#F98800" texto="ETo" />
            </div>
          </Tarjeta>
        </motion.div>
      </motion.main>

      <AnimatePresence>
        {informeAbierto && <InformeAnalisis sector={sector} onCerrar={() => onAccion?.('cerrar-informe')} />}
      </AnimatePresence>
      <AnimatePresence>
        {detalleAbierto && (
          <VistaDetalle sector={sector} cursor={cursor} onCursor={setCursorUsuario} onCerrar={() => onAccion?.('cerrar-detalle')} />
        )}
      </AnimatePresence>
    </div>
  )
}

/** Pasea el cursor de ida y vuelta por el período mientras `activo` */



function GraficoHumedad({ suma, cursor, onCursor, ancho = ANCHO }: PropsGrafico & { suma: number[] }) {
  const PLOT = plotDe(ancho)
  const y = (v: number) => ARRIBA + (1 - (v - Y_MIN) / (Y_MAX - Y_MIN)) * ALTO_PLOT
  const x = (i: number) => IZQ + (i / (PUNTOS - 1)) * PLOT
  const linea = suma.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('')
  const i = cursor === null ? null : Math.round(cursor * (PUNTOS - 1))
  const banda = (v: number) => BANDAS.find((b) => v >= b.desde)?.nombre ?? 'Seco'

  return (
    <svg
      viewBox={`0 0 ${ancho} ${ALTO_H}`}
      className="min-h-0 w-full flex-1"
      onMouseMove={(e) => onCursor(fraccion(e, ancho))}
      onMouseLeave={() => onCursor(null)}
    >
      {/* Bandas agronómicas */}
      {BANDAS.map((b) => (
        <g key={b.nombre}>
          <rect x={IZQ} y={y(b.hasta)} width={PLOT} height={y(b.desde) - y(b.hasta)} fill={b.color} />
          <text x={IZQ + 4} y={y(b.hasta) + 10} fontSize="8" fill="#64748b">
            {b.nombre}
          </text>
        </g>
      ))}
      {[35, 42, 52].map((v) => (
        <text key={v} x={IZQ - 6} y={y(v) + 3} fontSize="8" fill="#64748b" textAnchor="end">
          {v}
        </text>
      ))}
      <text
        x={10}
        y={ARRIBA + ALTO_PLOT / 2}
        fontSize="8"
        fill="#64748b"
        textAnchor="middle"
        transform={`rotate(-90 10 ${ARRIBA + ALTO_PLOT / 2})`}
      >
        Humedad de suelo (%)
      </text>
      <line x1={IZQ} x2={IZQ} y1={ARRIBA} y2={ARRIBA + ALTO_PLOT} stroke="#94a3b8" strokeWidth="0.8" />
      <line x1={IZQ} x2={IZQ + PLOT} y1={ARRIBA + ALTO_PLOT} y2={ARRIBA + ALTO_PLOT} stroke="#94a3b8" strokeWidth="0.8" />
      <EjeFechas y={ARRIBA + ALTO_PLOT} plot={PLOT} />

      {/* Al cambiar de sector la línea se transforma en la del nuevo sector */}
      <motion.path initial={false} animate={{ d: linea }} transition={TRANSICION} fill="none" stroke="#2196f3" strokeWidth="1.8" strokeLinejoin="round" />

      {i !== null && (
        <g>
          <line x1={x(i)} x2={x(i)} y1={ARRIBA} y2={ARRIBA + ALTO_PLOT} stroke="#084d6e" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={x(i)} cy={y(suma[i])} r="4" fill="#2196f3" stroke="#fff" strokeWidth="1.5" />
          <Globo
            ancho={ancho}
            x={x(i)}
            y={ARRIBA + 4}
            lineas={[FECHAS[Math.min(DIAS - 1, Math.floor(i / 8))], `Humedad ${suma[i].toFixed(1)} % · ${banda(suma[i])}`]}
          />
        </g>
      )}
    </svg>
  )
}



/* ---------- Análisis Inteligente (PRO) ---------- */

/** Indicadores del informe, calculados de los mismos datos que dibujan los gráficos */
function indicadores(sector: SectorSuelo) {
  const { suma, riego } = DATOS[sector]
  const pct = (desde: number, hasta: number) => Math.round((suma.filter((v) => v >= desde && v < hasta).length / suma.length) * 100)
  const zonas = BANDAS.map((b) => ({ ...b, pct: pct(b.desde, b.hasta === Y_MAX ? Infinity : b.hasta) }))
  const total = (a: number[]) => a.reduce((x, y) => x + y, 0)
  const aporte = total(riego) + total(LLUVIA)
  const eto = total(ETO)
  const diasRiego = riego.flatMap((v, d) => (v > 0 ? [d] : []))
  return {
    zonas,
    optimo: zonas.find((z) => z.nombre === 'Óptimo')!.pct,
    seco: zonas.find((z) => z.nombre === 'Seco')!.pct,
    balance: Math.round(aporte - eto),
    cobertura: Math.round((aporte / eto) * 100),
    riegos: diasRiego.length,
    primerRiego: diasRiego[0],
    mmRiego: riego[diasRiego[0]],
  }
}

/** Informe conceptual (olive_next/app/soil/components/analisis/suelo/SueloAnalysisView.tsx) */
function InformeAnalisis({ sector, onCerrar }: { sector: SectorSuelo; onCerrar: () => void }) {
  const k = indicadores(sector)
  const fmt = (n: number) => n.toLocaleString('es-CL')
  const kpis = [
    { titulo: 'Tiempo en zona óptima', valor: `${k.optimo}%`, sub: 'del tiempo con lectura', color: k.optimo >= 60 ? 'text-emerald-600' : 'text-red-600' },
    { titulo: 'Balance de agua total', valor: `${k.balance > 0 ? '+' : ''}${fmt(k.balance)} mm`, sub: k.balance < 0 ? 'Déficit · vs ETo' : 'Equilibrado · vs ETo', color: k.balance < 0 ? 'text-red-600' : 'text-[#084d6e]' },
    { titulo: 'Riegos con respuesta', valor: `${k.riegos} de ${k.riegos}`, sub: 'con salto de humedad medible', color: 'text-[#084d6e]' },
    { titulo: 'Profundidad efectiva típica', valor: '20 cm', sub: 'mediana de los riegos con respuesta', color: 'text-amber-600' },
  ]
  const hallazgos = [
    `La humedad estuvo un ${k.seco}% del tiempo en zona seca y solo un ${k.optimo}% en zona óptima.`,
    `Déficit de ${fmt(Math.abs(k.balance))} mm: el riego y la lluvia cubrieron apenas el ${k.cobertura}% de la ETo del período.`,
    `El único riego (${fmt(k.mmRiego)} mm, ${FECHAS[k.primerRiego]}) solo movió el sensor de 20 cm: el agua no llegó a la raíz.`,
  ]

  return (
    <motion.div
      className="absolute inset-0 z-[35] flex items-center justify-center bg-black/40 p-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        data-guia="suelo-informe"
        className="w-[880px] overflow-hidden rounded-xl bg-white shadow-2xl"
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div className="flex items-center gap-3 bg-gradient-to-br from-[#8b5cf6] via-[#6366f1] to-[#4f46e5] px-5 py-3.5 text-white">
          <Sparkles className="h-6 w-6" />
          <div className="flex-1">
            <p className="text-base font-bold leading-tight">Análisis Inteligente · Suelo</p>
            <p className="text-[11px] leading-tight opacity-90">Humedad, balance y profundidad efectiva · Sector: {sector}</p>
          </div>
          <span className="rounded-full bg-gradient-to-br from-[#ffd24d] via-[#fab500] to-[#b57f00] px-2.5 py-1 text-[10px] font-extrabold tracking-[0.18em] text-[#032f44]">
            PRO
          </span>
          <button type="button" onClick={onCerrar} className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/15" aria-label="Cerrar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-5">
          <div className="grid grid-cols-4 gap-3">
            {kpis.map((x) => (
              <div key={x.titulo} className="rounded-lg border border-gray-200 px-3 py-2.5">
                <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500">{x.titulo}</p>
                <p className={cn('text-xl font-bold leading-tight', x.color)}>{x.valor}</p>
                <p className="text-[10px] text-gray-400">{x.sub}</p>
              </div>
            ))}
          </div>

          <h3 className="mb-2.5 mt-5 border-l-[3px] border-[#084d6e] pl-2.5 text-[15px] font-bold text-[#084d6e]">1. Resumen</h3>
          <ul className="space-y-2">
            {hallazgos.map((h) => (
              <li key={h} className="flex gap-2.5 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-[#3F4650]">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                {h}
              </li>
            ))}
          </ul>

          <h3 className="mb-2.5 mt-5 border-l-[3px] border-[#084d6e] pl-2.5 text-[15px] font-bold text-[#084d6e]">
            2. Humedad del suelo y zonas agronómicas
          </h3>
          <div className="flex h-7 overflow-hidden rounded-md">
            {k.zonas
              .filter((z) => z.pct > 0)
              .map((z) => (
                <div
                  key={z.nombre}
                  className="flex items-center justify-center text-[10px] font-semibold text-[#3F4650]"
                  style={{ width: `${z.pct}%`, background: z.color, filter: 'saturate(2.2) brightness(0.92)' }}
                >
                  {z.pct >= 8 ? `${z.nombre} ${z.pct}%` : ''}
                </div>
              ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ---------- Pantalla completa ---------- */

const ANCHO_DETALLE = 1250

/** Vista "Detalles" a pantalla completa (olive_next/app/soil/components/OpenContainerSoil.tsx) */
function VistaDetalle({
  sector,
  cursor,
  onCursor,
  onCerrar,
}: {
  sector: SectorSuelo
  cursor: number | null
  onCursor: (x: number | null) => void
  onCerrar: () => void
}) {
  const datos = DATOS[sector]
  return (
    <motion.div
      data-guia="suelo-detalle"
      className="absolute inset-0 z-[36] flex flex-col bg-[#F5F5F7]"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className="relative flex items-center justify-center gap-2.5 bg-gradient-to-br from-[#0a6a90] via-[#084d6e] to-[#063d56] px-4 py-1.5 text-white shadow-md">
        <p className="text-sm font-bold tracking-wide">Detalles</p>
        <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-2 py-0.5 text-[10px] font-semibold">
          <span className="uppercase tracking-wide text-white/70">Sector</span> {sector}
        </span>
        <button type="button" onClick={onCerrar} className="absolute right-3 grid h-7 w-7 place-items-center rounded-full hover:bg-white/15" aria-label="Cerrar">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5 p-1.5">
        <TarjetaDetalle titulo="Suma de humedad de suelo">
          <GraficoHumedad suma={datos.suma} cursor={cursor} onCursor={onCursor} ancho={ANCHO_DETALLE} />
        </TarjetaDetalle>
        <TarjetaDetalle
          titulo="Humedad por profundidad"
          leyenda={PROFUNDIDADES.map((p, k) => (
            <Leyenda key={p} color={COLOR_PROF[k]} texto={`${p} cm`} />
          ))}
        >
          <GraficoProfundidad perfil={PERFIL[sector]} cursor={cursor} onCursor={onCursor} ancho={ANCHO_DETALLE} />
        </TarjetaDetalle>
        <TarjetaDetalle
          titulo="Balance Hídrico"
          leyenda={
            <>
              <Leyenda color="#A9BFDB" texto="Precipitación" />
              <Leyenda color="#084d6e" texto="Riego" />
              <Leyenda color="#F98800" texto="ETo" />
            </>
          }
        >
          <GraficoBalance riego={datos.riego} referencia={ETO_REF} cursor={cursor} onCursor={onCursor} ancho={ANCHO_DETALLE} />
        </TarjetaDetalle>
      </div>
    </motion.div>
  )
}

function TarjetaDetalle({ titulo, leyenda, children }: { titulo: string; leyenda?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-lg bg-white shadow-md">
      <div className="flex items-center justify-between px-3 pt-1.5">
        <p className="text-[13px] font-semibold text-[#212427]">{titulo}</p>
        {leyenda && <div className="flex items-center gap-3 text-[10px] text-gray-500">{leyenda}</div>}
      </div>
      {children}
    </div>
  )
}

/** Humedad por profundidad: una línea por sensor */
function GraficoProfundidad({ perfil, cursor, onCursor, ancho = ANCHO }: PropsGrafico & { perfil: number[][] }) {
  const PLOT = plotDe(ancho)
  const min = 10
  const max = 35
  const y = (v: number) => ARRIBA + (1 - (v - min) / (max - min)) * ALTO_PLOT
  const x = (i: number) => IZQ + (i / (PUNTOS - 1)) * PLOT
  const i = cursor === null ? null : Math.round(cursor * (PUNTOS - 1))

  return (
    <svg
      viewBox={`0 0 ${ancho} ${ALTO_H}`}
      className="min-h-0 w-full flex-1"
      onMouseMove={(e) => onCursor(fraccion(e, ancho))}
      onMouseLeave={() => onCursor(null)}
    >
      {[15, 20, 25, 30, 35].map((v) => (
        <g key={v}>
          <line x1={IZQ} x2={IZQ + PLOT} y1={y(v)} y2={y(v)} stroke="#e2e8f0" strokeWidth="0.8" />
          <text x={IZQ - 6} y={y(v) + 3} fontSize="8" fill="#64748b" textAnchor="end">
            {v}
          </text>
        </g>
      ))}
      <text
        x={10}
        y={ARRIBA + ALTO_PLOT / 2}
        fontSize="8"
        fill="#64748b"
        textAnchor="middle"
        transform={`rotate(-90 10 ${ARRIBA + ALTO_PLOT / 2})`}
      >
        Humedad (%)
      </text>
      <line x1={IZQ} x2={IZQ + PLOT} y1={ARRIBA + ALTO_PLOT} y2={ARRIBA + ALTO_PLOT} stroke="#94a3b8" strokeWidth="0.8" />
      <EjeFechas y={ARRIBA + ALTO_PLOT} plot={PLOT} />
      {perfil.map((serie, k) => (
        <path
          key={k}
          d={serie.map((v, j) => `${j ? 'L' : 'M'}${x(j).toFixed(1)},${y(v).toFixed(1)}`).join('')}
          fill="none"
          stroke={COLOR_PROF[k]}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      ))}
      {i !== null && (
        <g>
          <line x1={x(i)} x2={x(i)} y1={ARRIBA} y2={ARRIBA + ALTO_PLOT} stroke="#084d6e" strokeWidth="1" strokeDasharray="3 3" />
          {perfil.map((serie, k) => (
            <circle key={k} cx={x(i)} cy={y(serie[i])} r="3" fill={COLOR_PROF[k]} stroke="#fff" strokeWidth="1.2" />
          ))}
          <Globo
            ancho={ancho}
            x={x(i)}
            y={ARRIBA + 4}
            lineas={[
              FECHAS[Math.min(DIAS - 1, Math.floor(i / 8))],
              PROFUNDIDADES.map((p, k) => `${p}: ${perfil[k][i].toFixed(0)}%`).join(' · '),
            ]}
          />
        </g>
      )}
    </svg>
  )
}
