'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChartColumn, ChevronDown, ChevronLeft, ChevronRight, CloudSun, Droplets, Expand, Gauge, Map as IconoMapa, Sprout, Thermometer, Timer, Waves } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CabeceraDemo, Ola, SelloPro } from './cabecera_demo'
import { DIAS, ETO, FECHAS, MapaSectores, PUNTOS } from './modulo_comun'

/**
 * Módulo Monitoreo de Olive+ (PRO), a grandes rasgos (olive_next/app/monitor): reúne los mismos
 * widgets de Olive+ que Indicadores, pero va corriendo solo por el campo (o los campos). Kiosco con fondo
 * aurora y widgets de vidrio (monitorBackground.tsx) que recorre solo cada sector, estación y pozo del
 * campo, unos segundos cada uno, con un anillo de cuenta regresiva. Los widgets van en otro orden que
 * Indicadores: gráfico principal arriba, mapa alto a la derecha, indicadores y un segundo gráfico abajo.
 *
 * Elementos que la guía puede enfocar: mon-tablero, mon-estado y mon-campo.
 */

export type CampoMonitoreo = 'demo' | 'norte'

type Tipo = 'sector' | 'estacion' | 'pozo'
type Elemento = {
  nombre: string
  tipo: Tipo
  /** Sector del mapa que se destaca, o punto (viewBox 400×470) de la estación o el pozo */
  sector?: string
  punto?: [number, number]
  kpis: { etiqueta: string; valor: string; nota?: string; color?: string }[]
  grafico: { titulo: string; serie: number[]; min: number; max: number; color: string; unidad: string }
}

// Series simples para el gráfico de cada elemento
const humedad = (inicio: number, consumo: number, riegos: number[]) =>
  Array.from({ length: PUNTOS }, (_, i) => {
    let v = inicio - i * consumo
    for (const d of riegos) if (i >= d * 8) v += 5 * (0.4 + 0.6 * Math.exp(-(i - d * 8) / 3)) * Math.exp(-(i - d * 8) / 45)
    return v
  })
const temperatura = (base: number) =>
  Array.from({ length: PUNTOS }, (_, i) => base + 8 * Math.sin((((i % 8) * 3 - 9) / 24) * Math.PI * 2) + Math.sin(i / 8) * 1.2)
const caudal = (q: number, horas: number) => Array.from({ length: PUNTOS }, (_, i) => ((i % 8) * 3 >= 8 && (i % 8) * 3 < 8 + horas ? q : 0))

// Notas de los indicadores: tonos brillantes, se leen sobre el fondo oscuro del kiosco
const VERDE = '#4ade80'
const ROJO = '#f87171'
const AZUL = '#60a5fa'

