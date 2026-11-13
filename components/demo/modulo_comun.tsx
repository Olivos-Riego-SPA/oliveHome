'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, Expand } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Piezas comunes de los módulos de la demo (Suelo, Planta…): el mismo Fundo Demo con sus sectores,
 * el mismo período y clima, los selectores, las tarjetas y los gráficos sincronizados por cursor.
 * Los módulos comparten campo y riego para que la historia sea coherente entre ellos.
 */

/* ---------- Período, clima y riego ---------- */

export const DIAS = 15
export const PUNTOS = DIAS * 8 // una lectura cada 3 h
export const FECHAS = Array.from({ length: DIAS }, (_, d) => {
  const f = new Date(2026, 9, 29 + d)
  return `${String(f.getDate()).padStart(2, '0')}/${String(f.getMonth() + 1).padStart(2, '0')}`
})

// Clima y lluvia son los mismos para todo el campo
export const ETO = [1.4, 1.7, 1.0, 3.8, 3.7, 3.6, 4.8, 5.0, 3.0, 5.1, 5.8, 2.5, 3.9, 5.2, 4.6]
export const LLUVIA = [0.2, 0, 0, 0, 0.2, 0, 0, 1.2, 0, 0, 0, 0, 0.8, 0.2, 0]

/** Riego aplicado por día (mm), igual en todos los módulos */
export const riegoDiario = (riegos: Record<number, number>) => ETO.map((_, d) => riegos[d] ?? 0)
export const RIEGO_SECTOR: Record<'13' | '16', number[]> = {
  '16': riegoDiario({ 3: 4.0, 7: 4.2, 11: 4.1 }),
  '13': riegoDiario({ 5: 1.5 }),
}

// Área de dibujo común a los gráficos: así el cursor cae en el mismo día en todos.
// El ancho del viewBox cambia entre la vista normal (790) y la pantalla completa.
export const ANCHO = 790
export const IZQ = 44
export const DER = 12
export const plotDe = (ancho: number) => ancho - IZQ - DER

export function useCursorAuto(activo: boolean) {
  const [x, setX] = useState<number | null>(null)
  const inicio = useRef(0)
  useEffect(() => {
    if (!activo) return setX(null)
    let id = 0
    inicio.current = performance.now()
    const paso = (t: number) => {
      const fase = ((t - inicio.current) / 6000) % 1 // 6 s ida y vuelta
      const tri = fase < 0.5 ? fase * 2 : 2 - fase * 2
      setX(0.03 + tri * 0.94)
      id = requestAnimationFrame(paso)
    }
    id = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(id)
  }, [activo])
  return x
}

/* ---------- Piezas de la interfaz ---------- */

export function Selector({ texto, className, ...resto }: { texto: string; className?: string; 'data-guia'?: string }) {
  return (
    <div
      {...resto}
      className={cn(
        'flex h-9 items-center justify-between rounded-full bg-gradient-to-b from-[#0b5f86] to-[#084d6e] px-4 text-[15px] text-white shadow-[0_3px_8px_rgba(8,77,110,0.35)]',
        className,
      )}
    >
      {texto}
      <ChevronDown className="h-4 w-4 opacity-80" />
    </div>
  )
}

