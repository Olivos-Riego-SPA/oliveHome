'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CalendarDays,
  Cloud,
  CloudFog,
  CloudRain,
  CloudSun,
  CloudSunRain,
  Droplet,
  FileSpreadsheet,
  Snowflake,
  Sprout,
  Sun,
  SunDim,
  Thermometer,
  ThermometerSun,
  Wind,
  X,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CabeceraDemo, Ola } from './cabecera_demo'
import {
  ARRIBA,
  BotonRedondo,
  DIAS,
  ANCHO,
  ETO,
  EjeFechas,
  FECHAS,
  Globo,
  IZQ,
  LLUVIA,
  Leyenda,
  MapaSectores,
  PUNTOS,
  SECTORES,
  Selector,
  fraccion,
  plotDe,
  type PropsGrafico,
} from './modulo_comun'

/**
 * Módulo Clima de Olive+ (escritorio), a grandes rasgos. Copia la distribución de
 * olive_next/app/weather: a la izquierda el campo, la estación y su mapa; a la derecha los
 * indicadores del período, el pronóstico (PRO, se abre con el botón de la estación) y un gráfico
 * con las variables en pestañas abajo (Evapotranspiración, Temp. y humedad, …, Frío, Días grado).
 *
 * Elementos que la guía puede enfocar: clima-campo, clima-fecha, clima-estacion, clima-indicadores, clima-grafico,
 * clima-pronostico-boton, clima-pronostico y clima-dia.
 */

export type PestanaClima = 'eto' | 'temp' | 'frio'

// ETc: la ETo de la estación ajustada al cultivo (Kc fijo para la demo)
const ETC = ETO.map((v) => Math.round(v * 0.85 * 100) / 100)
const fmt = (n: number, dec = 2) => n.toLocaleString('es-CL', { minimumFractionDigits: dec, maximumFractionDigits: dec })

// Temperatura (°C) y humedad relativa (%) cada 3 h: ciclo diario, con días más cálidos hacia el final
const TEMP = Array.from({ length: PUNTOS }, (_, i) => {
  const dia = i / 8
  const hora = (i % 8) * 3
  const base = 15 + dia * 0.35
  return base + 8 * Math.sin(((hora - 9) / 24) * Math.PI * 2) + Math.sin(dia * 1.9) * 1.5
})
const HUMEDAD = TEMP.map((t, i) => Math.max(28, Math.min(95, 112 - t * 2.6 + Math.sin(i * 0.7) * 3)))

const INDICADORES = [
  { etiqueta: 'Temp. máxima', valor: fmt(Math.max(...TEMP)), unidad: '°C', icono: ThermometerSun, fondo: 'from-[#2f6fe8] to-[#0b3fa6]', texto: 'text-[#1e56c8]' },
  { etiqueta: 'Temperatura', valor: fmt(TEMP.reduce((a, b) => a + b, 0) / TEMP.length), unidad: '°C', icono: Thermometer, fondo: 'from-[#b14ff0] to-[#7a1fc4]', texto: 'text-[#8f2fd6]' },
  { etiqueta: 'Lluvia', valor: fmt(LLUVIA.reduce((a, b) => a + b, 0)), unidad: 'mm', icono: CloudRain, fondo: 'from-[#7fa3b5] to-[#4f7488]', texto: 'text-[#4f7488]' },
  { etiqueta: 'Horas frío', valor: fmt(930), unidad: '', icono: Snowflake, fondo: 'from-[#7aa5f5] to-[#3f72dc]', texto: 'text-[#3f72dc]' },
  { etiqueta: 'DG Base 5°', valor: fmt(422.09), unidad: '', icono: Sun, fondo: 'from-[#ffe14d] to-[#e6b800]', texto: 'text-[#b08900]' },
  { etiqueta: 'ETc diario', valor: fmt(ETC[DIAS - 1]), unidad: 'mm', icono: Sprout, fondo: 'from-[#1fb35f] to-[#087a3a]', texto: 'text-[#087a3a]' },
]

/* ---------- Pronóstico (PRO) ---------- */