const CAMPOS: Record<CampoMonitoreo, { nombre: string; colores: Record<string, string>; elementos: Elemento[] }> = {
  demo: {
    nombre: 'Fundo Demo',
    colores: { '12': '#15803d', '13': '#f4a3a3', '14': '#c81e1e', '15': '#15803d', '16': '#15803d' },
    elementos: [
      {
        nombre: 'Sector 12',
        tipo: 'sector',
        sector: '12',
        kpis: [
          { etiqueta: 'Humedad del suelo', valor: '47,8 %', nota: 'Óptimo', color: VERDE },
          { etiqueta: 'Potencial hídrico', valor: '−4,6 bar', nota: 'Estrés adecuado', color: VERDE },
          { etiqueta: 'Riego del período', valor: '45 mm', nota: 'frente a 46,8 mm de ETc' },
          { etiqueta: 'Desempeño', valor: '96 %', nota: 'Óptimo', color: VERDE },
        ],
        grafico: { titulo: 'Humedad del suelo', serie: humedad(49, 0.05, [3, 7, 11]), min: 30, max: 64, color: '#2196f3', unidad: '%' },
      },
      {
        nombre: 'Sector 13',
        tipo: 'sector',
        sector: '13',
        kpis: [
          { etiqueta: 'Humedad del suelo', valor: '31,2 %', nota: 'Seco', color: ROJO },
          { etiqueta: 'Potencial hídrico', valor: '−11,1 bar', nota: 'Estrés moderado', color: ROJO },
          { etiqueta: 'Riego del período', valor: '20 mm', nota: 'frente a 46,8 mm de ETc' },
          { etiqueta: 'Desempeño', valor: '43 %', nota: 'Bajo el mínimo', color: ROJO },
        ],
        grafico: { titulo: 'Humedad del suelo', serie: humedad(41, 0.09, [5]), min: 28, max: 64, color: '#2196f3', unidad: '%' },
      },
      {
        nombre: 'Estación Fundo Demo',
        tipo: 'estacion',
        punto: [150, 95],
        kpis: [
          { etiqueta: 'Temp. máxima', valor: '28,8 °C' },
          { etiqueta: 'ETc del día', valor: '3,9 mm' },
          { etiqueta: 'Horas frío', valor: '930', nota: '109 % del objetivo', color: VERDE },
          { etiqueta: 'Días grado (base 5°)', valor: '422' },
        ],
        grafico: { titulo: 'Temperatura Ambiente y Humedad', serie: temperatura(16), min: 0, max: 40, color: '#ef4444', unidad: '°C' },
      },
      {
        nombre: 'Pozo Norte',
        tipo: 'pozo',
        punto: [300, 420],
        kpis: [
          { etiqueta: 'Caudal', valor: '18,5 l/s', nota: 'bajo el permitido (25 l/s)', color: VERDE },
          { etiqueta: 'Nivel freático', valor: '12,40 m' },
          { etiqueta: 'Volumen total', valor: '48.320 m³' },
          { etiqueta: 'Envío DGA', valor: 'Exitoso', nota: '12/11 15:00', color: VERDE },
        ],
        grafico: { titulo: 'Caudal del pozo', serie: caudal(18.5, 10), min: 0, max: 30, color: '#00c1c6', unidad: 'l/s' },
      },
    ],
  },
  norte: {
    nombre: 'Fundo Norte',
    colores: { '12': '#f4a3a3', '13': '#15803d', '14': '#c81e1e', '15': '#15803d', '16': '#15803d' },
    elementos: [
      {
        nombre: 'Sector 31',
        tipo: 'sector',
        sector: '15',
        kpis: [
          { etiqueta: 'Humedad del suelo', valor: '49,1 %', nota: 'Óptimo', color: VERDE },
          { etiqueta: 'Potencial hídrico', valor: '−4,1 bar', nota: 'Estrés adecuado', color: VERDE },
          { etiqueta: 'Riego del período', valor: '51 mm', nota: 'frente a 49,0 mm de ETc' },
          { etiqueta: 'Desempeño', valor: '104 %', nota: 'Óptimo', color: VERDE },
        ],
        grafico: { titulo: 'Humedad del suelo', serie: humedad(50, 0.05, [2, 6, 10, 13]), min: 30, max: 64, color: '#2196f3', unidad: '%' },
      },
      {
        nombre: 'Sector 32',
        tipo: 'sector',
        sector: '14',
        kpis: [
          { etiqueta: 'Humedad del suelo', valor: '57,6 %', nota: 'Saturado', color: AZUL },
          { etiqueta: 'Potencial hídrico', valor: '−3,0 bar', nota: 'Estrés por saturación', color: AZUL },
          { etiqueta: 'Riego del período', valor: '70 mm', nota: 'frente a 49,0 mm de ETc' },
          { etiqueta: 'Desempeño', valor: '143 %', nota: 'Sobre el máximo', color: ROJO },
        ],
        grafico: { titulo: 'Humedad del suelo', serie: humedad(55, 0.03, [1, 4, 7, 10, 13]), min: 30, max: 64, color: '#2196f3', unidad: '%' },
      },
      {
        nombre: 'Estación Fundo Norte',
        tipo: 'estacion',
        punto: [250, 70],
        kpis: [
          { etiqueta: 'Temp. máxima', valor: '27,1 °C' },
          { etiqueta: 'ETc del día', valor: '3,6 mm' },
          { etiqueta: 'Horas frío', valor: '1.020', nota: '120 % del objetivo', color: VERDE },
          { etiqueta: 'Días grado (base 5°)', valor: '388' },
        ],
        grafico: { titulo: 'Temperatura Ambiente y Humedad', serie: temperatura(14.5), min: 0, max: 40, color: '#ef4444', unidad: '°C' },
      },
      {
        nombre: 'Pozo Las Vertientes',
        tipo: 'pozo',
        punto: [90, 400],
        kpis: [
          { etiqueta: 'Caudal', valor: '12,0 l/s', nota: 'bajo el permitido (20 l/s)', color: VERDE },
          { etiqueta: 'Nivel freático', valor: '8,90 m' },
          { etiqueta: 'Volumen total', valor: '22.410 m³' },
          { etiqueta: 'Envío DGA', valor: 'Exitoso', nota: '12/11 15:00', color: VERDE },
        ],
        grafico: { titulo: 'Caudal del pozo', serie: caudal(12, 7), min: 0, max: 30, color: '#00c1c6', unidad: 'l/s' },
      },
    ],
  },
}

