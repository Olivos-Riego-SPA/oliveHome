'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, CalendarDays, Camera, ChevronDown, CloudSun, Droplets, GripVertical, MonitorPlay, Pencil, Save, Search, Sprout, Waves } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CabeceraDemo, Ola } from './cabecera_demo'
import { DIAS, ETO, FECHAS, LLUVIA, MapaSectores, PUNTOS, Simbologia } from './modulo_comun'

/**
 * Módulo Indicadores de Olive+ (escritorio), a grandes rasgos: un tablero ya armado
 * (olive_next/app/indicators/dashmotor/dash.tsx) con su barra de opciones, y el modo edición con el
 * panel "Widgets · Arrastra para agregar". El usuario arrastra (o toca) un widget del panel y este
 * vuela al espacio libre del tablero.
 *
 * Elementos que la guía puede enfocar: ind-tablero, ind-opciones, ind-editar, ind-widget e ind-nuevo.
 */

const KC = 0.85

// Widget "Mapa de riego": los sectores del Fundo Demo pintados por desempeño
const COLOR_DESEMPENO = { sobre: '#c81e1e', optimo: '#15803d', bajo: '#f4a3a3' }
const COLORES_RIEGO: Record<string, string> = {
  '12': COLOR_DESEMPENO.optimo,
  '13': COLOR_DESEMPENO.bajo,
  '14': COLOR_DESEMPENO.sobre,
  '15': COLOR_DESEMPENO.optimo,
  '16': COLOR_DESEMPENO.optimo,
}
const SIMBOLOGIA_RIEGO = [
  { color: COLOR_DESEMPENO.sobre, nombre: 'Sobre el máximo' },
  { color: COLOR_DESEMPENO.optimo, nombre: 'Óptimo' },
  { color: COLOR_DESEMPENO.bajo, nombre: 'Bajo el mínimo' },
]
const fmt = (n: number, dec = 1) => n.toLocaleString('es-CL', { minimumFractionDigits: dec, maximumFractionDigits: dec })

// Catálogo del panel (extracto de dashmotor/widgets/widgetCatalog.ts)
const CATALOGO: { modulo: string; icono: typeof Droplets; widgets: { nombre: string; pro?: boolean; nuevo?: boolean }[] }[] = [
  { modulo: 'Riego', icono: Droplets, widgets: [{ nombre: 'Mapa de riego' }, { nombre: 'Riego por Equipo' }, { nombre: 'Scorecard de riego por sector', pro: true }] },
  { modulo: 'Suelo', icono: Waves, widgets: [{ nombre: 'Humedad del suelo' }, { nombre: 'Alertas críticas de suelo', pro: true }] },
  { modulo: 'Planta', icono: Sprout, widgets: [{ nombre: 'Potencial hídrico diario', nuevo: true }, { nombre: 'Timeline de estrés hídrico', pro: true }] },
  { modulo: 'Clima', icono: CloudSun, widgets: [{ nombre: 'Evapotranspiración y Lluvia' }, { nombre: 'Resumen climático' }] },
]