type DiaPronostico = {
  dia: string
  max: number
  min: number
  lluvia?: number
  cielo: 'nubes' | 'sol' | 'niebla' | 'lluvia'
}
const PRONOSTICO: DiaPronostico[] = [
  { dia: 'JUE 12', max: 28, min: 16, cielo: 'nubes' },
  { dia: 'VIE 13', max: 30, min: 17, cielo: 'sol' },
  { dia: 'SÁB 14', max: 27, min: 14, cielo: 'niebla' },
  { dia: 'DOM 15', max: 24, min: 13, lluvia: 2, cielo: 'lluvia' },
  { dia: 'LUN 16', max: 19, min: 12, lluvia: 6, cielo: 'lluvia' },
  { dia: 'MAR 17', max: 21, min: 11, lluvia: 4, cielo: 'lluvia' },
  { dia: 'MIÉ 18', max: 25, min: 12, cielo: 'nubes' },
]
/** Día que la guía pide tocar */
const DIA_DETALLE = 2
const ICONO_CIELO = { nubes: Cloud, sol: CloudSun, niebla: CloudFog, lluvia: CloudSunRain }
const FONDO_CIELO = {
  nubes: 'from-[#6b7785] to-[#4a5562]',
  sol: 'from-[#5d8fb8] to-[#3c6a92]',
  niebla: 'from-[#7d8794] to-[#59626e]',
  lluvia: 'from-[#2f6f9e] to-[#1d4f78]',
}

// La estación del campo, en el mapa
const ESTACION: [number, number] = [150, 95]
const COLORES_NEUTROS = Object.fromEntries(SECTORES.map((s) => [s.id, 'rgba(255,255,255,0.35)']))