/** Segundos que se muestra cada elemento (en Olive+ se configura en "Tiempos") */
const SEGUNDOS = 5

const ICONO_TIPO: Record<Tipo, typeof Sprout> = { sector: Sprout, estacion: CloudSun, pozo: Waves }
const NOMBRE_TIPO: Record<Tipo, string> = { sector: 'Sector', estacion: 'Estación', pozo: 'Pozo' }
// Widget de indicadores de cada tipo, con el nombre del catálogo de Indicadores (widgetCatalog.ts)
const WIDGET_KPIS: Record<Tipo, string> = { sector: 'Indicadores de riego por sector', estacion: 'Indicadores climáticos', pozo: 'Lista de pozos' }

/** Segundo gráfico de cada elemento (barras diarias del período) */
const KC = 0.85
const diario = (dias: number[], mm: number) => ETO.map((_, d) => (dias.includes(d) ? mm : 0))
const BARRAS: Record<string, { titulo: string; valores: number[]; color: string; unidad: string }> = {
  'Sector 12': { titulo: 'Riego diario por sector', valores: diario([3, 7, 11], 4.1), color: '#38bdf8', unidad: 'mm' },
  'Sector 13': { titulo: 'Riego diario por sector', valores: diario([5], 1.5), color: '#38bdf8', unidad: 'mm' },
  'Sector 31': { titulo: 'Riego diario por sector', valores: diario([2, 6, 10, 13], 4.3), color: '#38bdf8', unidad: 'mm' },
  'Sector 32': { titulo: 'Riego diario por sector', valores: diario([1, 4, 7, 10, 13], 5.6), color: '#38bdf8', unidad: 'mm' },
  'Estación Fundo Demo': { titulo: 'Evapotranspiración y Lluvia', valores: ETO.map((v) => v * KC), color: '#4ade80', unidad: 'mm' },
  'Estación Fundo Norte': { titulo: 'Evapotranspiración y Lluvia', valores: ETO.map((v) => v * KC * 0.93), color: '#4ade80', unidad: 'mm' },
  'Pozo Norte': { titulo: 'Volumen extraído', valores: ETO.map((_, d) => 666 + ((d * 37) % 90) - 45), color: '#fbbf24', unidad: 'm³' },
  'Pozo Las Vertientes': { titulo: 'Volumen extraído', valores: ETO.map((_, d) => 302 + ((d * 29) % 70) - 35), color: '#fbbf24', unidad: 'm³' },
}