export default function IndicadoresDemo({
  editando = false,
  agregado = false,
  esperando = null,
  onAccion,
  onInicio,
}: {
  /** Modo edición: panel de widgets abierto y espacio libre marcado */
  editando?: boolean
  /** El widget nuevo ya está en el tablero */
  agregado?: boolean
  /** Elemento que la guía espera que el usuario toque (`data-guia`); solo ese responde */
  esperando?: string | null
  onAccion?: (accion: string) => void
  onInicio?: () => void
}) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#F5F5F7] font-sans">
      <CabeceraDemo variante="modulo" onLogo={onInicio} />
      <Ola />

      <motion.main
        className="relative z-[2] flex h-[calc(100%-56px)] w-full flex-col gap-3 p-4 pt-5"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Barra del tablero */}
        <div className="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-md">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-600">
              <ArrowLeft className="h-3.5 w-3.5" /> Dashboards
            </span>
            <p className="text-[15px] font-bold text-[#212427]">Tablero Fundo Demo</p>
            <span className="text-[11px] text-gray-400">{agregado ? 5 : 4} widgets</span>
          </div>
          <div data-guia="ind-opciones" className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-b from-[#0b5f86] to-[#084d6e] px-3 py-1.5 text-[12px] text-white">
              Fundo Demo <ChevronDown className="h-3.5 w-3.5" />
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-[12px] text-[#212427]">
              <CalendarDays className="h-3.5 w-3.5 text-[#084d6e]" /> {FECHAS[0]} - {FECHAS[DIAS - 1]}
            </span>
            <span className="rounded-full bg-[#109a4c] px-3 py-1.5 text-[11px] font-bold text-white">ETc</span>
            <span className="mx-1 h-6 w-px bg-gray-200" />
            {editando ? (
              <span className="flex items-center gap-1.5 rounded-full bg-[#109a4c] px-3 py-1.5 text-[12px] font-semibold text-white">
                <Save className="h-3.5 w-3.5" /> Guardar
              </span>
            ) : (
              <span
                data-guia="ind-editar"
                onClick={esperando === 'ind-editar' ? () => onAccion?.('ind-editar') : undefined}
                className={cn(
                  'flex items-center gap-1.5 rounded-full bg-[#084d6e] px-3 py-1.5 text-[12px] font-semibold text-white',
                  esperando === 'ind-editar' && 'cursor-pointer transition-transform hover:scale-105',
                )}
              >
                <Pencil className="h-3.5 w-3.5" /> Editar
              </span>
            )}
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gray-100 text-[#084d6e]" title="Presentar">
              <MonitorPlay className="h-4 w-4" />
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-gray-100 text-[#084d6e]" title="Captura">
              <Camera className="h-4 w-4" />
            </span>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 gap-3">
          {/* Tablero */}
          <div data-guia="ind-tablero" className="grid min-w-0 flex-1 grid-cols-3 grid-rows-2 gap-3">
            <Widget titulo="Mapa de riego" editando={editando} className="row-span-2">
              <MapaSectores colores={COLORES_RIEGO}>
                <Simbologia items={SIMBOLOGIA_RIEGO} />
              </MapaSectores>
            </Widget>
            <Widget titulo="Riego por Equipo" editando={editando}>
              <MiniRiegoEquipos />
            </Widget>
            <Widget titulo="Humedad del suelo" editando={editando}>
              <MiniHumedad />
            </Widget>
            <Widget titulo="Evapotranspiración y Lluvia" editando={editando}>
              <MiniEtc />
            </Widget>
            {agregado ? (
              <motion.div layoutId="widget-nuevo" data-guia="ind-nuevo" className="flex min-h-0 flex-col rounded-lg bg-white shadow-md" transition={{ type: 'spring', stiffness: 120, damping: 20 }}>
                <CabezaWidget titulo="Potencial hídrico diario" editando={editando} />
                <MiniPotencial />
              </motion.div>
            ) : (
              <div
                className={cn(
                  'grid place-items-center rounded-lg border-2 border-dashed text-[13px]',
                  editando ? 'border-[#00a3a8] bg-[#00a3a8]/5 text-[#00a3a8]' : 'border-gray-300 text-gray-400',
                )}
              >
                {editando ? 'Arrastra widgets aquí' : 'Espacio libre'}
              </div>
            )}
          </div>

          {/* Panel de widgets (modo edición) */}
          <AnimatePresence>
            {editando && (
              <motion.aside
                className="flex w-[300px] shrink-0 flex-col overflow-hidden rounded-lg bg-white shadow-md"
                initial={{ x: 320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 320, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
              >
                <div className="bg-gradient-to-br from-[#0a6a90] via-[#084d6e] to-[#063d56] px-4 py-2.5 text-white">
                  <p className="text-[14px] font-bold leading-tight">Widgets</p>
                  <p className="text-[10px] text-white/60">Arrastra para agregar</p>
                </div>
                <div className="m-3 flex items-center gap-2 rounded-lg border border-gray-200 px-2.5 py-1.5 text-[11px] text-gray-400">
                  <Search className="h-3.5 w-3.5" /> Buscar widgets...
                </div>
                <div className="min-h-0 flex-1 space-y-3 overflow-hidden px-3 pb-3">
                  {CATALOGO.map((g) => (
                    <div key={g.modulo}>
                      <p className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                        <g.icono className="h-3 w-3" /> {g.modulo}
                      </p>
                      <div className="space-y-1">
                        {g.widgets.map((w) =>
                          w.nuevo ? (
                            !agregado && (
                              <WidgetArrastrable
                                key={w.nombre}
                                nombre={w.nombre}
                                activo={esperando === 'ind-widget'}
                                onSoltar={() => onAccion?.('ind-widget')}
                              />
                            )
                          ) : (
                            <div key={w.nombre} className="flex items-center gap-2 rounded-md border border-gray-200 px-2 py-1.5 text-[11px] text-[#3F4650]">
                              <GripVertical className="h-3.5 w-3.5 text-gray-300" />
                              <span className="flex-1">{w.nombre}</span>
                              {w.pro && (
                                <span className="rounded-full bg-gradient-to-br from-[#ffd24d] via-[#fab500] to-[#b57f00] px-1.5 py-px text-[8px] font-extrabold tracking-wider text-[#032f44]">
                                  PRO
                                </span>
                              )}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  )
}

/**
 * El widget que se agrega. Se puede arrastrar hacia el tablero (a la izquierda) o tocar; al soltarlo
 * lejos del panel, vuela al espacio libre (layoutId compartido con el widget del tablero).
 */
function WidgetArrastrable({ nombre, activo, onSoltar }: { nombre: string; activo: boolean; onSoltar: () => void }) {
  return (
    <motion.div
      data-guia="ind-widget"
      layoutId="widget-nuevo"
      drag={activo}
      dragSnapToOrigin
      whileDrag={{ scale: 1.05, boxShadow: '0 12px 30px rgba(6,47,72,0.3)', zIndex: 60 }}
      onDragEnd={(_, info) => {
        // Soltado sobre el tablero (bien a la izquierda del panel)
        if (info.offset.x < -80) onSoltar()
      }}
      onClick={activo ? onSoltar : undefined}
      className={cn(
        'relative flex items-center gap-2 rounded-md border-2 border-[#00a3a8] bg-[#00a3a8]/10 px-2 py-1.5 text-[11px] font-semibold text-[#084d6e]',
        activo && 'cursor-grab active:cursor-grabbing',
      )}
    >
      <GripVertical className="h-3.5 w-3.5 text-[#00a3a8]" />
      <span className="flex-1">{nombre}</span>
    </motion.div>
  )
}

function Widget({ titulo, editando, className, children }: { titulo: string; editando: boolean; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('flex min-h-0 flex-col rounded-lg bg-white shadow-md', editando && 'ring-1 ring-dashed ring-gray-300', className)}>
      <CabezaWidget titulo={titulo} editando={editando} />
      {children}
    </div>
  )
}

function CabezaWidget({ titulo, editando }: { titulo: string; editando: boolean }) {
  return (
    <div className="flex items-center justify-between px-3 pt-2">
      <p className="text-[12px] font-semibold text-[#212427]">{titulo}</p>
      {editando && <GripVertical className="h-4 w-4 text-gray-300" />}
    </div>
  )
}

/* ---------- Mini gráficos de los widgets ---------- */

const W = 560
const H = 230
const L = 30
const B = 22

function Ejes({ marcas, y }: { marcas: number[]; y: (v: number) => number }) {
  return (
    <>
      {marcas.map((v) => (
        <g key={v}>
          <line x1={L} x2={W - 8} y1={y(v)} y2={y(v)} stroke="#f1f5f9" />
          <text x={L - 5} y={y(v) + 3} fontSize="9" fill="#94a3b8" textAnchor="end">
            {v}
          </text>
        </g>
      ))}
    </>
  )
}

function Fechas() {
  return (
    <>
      {[0, 7, 14].map((d) => (
        <text key={d} x={L + ((d + 0.5) / DIAS) * (W - L - 8)} y={H - 6} fontSize="9" fill="#94a3b8" textAnchor="middle">
          {FECHAS[d]}
        </text>
      ))}
    </>
  )
}

function MiniRiegoEquipos() {
  const riego = [45, 50, 20, 52, 42, 72]
  const etc = ETO.reduce((a, b) => a + b, 0) * KC
  const col = (W - L - 8) / riego.length
  const y = (v: number) => 8 + (1 - v / 80) * (H - B - 8)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="min-h-0 w-full flex-1">
      <Ejes marcas={[0, 40, 80]} y={y} />
      {riego.map((r, i) => {
        const x = L + i * col + col / 2
        return (
          <g key={i}>
            <rect x={x - 16} y={y(etc)} width={14} height={y(0) - y(etc)} fill="#109a4c" rx="1" />
            <rect x={x + 2} y={y(r)} width={14} height={y(0) - y(r)} fill="#0b4f6c" rx="1" />
            <text x={x} y={H - 6} fontSize="9" fill="#94a3b8" textAnchor="middle">
              Eq. {i + 1}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function MiniHumedad() {
  const serie = Array.from({ length: PUNTOS }, (_, i) => {
    let v = 49 - i * 0.05
    for (const dia of [3, 7, 11]) if (i >= dia * 8) v += 5 * (0.4 + 0.6 * Math.exp(-(i - dia * 8) / 3)) * Math.exp(-(i - dia * 8) / 45)
    return v
  })
  const y = (v: number) => 8 + (1 - (v - 30) / 34) * (H - B - 8)
  const x = (i: number) => L + (i / (PUNTOS - 1)) * (W - L - 8)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="min-h-0 w-full flex-1">
      <rect x={L} y={y(64)} width={W - L - 8} height={y(52) - y(64)} fill="#dbeafe" />
      <rect x={L} y={y(52)} width={W - L - 8} height={y(42) - y(52)} fill="#dcfce7" />
      <rect x={L} y={y(42)} width={W - L - 8} height={y(30) - y(42)} fill="#ffedd5" />
      <path d={serie.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('')} fill="none" stroke="#2196f3" strokeWidth="2" />
      <Fechas />
    </svg>
  )
}

function MiniEtc() {
  const dia = (W - L - 8) / DIAS
  const y = (v: number) => 8 + (1 - v / 6) * (H - B - 8)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="min-h-0 w-full flex-1">
      <Ejes marcas={[0, 3, 6]} y={y} />
      {ETO.map((v, i) => (
        <g key={i}>
          <rect x={L + i * dia + dia * 0.18} y={y(v * KC)} width={dia * 0.3} height={y(0) - y(v * KC)} fill="#109a4c" />
          {LLUVIA[i] > 0 && <rect x={L + i * dia + dia * 0.52} y={y(LLUVIA[i])} width={dia * 0.3} height={y(0) - y(LLUVIA[i])} fill="#A9BFDB" />}
        </g>
      ))}
      <Fechas />
    </svg>
  )
}

function MiniPotencial() {
  const serie = Array.from({ length: PUNTOS }, (_, i) => {
    let v = -4.3 - (i / 8) * 0.3
    for (const dia of [3, 7, 11]) if (i >= dia * 8) v += 1.2 * (1 - Math.exp(-(i - dia * 8) / 4))
    return v
  })
  const y = (v: number) => 8 + (1 - (v + 12) / 11) * (H - B - 8)
  const x = (i: number) => L + (i / (PUNTOS - 1)) * (W - L - 8)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="min-h-0 w-full flex-1">
      <Ejes marcas={[-2, -6, -10]} y={y} />
      <line x1={L} x2={W - 8} y1={y(-3.5)} y2={y(-3.5)} stroke="#1d4ed8" strokeWidth="1.6" />
      <line x1={L} x2={W - 8} y1={y(-8)} y2={y(-8)} stroke="#ef4444" strokeWidth="1.6" />
      <path d={serie.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('')} fill="none" stroke="#22c55e" strokeWidth="2" />
      <text x={W - 10} y={y(-3.5) - 4} fontSize="9" fill="#1d4ed8" textAnchor="end">
        Línea de base
      </text>
      <text x={W - 10} y={y(-8) - 4} fontSize="9" fill="#ef4444" textAnchor="end">
        Línea de riego · {fmt(-8)} bar
      </text>
      <Fechas />
    </svg>
  )
}