export default function ClimaDemo({
  pestana = 'eto',
  esperando = null,
  pronosticoAbierto = false,
  diaAbierto = false,
  onAccion,
  onInicio,
}: {
  /** Pestaña del gráfico que pide la guía (el usuario igual puede cambiarla) */
  pestana?: PestanaClima
  /** Elemento que la guía espera que el usuario toque (`data-guia`); solo ese responde al clic */
  esperando?: string | null
  pronosticoAbierto?: boolean
  diaAbierto?: boolean
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
        {/* Izquierda: campo, estación y mapa */}
        <motion.div
          className="flex w-1/3 flex-col gap-2"
          variants={{ oculto: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div className="rounded-lg bg-white p-2 shadow-md">
            <div className="flex items-center justify-between gap-2">
              <Selector data-guia="clima-campo" texto="Fundo Demo" className="w-52" />
              <div className="flex gap-1.5">
                <BotonRedondo className="bg-[#109a4c] text-[11px] font-bold">ETc</BotonRedondo>
                <BotonRedondo className="bg-[#1d6f42]">
                  <FileSpreadsheet className="h-[18px] w-[18px]" />
                </BotonRedondo>
                <BotonRedondo className="bg-[#084d6e]" data-guia="clima-fecha">
                  <CalendarDays className="h-[18px] w-[18px]" />
                </BotonRedondo>
              </div>
            </div>
            <p className="pb-1 pr-2 pt-5 text-right text-sm text-[#212427]">
              Período entre {FECHAS[0]}/2026 y {FECHAS[DIAS - 1]}/2026
            </p>
          </div>

          <div className="flex min-h-0 flex-1 flex-col rounded-lg bg-white shadow-md" data-guia="clima-estacion">
            <div className="flex items-center justify-between p-2">
              <Selector texto="Estación Fundo Demo" className="w-60" />
              {/* Pronóstico (PRO): se abre desde la estación */}
              <span
                data-guia="clima-pronostico-boton"
                onClick={esperando === 'clima-pronostico-boton' ? () => onAccion?.('clima-pronostico-boton') : undefined}
                className={cn(
                  'grid h-9 w-9 place-items-center rounded-full text-white',
                  pronosticoAbierto ? 'bg-[#0ea5e9]' : 'bg-gray-400',
                  esperando === 'clima-pronostico-boton' && 'cursor-pointer transition-transform hover:scale-110',
                )}
              >
                <CloudSun className="h-5 w-5" />
              </span>
            </div>
            <MapaSectores colores={COLORES_NEUTROS}>
              <span
                className="absolute -ml-4 -mt-4 grid h-8 w-8 place-items-center rounded-full bg-[#109a4c] text-white shadow-md ring-2 ring-white"
                style={{ left: `${(ESTACION[0] / 400) * 100}%`, top: `${(ESTACION[1] / 470) * 100}%` }}
              >
                <CloudSun className="h-4 w-4" />
              </span>
            </MapaSectores>
          </div>
        </motion.div>

        {/* Derecha: indicadores, pronóstico y gráfico */}
        <motion.div
          className="flex w-2/3 flex-col gap-2"
          variants={{ oculto: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <div data-guia="clima-indicadores" className="flex justify-between px-1">
            {INDICADORES.map((x) => (
              <div key={x.etiqueta} className="flex flex-col items-center">
                <div className={cn('grid h-[104px] w-[104px] place-items-center rounded-full bg-gradient-to-br text-white shadow-lg', x.fondo)}>
                  <div className="flex flex-col items-center">
                    <x.icono className="h-6 w-6" />
                    <p className="mt-1 text-[18px] font-bold leading-none">
                      {x.valor} <span className="text-[10px] font-normal">{x.unidad}</span>
                    </p>
                  </div>
                </div>
                <p className={cn('mt-1 text-[11px] font-medium', x.texto)}>{x.etiqueta}</p>
              </div>
            ))}
          </div>

          <AnimatePresence initial={false}>
            {pronosticoAbierto && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
                className="shrink-0 overflow-hidden"
              >
                <BarraPronostico
                  esperando={esperando}
                  onDia={() => onAccion?.('clima-dia')}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <GraficosClima pestana={pestana} />
        </motion.div>
      </motion.main>

      <AnimatePresence>{diaAbierto && <DetalleDia dia={PRONOSTICO[DIA_DETALLE]} onCerrar={() => onAccion?.('cerrar-dia')} />}</AnimatePresence>
    </div>
  )
}

/* ---------- Pronóstico ---------- */

/** Barra de pronóstico 6 h / 7 días (olive_next/app/weather/components/forecastBar.tsx) */
function BarraPronostico({ esperando, onDia }: { esperando: string | null; onDia: () => void }) {
  return (
    <div data-guia="clima-pronostico" className="rounded-lg bg-white px-2.5 pb-1 pt-2 shadow-md">
      <div className="flex items-center justify-between px-0.5">
        <p className="text-[11px] font-semibold tracking-wide text-[#3F4650]">PRONÓSTICO</p>
        <div className="flex gap-1 text-[10px]">
          <span className="px-2 py-0.5 text-gray-500">6 h</span>
          <span className="rounded-full bg-[#0ea5e9] px-2 py-0.5 text-white">7 días</span>
        </div>
      </div>
      <div className="mt-1.5 grid grid-cols-7 gap-1.5">
        {PRONOSTICO.map((d, i) => {
          const Icono = ICONO_CIELO[d.cielo]
          const objetivo = i === DIA_DETALLE
          const clicable = objetivo && esperando === 'clima-dia'
          return (
            <div
              key={d.dia}
              data-guia={objetivo ? 'clima-dia' : undefined}
              onClick={clicable ? onDia : undefined}
              className={cn(
                'relative flex h-[62px] items-center justify-between overflow-hidden rounded-lg bg-gradient-to-br px-2 text-white shadow',
                FONDO_CIELO[d.cielo],
                clicable && 'cursor-pointer transition-transform hover:scale-105',
              )}
            >
              <div>
                <p className="text-[9px] font-semibold">{d.dia}</p>
                <p className="text-[13px] font-bold leading-tight">
                  {d.max}° <span className="font-normal opacity-80">/ {d.min}°</span>
                </p>
                {d.lluvia !== undefined && <p className="text-[8px] font-semibold">{d.lluvia} mm</p>}
              </div>
              <Icono className="h-6 w-6 opacity-90" />
            </div>
          )
        })}
      </div>
      <p className="mt-0.5 text-right text-[8px] text-gray-400">Fuente: Open-Meteo</p>
    </div>
  )
}

/** Detalle de un día del pronóstico (olive_next/app/weather/components/forecastDetailModal.tsx) */
function DetalleDia({ dia, onCerrar }: { dia: DiaPronostico; onCerrar: () => void }) {
  const datos = [
    { etiqueta: 'Precipitación', valor: `${dia.lluvia ?? 0}`, unidad: 'mm', color: 'bg-sky-400/25' },
    { etiqueta: 'ETc proyectada', valor: '4,21', unidad: 'mm', color: 'bg-emerald-400/25' },
    { etiqueta: 'Radiación (suma)', valor: '27,6', unidad: 'MJ/m²', color: 'bg-amber-400/25' },
    { etiqueta: 'Viento máx.', valor: '11,8', unidad: 'km/h', color: 'bg-teal-400/25' },
    { etiqueta: 'Ráfagas máx.', valor: '29,5', unidad: 'km/h', color: 'bg-teal-400/25' },
    { etiqueta: 'Amanecer', valor: '06:31', unidad: '', color: 'bg-yellow-300/25' },
    { etiqueta: 'Atardecer', valor: '20:26', unidad: '', color: 'bg-orange-400/25' },
  ]
  return (
    <motion.div className="absolute inset-0 z-[35] grid place-items-center bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className="relative w-[620px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#6f7a87] to-[#454e59] p-6 text-white shadow-2xl"
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <button type="button" onClick={onCerrar} className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full hover:bg-white/15" aria-label="Cerrar">
          <X className="h-5 w-5" />
        </button>
        <div className="flex gap-6">
          <div className="w-[190px] shrink-0">
            <p className="text-sm font-semibold">{dia.dia}</p>
            <p className="mt-1 text-[52px] font-extrabold leading-[1.05]">
              {dia.max}° /<br />
              {dia.min}°
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-base">
              <CloudFog className="h-5 w-5" /> Niebla
            </p>
          </div>
          <div className="mt-7 grid flex-1 grid-cols-2 gap-2">
            {datos.map((d) => (
              <div key={d.etiqueta} className={cn('rounded-lg border border-white/25 px-3 py-1.5', d.color)}>
                <p className="text-[11px] opacity-85">{d.etiqueta}</p>
                <p className="text-lg font-bold leading-tight">
                  {d.valor} <span className="text-[11px] font-normal">{d.unidad}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-4 text-center text-[10px] opacity-70">
          Pronóstico provisto por Open-Meteo (proveedor externo): no proviene de tus estaciones.
        </p>
      </motion.div>
    </motion.div>
  )
}

/* ---------- Gráficos ---------- */

const PESTANAS: { id: PestanaClima | null; nombre: string; icono: LucideIcon }[] = [
  { id: 'eto', nombre: 'Evapotranspiración', icono: Droplet },
  { id: 'temp', nombre: 'Temp. y humedad', icono: Thermometer },
  { id: null, nombre: 'DPV y rocío', icono: Droplet },
  { id: null, nombre: 'Radiación', icono: SunDim },
  { id: null, nombre: 'Viento', icono: Wind },
  { id: 'frio', nombre: 'Frío', icono: Snowflake },
  { id: null, nombre: 'Días grado', icono: Sun },
]
const TITULOS: Record<PestanaClima, string> = {
  eto: 'Evapotranspiración y lluvia',
  temp: 'Temperatura y humedad',
  frio: 'Horas frío acumuladas · Temporada 2026',
}

/** Un gráfico a la vista y las pestañas de variables abajo */
function GraficosClima({ pestana }: { pestana: PestanaClima }) {
  // La guía elige la pestaña; el usuario puede cambiarla hasta que la guía pida otra
  const [activa, setActiva] = useState(pestana)
  useEffect(() => setActiva(pestana), [pestana])
  const [cursor, setCursor] = useState<number | null>(null)

  return (
    <div data-guia="clima-grafico" className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg bg-white shadow-md">
      <div className="flex items-center px-3 pt-2">
        {activa === 'eto' && (
          <span className="rounded-full bg-[#109a4c] px-2.5 py-0.5 text-[10px] font-semibold text-white">Kc (ver. 2026-2027)</span>
        )}
        <p className="flex-1 text-center text-[13px] font-semibold text-[#212427]">{TITULOS[activa]}</p>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activa}
          className="flex min-h-0 flex-1 flex-col"
          initial={{ x: 60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {activa === 'eto' && <GraficoEtc cursor={cursor} onCursor={setCursor} />}
          {activa === 'temp' && <GraficoTemperatura cursor={cursor} onCursor={setCursor} />}
          {activa === 'frio' && <GraficoFrio />}
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-center gap-1 border-t border-slate-100 px-2 py-1.5 text-[10px]">
        {PESTANAS.map((p) => (
          <button
            key={p.nombre}
            type="button"
            disabled={!p.id}
            onClick={() => p.id && setActiva(p.id)}
            className={cn(
              'flex items-center gap-1 rounded-full px-2.5 py-1',
              p.id === activa ? 'bg-[#f59e0b] font-semibold text-white' : 'text-gray-500',
              p.id && p.id !== activa && 'hover:bg-gray-100',
            )}
          >
            <p.icono className="h-3 w-3" /> {p.nombre}
          </button>
        ))}
      </div>
    </div>
  )
}

const ALTO = 300
const ALTO_P = ALTO - ARRIBA - 22

function Ejes({ ancho, marcas, y, unidad }: { ancho: number; marcas: number[]; y: (v: number) => number; unidad: string }) {
  const PLOT = plotDe(ancho)
  return (
    <>
      {marcas.map((v) => (
        <g key={v}>
          <line x1={IZQ} x2={IZQ + PLOT} y1={y(v)} y2={y(v)} stroke="#f1f5f9" strokeWidth="0.8" />
          <text x={IZQ - 6} y={y(v) + 3} fontSize="8" fill="#64748b" textAnchor="end">
            {v}
          </text>
        </g>
      ))}
      <text x={10} y={ARRIBA + ALTO_P / 2} fontSize="8" fill="#64748b" textAnchor="middle" transform={`rotate(-90 10 ${ARRIBA + ALTO_P / 2})`}>
        {unidad}
      </text>
      <line x1={IZQ} x2={IZQ + PLOT} y1={ARRIBA + ALTO_P} y2={ARRIBA + ALTO_P} stroke="#94a3b8" strokeWidth="0.8" />
    </>
  )
}

/** ETc diaria y lluvia */
function GraficoEtc({ cursor, onCursor, ancho = ANCHO }: PropsGrafico) {
  const PLOT = plotDe(ancho)
  const y = (v: number) => ARRIBA + (1 - v / 6) * ALTO_P
  const dia = PLOT / DIAS
  const d = cursor === null ? null : Math.min(DIAS - 1, Math.floor(cursor * DIAS))
  return (
    <>
      <svg viewBox={`0 0 ${ancho} ${ALTO}`} className="min-h-0 w-full flex-1" onMouseMove={(e) => onCursor(fraccion(e, ancho))} onMouseLeave={() => onCursor(null)}>
        <Ejes ancho={ancho} marcas={[0, 2, 4, 6]} y={y} unidad="ETc (mm)" />
        {d !== null && <rect x={IZQ + d * dia} y={ARRIBA} width={dia} height={ALTO_P} fill="#084d6e" fillOpacity="0.07" />}
        {ETC.map((v, i) => (
          <g key={i}>
            <rect x={IZQ + i * dia + dia * 0.18} y={y(v)} width={dia * 0.3} height={y(0) - y(v)} fill="#109a4c" />
            {LLUVIA[i] > 0 && <rect x={IZQ + i * dia + dia * 0.52} y={y(LLUVIA[i])} width={dia * 0.3} height={y(0) - y(LLUVIA[i])} fill="#A9BFDB" />}
          </g>
        ))}
        <EjeFechas y={ARRIBA + ALTO_P} plot={PLOT} />
        {d !== null && cursor !== null && (
          <Globo ancho={ancho} x={IZQ + cursor * PLOT} y={ARRIBA + 4} lineas={[FECHAS[d], `ETc ${fmt(ETC[d])} mm · Lluvia ${fmt(LLUVIA[d], 1)} mm`]} />
        )}
      </svg>
      <div className="flex justify-center gap-4 pb-1 text-[10px] text-gray-500">
        <Leyenda color="#109a4c" texto="ETc" />
        <Leyenda color="#A9BFDB" texto="Lluvia" />
      </div>
    </>
  )
}

/** Temperatura (°C, eje izquierdo) y humedad relativa (%, escalada al mismo alto) */
function GraficoTemperatura({ cursor, onCursor, ancho = ANCHO }: PropsGrafico) {
  const PLOT = plotDe(ancho)
  const y = (t: number) => ARRIBA + (1 - t / 40) * ALTO_P
  const yH = (h: number) => ARRIBA + (1 - h / 100) * ALTO_P
  const x = (i: number) => IZQ + (i / (PUNTOS - 1)) * PLOT
  const linea = (serie: number[], f: (v: number) => number) => serie.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${f(v).toFixed(1)}`).join('')
  const i = cursor === null ? null : Math.round(cursor * (PUNTOS - 1))
  return (
    <>
      <svg viewBox={`0 0 ${ancho} ${ALTO}`} className="min-h-0 w-full flex-1" onMouseMove={(e) => onCursor(fraccion(e, ancho))} onMouseLeave={() => onCursor(null)}>
        <Ejes ancho={ancho} marcas={[0, 10, 20, 30, 40]} y={y} unidad="°C" />
        {/* Escala de la humedad (%), en azul al lado derecho */}
        {[25, 50, 75, 100].map((h) => (
          <text key={h} x={IZQ + PLOT - 2} y={yH(h) - 3} fontSize="8" fill="#3b82f6" textAnchor="end">
            {h} %
          </text>
        ))}
        <path d={linea(HUMEDAD, yH)} fill="none" stroke="#3b82f6" strokeWidth="1.4" strokeLinejoin="round" />
        <path d={linea(TEMP, y)} fill="none" stroke="#ef4444" strokeWidth="1.6" strokeLinejoin="round" />
        <EjeFechas y={ARRIBA + ALTO_P} plot={PLOT} />
        {i !== null && (
          <g>
            <line x1={x(i)} x2={x(i)} y1={ARRIBA} y2={ARRIBA + ALTO_P} stroke="#084d6e" strokeWidth="1" strokeDasharray="3 3" />
            <Globo
              ancho={ancho}
              x={x(i)}
              y={ARRIBA + 4}
              lineas={[`${FECHAS[Math.floor(i / 8)]} ${String((i % 8) * 3).padStart(2, '0')}:00`, `${fmt(TEMP[i], 1)} °C · ${fmt(HUMEDAD[i], 0)} % humedad`]}
            />
          </g>
        )}
      </svg>
      <div className="flex justify-center gap-4 pb-1 text-[10px] text-gray-500">
        <Leyenda color="#ef4444" texto="Temperatura" />
        <Leyenda color="#3b82f6" texto="Humedad relativa" />
      </div>
    </>
  )
}

/** Horas frío acumuladas en la temporada (mayo a agosto) contra el objetivo del cultivo */
function GraficoFrio({ ancho = ANCHO }: { ancho?: number }) {
  const PLOT = plotDe(ancho)
  const OBJETIVO = 850
  const TOTAL = 930
  const MESES = ['May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov']
  const puntos = 140
  // Acumulación en forma de S: lenta en mayo, rápida en invierno, se detiene en septiembre
  const acum = Array.from({ length: puntos }, (_, i) => {
    const t = i / (puntos - 1)
    return TOTAL / (1 + Math.exp(-(t - 0.28) * 16))
  })
  const y = (v: number) => ARRIBA + (1 - v / 1000) * ALTO_P
  const x = (i: number) => IZQ + (i / (puntos - 1)) * PLOT
  const linea = acum.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('')
  return (
    <>
      <svg viewBox={`0 0 ${ancho} ${ALTO}`} className="min-h-0 w-full flex-1">
        <Ejes ancho={ancho} marcas={[0, 250, 500, 750, 1000]} y={y} unidad="Horas frío" />
        <path d={`${linea}L${x(puntos - 1)},${y(0)}L${x(0)},${y(0)}Z`} fill="#3f72dc" fillOpacity="0.12" />
        <path d={linea} fill="none" stroke="#3f72dc" strokeWidth="2" />
        <line x1={IZQ} x2={IZQ + PLOT} y1={y(OBJETIVO)} y2={y(OBJETIVO)} stroke="#ef4444" strokeWidth="1.6" strokeDasharray="6 4" />
        <text x={IZQ + 6} y={y(OBJETIVO) - 5} fontSize="9" fill="#ef4444" fontWeight="600">
          Objetivo {fmt(OBJETIVO, 0)} h
        </text>
        <text x={IZQ + PLOT - 6} y={y(TOTAL) - 6} fontSize="10" fill="#3f72dc" fontWeight="700" textAnchor="end">
          Llevas {fmt(TOTAL, 0)} h · {Math.round((TOTAL / OBJETIVO) * 100)} % del objetivo
        </text>
        {MESES.map((m, k) => (
          <text key={m} x={IZQ + ((k + 0.5) / MESES.length) * PLOT} y={ARRIBA + ALTO_P + 13} fontSize="8" fill="#64748b" textAnchor="middle">
            {m}
          </text>
        ))}
      </svg>
      <div className="flex justify-center gap-4 pb-1 text-[10px] text-gray-500">
        <Leyenda color="#3f72dc" texto="Horas frío acumuladas" />
        <Leyenda color="#ef4444" texto="Objetivo del cultivo" />
      </div>
    </>
  )
}