export function BotonRedondo({
  children,
  className,
  onClick,
  ...resto
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  'data-guia'?: string
}) {
  return (
    <span
      {...resto}
      onClick={onClick}
      className={cn(
        'grid h-10 w-10 place-items-center rounded-full text-white',
        onClick && 'cursor-pointer transition-transform hover:scale-110',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Tarjeta({
  titulo,
  extra,
  children,
  guiaExpandir,
  onExpandir,
}: {
  titulo: string
  extra?: React.ReactNode
  children: React.ReactNode
  guiaExpandir?: string
  onExpandir?: () => void
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-lg bg-white shadow-md">
      <div className="flex items-center justify-between px-3 pt-2">
        <p className="text-[13px] font-semibold text-[#212427]">{titulo}</p>
        <div className="flex items-center gap-1.5">
          {extra}
          <span
            data-guia={guiaExpandir}
            onClick={onExpandir}
            className={cn(
              'grid h-7 w-7 place-items-center rounded-full bg-[#084d6e] text-white',
              onExpandir && 'cursor-pointer transition-transform hover:scale-110',
            )}
          >
            <Expand className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
      {children}
    </div>
  )
}

export function Leyenda({ color, texto }: { color: string; texto: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {texto}
    </span>
  )
}

/* ---------- Mapa del Fundo Demo ---------- */

// Sectores (coordenadas del viewBox 400×470, sin conservar proporción) y dónde va su sensor
export const SECTORES: { id: string; puntos: string; sensor: [number, number] }[] = [
  { id: '12', puntos: '62,128 132,102 150,196 82,222', sensor: [106, 162] },
  { id: '13', puntos: '138,98 212,74 232,166 157,192', sensor: [185, 133] },
  { id: '14', puntos: '88,232 158,206 176,298 107,324', sensor: [132, 265] },
  { id: '15', puntos: '164,202 238,176 258,266 182,292', sensor: [210, 234] },
  { id: '16', puntos: '186,302 262,274 286,372 206,400', sensor: [236, 337] },
]

/** Caja de un sector en % del mapa, para que la guía pueda enfocarlo */
function cajaSector(puntos: string) {
  const xy = puntos.split(' ').map((p) => p.split(',').map(Number))
  const xs = xy.map(([x]) => x)
  const ys = xy.map(([, y]) => y)
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]
  return { left: `${(x0 / 400) * 100}%`, top: `${(y0 / 470) * 100}%`, width: `${((x1 - x0) / 400) * 100}%`, height: `${((y1 - y0) / 470) * 100}%` }
}

/**
 * Mapa satelital estilizado del Fundo Demo. Cada módulo pinta los sectores con sus colores
 * (`colores`) y pone sus propios controles encima (`children`). El sector `objetivo` lleva un
 * `data-guia` para el foco y, si `clicable`, responde al clic.
 */
export function MapaSectores({
  seleccionado,
  colores,
  objetivo,
  clicable = false,
  onSector,
  sensor,
  children,
}: {
  /** Sector con borde blanco; sin él, ninguno va destacado */
  seleccionado?: string
  colores: Record<string, string>
  objetivo?: { id: string; guia: string }
  clicable?: boolean
  onSector?: (id: string) => void
  /** Marcador del sensor del sector seleccionado (ícono y color del módulo) */
  sensor?: { icono: React.ReactNode; color: string }
  children?: React.ReactNode
}) {
  const punto = SECTORES.find((s) => s.id === seleccionado)?.sensor
  const caja = objetivo && cajaSector(SECTORES.find((s) => s.id === objetivo.id)!.puntos)
  return (
    <div className="relative mx-2 mb-2 min-h-0 flex-1 overflow-hidden rounded-md">
      <svg viewBox="0 0 400 470" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="hileras" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="#000" strokeOpacity="0.16" strokeWidth="1.6" />
          </pattern>
          <filter id="relieve">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4" />
            <feColorMatrix values="0 0 0 0 0.24  0 0 0 0 0.25  0 0 0 0 0.17  0 0 0 0.55 0" />
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        {/* Cerros y suelo */}
        <rect width="400" height="470" fill="#6d6a4c" />
        <rect width="400" height="470" fill="#6d6a4c" filter="url(#relieve)" />
        {/* Parcelas vecinas */}
        {[
          ['10,330 80,305 98,395 28,420', '#5f6b3e'],
          ['260,60 340,36 362,128 282,152', '#77704f'],
          ['290,170 370,146 392,240 312,264', '#56663a'],
          ['300,290 380,264 400,360 322,386', '#6f7449'],
          ['20,40 110,14 126,96 40,120', '#7b7353'],
          ['110,420 190,394 202,470 120,470', '#5d6940'],
        ].map(([p, c]) => (
          <g key={p}>
            <polygon points={p} fill={c} />
            <polygon points={p} fill="url(#hileras)" />
          </g>
        ))}
        {/* Camino */}
        <path d="M0,300 C90,270 150,250 250,160 S360,40 400,20" fill="none" stroke="#c8bb98" strokeWidth="3" strokeOpacity="0.8" />
        {/* Sectores del campo, pintados por estado; el seleccionado va con borde blanco */}
        {SECTORES.map((s) => {
          const activo = clicable && s.id === objetivo?.id
          return (
            <g key={s.id} onClick={activo ? () => onSector?.(s.id) : undefined} className={activo ? 'cursor-pointer' : undefined}>
              <polygon points={s.puntos} fill="#4d5a33" />
              <polygon points={s.puntos} fill="url(#hileras)" />
              <polygon
                points={s.puntos}
                fill={colores[s.id]}
                fillOpacity={0.5}
                stroke={s.id === seleccionado ? '#fff' : colores[s.id]}
                strokeWidth={s.id === seleccionado ? 3 : 2}
                className={activo ? 'transition-[fill-opacity] hover:fill-opacity-80' : undefined}
              />
            </g>
          )
        })}
      </svg>

      {/* Sector que la guía pide tocar (no captura clics, los recibe el polígono) */}
      {objetivo && caja && <div data-guia={objetivo.guia} className="pointer-events-none absolute" style={caja} />}

      {/* Sensor del sector seleccionado */}
      {sensor && punto && (
      <motion.span
        className="absolute -ml-3 -mt-3 grid h-6 w-6 place-items-center rounded-full text-white ring-2 ring-white"
        style={{ background: sensor.color }}
        initial={false}
        animate={{ left: `${(punto[0] / 400) * 100}%`, top: `${(punto[1] / 470) * 100}%` }}
        transition={{ type: 'spring', stiffness: 160, damping: 22 }}
      >
        {sensor.icono}
      </motion.span>
      )}

      {children}
    </div>
  )
}

/** Simbología del mapa */
export function Simbologia({ items }: { items: { color: string; nombre: string }[] }) {
  return (
    <div className="absolute bottom-2 left-2 rounded-md bg-white px-2.5 py-1.5 text-[10px] leading-tight text-gray-600 shadow-md">
      <p className="mb-0.5 text-[11px] text-[#212427]">Simbología</p>
      {items.map((i) => (
        <p key={i.nombre} className="flex items-center gap-1">
          <span className="h-2 w-2" style={{ background: i.color }} />
          {i.nombre}
        </p>
      ))}
    </div>
  )
}

/* ---------- Gráficos ---------- */

export type PropsGrafico = { cursor: number | null; onCursor: (x: number | null) => void; ancho?: number }

/** Convierte la posición del mouse en fracción del período (funciona con el escalado de la demo) */
export function fraccion(e: React.MouseEvent<SVGSVGElement>, ancho: number) {
  const r = e.currentTarget.getBoundingClientRect()
  const x = ((e.clientX - r.left) / r.width) * ancho
  return Math.max(0, Math.min(1, (x - IZQ) / plotDe(ancho)))
}

export const ALTO_H = 228
export const ARRIBA = 8
export const ABAJO = 22
export const ALTO_PLOT = ALTO_H - ARRIBA - ABAJO
export const TRANSICION = { duration: 0.8, ease: [0.2, 0.7, 0.2, 1] as const }

export function GraficoBalance({
  riego,
  referencia,
  cursor,
  onCursor,
  ancho = ANCHO,
}: PropsGrafico & { riego: number[]; referencia: { nombre: string; valores: number[]; color: string } }) {
  const PLOT = plotDe(ancho)
  const max = 6
  const y = (v: number) => ARRIBA + (1 - v / max) * ALTO_PLOT
  const dia = PLOT / DIAS
  const barra = dia / 4.2
  const d = cursor === null ? null : Math.min(DIAS - 1, Math.floor(cursor * DIAS))

  return (
    <svg
      viewBox={`0 0 ${ancho} ${ALTO_H}`}
      className="min-h-0 w-full flex-1"
      onMouseMove={(e) => onCursor(fraccion(e, ancho))}
      onMouseLeave={() => onCursor(null)}
    >
      {[0, 2, 4, 6].map((v) => (
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
        mm
      </text>
      {d !== null && <rect x={IZQ + d * dia} y={ARRIBA} width={dia} height={ALTO_PLOT} fill="#084d6e" fillOpacity="0.07" />}
      {ETO.map((_, i) => {
        const x0 = IZQ + i * dia + (dia - barra * 3.2) / 2
        return (
          <g key={i}>
            {(
              [
                [LLUVIA[i], '#A9BFDB'],
                [riego[i], '#084d6e'],
                [referencia.valores[i], referencia.color],
              ] as const
            ).map(([v, c], k) => (
              // Las barras de riego crecen o se esconden al cambiar de sector
              <motion.rect
                key={k}
                x={x0 + k * barra * 1.1}
                width={barra}
                fill={c}
                rx="1"
                initial={false}
                animate={{ y: y(v), height: y(0) - y(v) }}
                transition={TRANSICION}
              />
            ))}
          </g>
        )
      })}
      <line x1={IZQ} x2={IZQ + PLOT} y1={ARRIBA + ALTO_PLOT} y2={ARRIBA + ALTO_PLOT} stroke="#94a3b8" strokeWidth="0.8" />
      <EjeFechas y={ARRIBA + ALTO_PLOT} plot={PLOT} />

      {cursor !== null && d !== null && (
        <g>
          <line
            x1={IZQ + cursor * PLOT}
            x2={IZQ + cursor * PLOT}
            y1={ARRIBA}
            y2={ARRIBA + ALTO_PLOT}
            stroke="#084d6e"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <Globo
            ancho={ancho}
            x={IZQ + cursor * PLOT}
            y={ARRIBA + 4}
            lineas={[FECHAS[d], `Riego ${riego[d].toFixed(1)} · ${referencia.nombre} ${referencia.valores[d].toFixed(1)} · Lluvia ${LLUVIA[d].toFixed(1)}`]}
          />
        </g>
      )}
    </svg>
  )
}

export function EjeFechas({ y, plot }: { y: number; plot: number }) {
  return (
    <>
      {[0, 3, 6, 9, 12, 14].map((d) => (
        <text key={d} x={IZQ + ((d + 0.5) / DIAS) * plot} y={y + 13} fontSize="8" fill="#64748b" textAnchor="middle">
          {FECHAS[d]}
        </text>
      ))}
    </>
  )
}

/** Globo con el valor bajo el cursor; se da vuelta cerca del borde derecho */
export function Globo({ x, y, lineas, ancho: limite }: { x: number; y: number; lineas: string[]; ancho: number }) {
  const ancho = Math.max(...lineas.map((l) => l.length)) * 4.6 + 14
  const izquierda = x + ancho + 10 > limite
  const bx = izquierda ? x - ancho - 8 : x + 8
  return (
    <g>
      <rect x={bx} y={y} width={ancho} height={lineas.length * 11 + 8} rx="4" fill="#0f2b3a" fillOpacity="0.92" />
      {lineas.map((l, k) => (
        <text key={k} x={bx + 7} y={y + 13 + k * 11} fontSize="8.5" fill="#fff" fontWeight={k === 0 ? 700 : 400}>
          {l}
        </text>
      ))}
    </g>
  )
}