export default function MonitoreoDemo({
  campo = 'demo',
  rotando = false,
  esperando = null,
  onAccion,
  onInicio,
}: {
  campo?: CampoMonitoreo
  /** La vista recorre sola los elementos del campo */
  rotando?: boolean
  esperando?: string | null
  onAccion?: (accion: string) => void
  onInicio?: () => void
}) {
  const datos = CAMPOS[campo]
  const total = datos.elementos.length
  const [i, setI] = useState(0)

  // Al cambiar de campo parte por su primer elemento
  useEffect(() => setI(0), [campo])

  const actual = datos.elementos[i]
  const Icono = ICONO_TIPO[actual.tipo]

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0a1118] font-sans">
      <CabeceraDemo variante="modulo" onLogo={onInicio} />
      <Ola />
      <Aurora />

      <motion.main
        className="relative z-[2] flex h-[calc(100%-56px)] w-full flex-col gap-3 p-4 pt-5"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Barra de estado: campo, lo que se está viendo y la cuenta regresiva */}
        <div data-guia="mon-estado" className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-white backdrop-blur-md">
          <div className="flex items-center gap-3">
            <p className="text-[15px] font-bold">Monitoreo</p>
            <SelloPro className="text-[9px]" />
            <span
              data-guia="mon-campo"
              onClick={esperando === 'mon-campo' ? () => onAccion?.('mon-campo') : undefined}
              className={cn(
                'flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[12px]',
                esperando === 'mon-campo' && 'cursor-pointer transition-transform hover:scale-105',
              )}
            >
              {datos.nombre} <ChevronDown className="h-3.5 w-3.5" />
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setI((n) => (n - 1 + total) % total)} className="grid h-7 w-7 place-items-center rounded-full bg-white/10" aria-label="Anterior">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <AnilloCuenta
              clave={`${campo}-${i}`}
              activo={rotando}
              alTerminar={() => setI((n) => (n + 1) % total)}
            />
            <div className="w-[210px]">
              <p className="text-[9px] font-semibold uppercase tracking-wide text-white/50">Viendo · {i + 1} de {total}</p>
              <p className="flex items-center gap-1.5 text-[14px] font-bold">
                <Icono className="h-4 w-4 text-[#7dd3fc]" /> {actual.nombre}
              </p>
            </div>
            <button type="button" onClick={() => setI((n) => (n + 1) % total)} className="grid h-7 w-7 place-items-center rounded-full bg-white/10" aria-label="Siguiente">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-[11px]">
              <Timer className="h-3.5 w-3.5 text-[#7dd3fc]" /> Tiempos · {SEGUNDOS}s
            </span>
            <span className="rounded-full bg-[#109a4c] px-3 py-1.5 text-[11px] font-bold">ETc</span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10">
              <Expand className="h-4 w-4" />
            </span>
          </div>
        </div>

        {/* Kiosco: los widgets del elemento, con transición entre uno y otro; el mapa queda fijo */}
        <div data-guia="mon-tablero" className="grid min-h-0 flex-1 grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,0.95fr)] grid-rows-[minmax(0,1.1fr)_minmax(0,1fr)] gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${campo}-${actual.nombre}`}
              className="col-span-2 row-span-2 grid min-h-0 grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] grid-rows-[minmax(0,1.1fr)_minmax(0,1fr)] gap-3"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
            >
              {/* Gráfico principal, ancho */}
              <Vidrio
                className="col-span-2"
                icono={actual.tipo === 'estacion' ? Thermometer : actual.tipo === 'pozo' ? Gauge : Droplets}
                titulo={`${actual.grafico.titulo} · ${actual.nombre}`}
                extra={`${FECHAS[0]} - ${FECHAS[DIAS - 1]}`}
              >
                <GraficoElemento {...actual.grafico} />
              </Vidrio>
              {/* Indicadores del elemento */}
              <Vidrio icono={Icono} titulo={WIDGET_KPIS[actual.tipo]} extra={`${NOMBRE_TIPO[actual.tipo]} · ${datos.nombre}`}>
                <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 p-3 pt-1">
                  {actual.kpis.map((k) => (
                    <div key={k.etiqueta} className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2">
                      <p className="text-[10px] uppercase tracking-wide text-white/50">{k.etiqueta}</p>
                      <p className="text-[19px] font-bold leading-tight text-white">{k.valor}</p>
                      {k.nota && (
                        <p className="text-[10px] font-semibold" style={{ color: k.color ?? 'rgba(255,255,255,0.55)' }}>
                          {k.nota}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </Vidrio>
              {/* Segundo gráfico: barras diarias */}
              <Vidrio icono={ChartColumn} titulo={BARRAS[actual.nombre].titulo}>
                <GraficoBarras {...BARRAS[actual.nombre]} />
              </Vidrio>
            </motion.div>
          </AnimatePresence>

          {/* Mapa alto, a la derecha: destaca lo que se está viendo. Fundo Norte va espejado (otro campo). */}
          <Vidrio className="row-span-2" icono={IconoMapa} titulo={`Mapa de riego · ${datos.nombre}`}>
            <div className={cn('flex min-h-0 flex-1 flex-col pt-1', campo === 'norte' && '[transform:scaleX(-1)]')}>
              <MapaSectores seleccionado={actual.sector ?? ''} colores={datos.colores}>
                {datos.elementos
                  .filter((e) => e.punto)
                  .map((e) => {
                    const IconoPunto = ICONO_TIPO[e.tipo]
                    const activo = e === actual
                    return (
                      <span
                        key={e.nombre}
                        className={cn(
                          'absolute -ml-4 -mt-4 grid h-8 w-8 place-items-center rounded-full text-white shadow-md ring-2 ring-white transition-transform duration-300',
                          e.tipo === 'pozo' ? 'bg-[#1d6fd8]' : 'bg-[#109a4c]',
                          activo && 'scale-125 ring-4 ring-[#f5b301]',
                        )}
                        style={{ left: `${(e.punto![0] / 400) * 100}%`, top: `${(e.punto![1] / 470) * 100}%` }}
                      >
                        <IconoPunto className={cn('h-4 w-4', campo === 'norte' && '[transform:scaleX(-1)]')} />
                      </span>
                    )
                  })}
              </MapaSectores>
            </div>
          </Vidrio>
        </div>
      </motion.main>
    </div>
  )
}

/** Fondo aurora: manchas de luz verde, azul y ámbar sobre oscuro (monitorBackground.tsx) */
function Aurora() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #0a1118 0%, #0d1620 55%, #0a1016 100%)' }} />
      <div className="absolute -left-20 top-40 h-[420px] w-[520px] rounded-full bg-[#109a4c] opacity-[0.34] blur-[90px]" />
      <div className="absolute right-[-60px] top-24 h-[460px] w-[560px] rounded-full bg-[#1d6fd8] opacity-[0.32] blur-[100px]" />
      <div className="absolute bottom-[-120px] left-1/3 h-[320px] w-[480px] rounded-full bg-[#f5b301] opacity-[0.16] blur-[100px]" />
    </div>
  )
}

/** Tarjeta de vidrio del kiosco */
function Vidrio({
  icono: Icono,
  titulo,
  extra,
  className,
  children,
}: {
  icono: typeof Sprout
  titulo: string
  extra?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('flex min-h-0 flex-col rounded-xl border border-white/10 bg-white/[0.06] text-white shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-md', className)}>
      <div className="flex items-center justify-between px-3 pt-2.5">
        <p className="flex items-center gap-1.5 text-[12px] font-semibold text-white/85">
          <Icono className="h-3.5 w-3.5 text-[#7dd3fc]" /> {titulo}
        </p>
        {extra && <span className="text-[10px] text-white/45">{extra}</span>}
      </div>
      {children}
    </div>
  )
}

/** Anillo de cuenta regresiva: se llena en el tiempo de cada elemento y avisa al terminar */
function AnilloCuenta({ clave, activo, alTerminar }: { clave: string; activo: boolean; alTerminar: () => void }) {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" className="shrink-0 -rotate-90">
      <circle cx="15" cy="15" r="12" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
      <motion.circle
        key={clave}
        cx="15"
        cy="15"
        r="12"
        fill="none"
        stroke="#00c1c6"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: activo ? 1 : 0 }}
        transition={{ duration: activo ? SEGUNDOS : 0, ease: 'linear' }}
        onAnimationComplete={() => activo && alTerminar()}
      />
    </svg>
  )
}

function GraficoElemento({ serie, min, max, color, unidad }: Elemento['grafico']) {
  const W = 820
  const H = 250
  const L = 44
  const y = (v: number) => 10 + (1 - (v - min) / (max - min)) * (H - 30)
  const x = (k: number) => L + (k / (serie.length - 1)) * (W - L - 10)
  const linea = serie.map((v, k) => `${k ? 'L' : 'M'}${x(k).toFixed(1)},${y(v).toFixed(1)}`).join('')
  const marcas = [min, (min + max) / 2, max]
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="min-h-0 w-full flex-1">
      <defs>
        <linearGradient id={`relleno-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {marcas.map((v) => (
        <g key={v}>
          <line x1={L} x2={W - 10} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,0.08)" />
          <text x={L - 6} y={y(v) + 3} fontSize="10" fill="rgba(255,255,255,0.45)" textAnchor="end">
            {Math.round(v)} {unidad}
          </text>
        </g>
      ))}
      <path d={`${linea}L${x(serie.length - 1)},${y(min)}L${x(0)},${y(min)}Z`} fill={`url(#relleno-${color})`} />
      <path d={linea} fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" />
    </svg>
  )
}

function GraficoBarras({ valores, color, unidad }: { valores: number[]; color: string; unidad: string }) {
  const W = 420
  const H = 220
  const L = 38
  const max = Math.max(...valores) * 1.15 || 1
  const dia = (W - L - 8) / valores.length
  const y = (v: number) => 8 + (1 - v / max) * (H - 30)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="min-h-0 w-full flex-1">
      {[0, max / 2, max].map((v) => (
        <g key={v}>
          <line x1={L} x2={W - 8} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,0.08)" />
          <text x={L - 5} y={y(v) + 3} fontSize="9" fill="rgba(255,255,255,0.45)" textAnchor="end">
            {Math.round(v)} {unidad}
          </text>
        </g>
      ))}
      {valores.map((v, d) => (
        <rect key={d} x={L + d * dia + dia * 0.2} y={y(v)} width={dia * 0.6} height={y(0) - y(v)} rx="2" fill={color} fillOpacity={v ? 0.9 : 0} />
      ))}
      {[0, 7, 14].map((d) => (
        <text key={d} x={L + (d + 0.5) * dia} y={H - 6} fontSize="9" fill="rgba(255,255,255,0.45)" textAnchor="middle">
          {FECHAS[d]}
        </text>
      ))}
    </svg>
  )
}
