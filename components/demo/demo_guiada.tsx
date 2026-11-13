'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, MousePointerClick, Pause, Play, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import MarcoDemo from './marco_demo'
import OliveHomeDemo from './olive_home_demo'
import SueloDemo from './suelo_demo'
import PlantaDemo from './planta_demo'
import PozoDemo from './pozo_demo'
import ClimaDemo from './clima_demo'
import RiegoDemo from './riego_demo'
import IndicadoresDemo from './indicadores_demo'
import MonitoreoDemo from './monitoreo_demo'
import FocoGuia from './foco_guia'
import { DURACION_PASO, TOURS, type PantallaDemo } from './guia_pasos'
import { MODULOS_DEMO } from './demo_datos'

/**
 * Demo guiada: la réplica de Olive+ con un foco que recorre los módulos, y a su izquierda un panel
 * con la historia y los controles (fuera del escalado, para que se lea en cualquier pantalla).
 * En pantallas angostas el panel baja bajo la demo.
 *
 * Avanza sola; se pausa al pasar el mouse sobre la demo, cuando sale de la pantalla o con el botón.
 * Con `prefers-reduced-motion` parte en pausa. Un clic en un módulo de la demo salta a su paso.
 *
 * Cada pantalla (home, suelo…) tiene su propio tour: al entrar a un módulo parte su tour, y al volver
 * al inicio se retoma el home en la exploración libre.
 */
/** Ruta de cada pantalla en Olive+, para la barra de direcciones */
const RUTAS: Record<PantallaDemo, string> = { home: 'home', suelo: 'soil', planta: 'plant', pozo: 'watersources', clima: 'weather', riego: 'irrigation', indicadores: 'indicators', monitoreo: 'monitor' }

export default function DemoGuiada() {
  const raiz = useRef<HTMLDivElement>(null)
  const contenedor = useRef<HTMLDivElement>(null)
  const [pantalla, setPantalla] = useState<PantallaDemo>('home')
  const [paso, setPaso] = useState(0)
  const [pausaUsuario, setPausaUsuario] = useState(false)
  const [encima, setEncima] = useState(false)
  const [visible, setVisible] = useState(false)

  const pasos = TOURS[pantalla]
  const total = pasos.length
  const actual = pasos[paso]
  const esUltimo = paso === total - 1
  // Home sin objetivo = exploración libre: sin foco y los módulos se abren de verdad
  const libre = pantalla === 'home' && actual.objetivo === null
  // Un paso que espera el clic del usuario no avanza solo
  const esperaClic = !!actual.esperaClic
  const pausado = pausaUsuario || encima || !visible || esUltimo || esperaClic

  // El estado de cada módulo sale del paso en que vamos (por `id` de paso), así "Anterior" y los
  // saltos dejan todo coherente: sector verde antes del clic, informe solo en su paso, etc.
  const idx = (id: string) => pasos.findIndex((p) => p.id === id)
  const despuesDe = (id: string) => idx(id) >= 0 && paso > idx(id)
  const desde = (id: string) => idx(id) >= 0 && paso >= idx(id)
  const sector = despuesDe('sector') ? '13' : '16'

  // El usuario tocó algo dentro de la demo: si es lo que el paso esperaba, avanzamos
  const accion = useCallback(
    (que: string) => {
      const esperado = actual.esperaClic && actual.objetivo === que
      // Cerrar la ventana del paso en curso ('cerrar-informe', 'cerrar-detalle', 'cerrar-dia'…) también avanza
      const cierraVentana = !!actual.id && que === `cerrar-${actual.id}`
      if (esperado || cierraVentana) setPaso((n) => n + 1)
    },
    [actual],
  )
  // Ícono del panel: el del módulo enfocado en el home, o el del módulo en que estamos
  const modulo = MODULOS_DEMO.find((m) => m.id === (pantalla === 'home' ? actual.objetivo : pantalla))

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPausaUsuario(true)
  }, [])

  // Solo corre mientras se ve
  useEffect(() => {
    const el = contenedor.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const ir = useCallback((i: number) => setPaso(Math.max(0, Math.min(total - 1, i))), [total])

  const clicModulo = useCallback((id: string) => {
    const i = TOURS.home.findIndex((p) => p.objetivo === id)
    if (i >= 0) setPaso(i)
  }, [])

  const irPantalla = useCallback((p: PantallaDemo) => {
    setPantalla(p)
    setPaso(p === 'home' ? TOURS.home.length - 1 : 0)
  }, [])

  // Módulos con pantalla en la demo; el resto muestra "Iniciando…" y se queda en el home
  const abrirModulo = useCallback((id: string) => {
    if (id in TOURS) irPantalla(id as PantallaDemo)
  }, [irPantalla])

  return (
    <div ref={contenedor} className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">
      {/* Demo: a la derecha en escritorio, arriba en celular */}
      <div className="lg:order-2" onMouseEnter={() => setEncima(true)} onMouseLeave={() => setEncima(false)}>
        <MarcoDemo url={`oliveplus.cl/${RUTAS[pantalla]}`}>
          <div ref={raiz} className="relative h-full w-full">
            {pantalla === 'home' ? (
              <OliveHomeDemo onClickModulo={libre ? undefined : clicModulo} onAbrirModulo={abrirModulo} />
            ) : pantalla === 'monitoreo' ? (
              <MonitoreoDemo
                campo={desde('norte') ? 'norte' : 'demo'}
                rotando={desde('rotacion') && !actual.cierre}
                esperando={esperaClic ? actual.objetivo : null}
                onAccion={accion}
                onInicio={() => irPantalla('home')}
              />
            ) : pantalla === 'indicadores' ? (
              <IndicadoresDemo
                editando={desde('editar')}
                agregado={desde('agregado')}
                esperando={esperaClic ? actual.objetivo : null}
                onAccion={accion}
                onInicio={() => irPantalla('home')}
              />
            ) : pantalla === 'riego' ? (
              <RiegoDemo
                // Las comparativas se cierran solas al pasar al paso marcado con `fin-…`
                comparando={
                  (desde('comparar') && !desde('fin-comparar')) ||
                  (desde('comparar-graficos') && !desde('fin-comparar-graficos'))
                }
                etc={desde('equipos')}
                informeAbierto={idx('informe') >= 0 && paso === idx('informe')}
                // El informe del sector sigue abierto en el paso que cuenta la comparativa; se cierra al llegar al cierre
                informeSectorAbierto={idx('informe-sector') >= 0 && paso === idx('informe-sector')}
                detalleComparando={desde('detalle-comparativa')}
                capasAbiertas={idx('capas') >= 0 && paso === idx('capas')}
                vista={
                  desde('detalle')
                    ? 'detalle'
                    : desde('sectores')
                    ? 'sectores'
                    : desde('vuelta-riego')
                      ? 'equipos'
                      : desde('ferti')
                        ? 'ferti'
                        : desde('equipos')
                          ? 'equipos'
                          : 'mapa'
                }
                esperando={esperaClic ? actual.objetivo : null}
                onAccion={accion}
                onInicio={() => irPantalla('home')}
              />
            ) : pantalla === 'clima' ? (
              <ClimaDemo
                pestana={desde('acumulaciones') ? 'frio' : desde('variables') ? 'temp' : 'eto'}
                esperando={esperaClic ? actual.objetivo : null}
                pronosticoAbierto={desde('pronostico')}
                diaAbierto={idx('dia') >= 0 && paso === idx('dia')}
                onAccion={accion}
                onInicio={() => irPantalla('home')}
              />
            ) : pantalla === 'pozo' ? (
              <PozoDemo
                enfoque={actual.objetivo}
                esperando={esperaClic ? actual.objetivo : null}
                detalleAbierto={desde('detalle')}
                onAccion={accion}
                onInicio={() => irPantalla('home')}
              />
            ) : pantalla === 'planta' ? (
              <PlantaDemo
                enfoque={actual.objetivo}
                sector={sector}
                esperando={esperaClic ? actual.objetivo : null}
                resumenAbierto={desde('resumen')}
                onAccion={accion}
                onInicio={() => irPantalla('home')}
              />
            ) : (
              <SueloDemo
                enfoque={actual.objetivo}
                sector={sector}
                esperando={esperaClic ? actual.objetivo : null}
                informeAbierto={idx('informe') >= 0 && paso === idx('informe')}
                detalleAbierto={desde('detalle')}
                onAccion={accion}
                onInicio={() => irPantalla('home')}
              />
            )}
            <FocoGuia raiz={raiz} objetivo={actual.objetivo} radio={actual.radio} />
            <AnimatePresence>{actual.cierre && <CierreDemo onInicio={() => irPantalla('home')} />}</AnimatePresence>
          </div>
        </MarcoDemo>
      </div>

      {/* Panel de la historia: a la izquierda en escritorio, con el alto de la demo */}
      <div className="flex flex-col rounded-2xl bg-white p-4 shadow-[0_8px_24px_rgba(6,47,72,0.06)] ring-1 ring-black/[0.06] sm:p-5 lg:order-1">
        {/* Progreso: un segmento por paso, se puede saltar a cualquiera */}
        <div className="flex gap-1">
          {pasos.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => ir(i)}
              aria-label={`Paso ${i + 1}: ${p.titulo}`}
              aria-current={i === paso ? 'step' : undefined}
              className="group relative h-5 flex-1 cursor-pointer"
            >
              <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-marca-p100 transition-colors group-hover:bg-marca-p300/60">
                {i < paso && <span className="absolute inset-0 bg-marca-primario" />}
                {i === paso && (
                  <span
                    key={`${pantalla}-${paso}`}
                    className={cn('absolute inset-0 origin-left bg-marca-primario', !esUltimo && 'avance-pestana')}
                    style={{
                      animationDuration: `${actual.duracion ?? DURACION_PASO}s`,
                      animationPlayState: pausado ? 'paused' : 'running',
                    }}
                    onAnimationEnd={() => ir(paso + 1)}
                  />
                )}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 min-h-[9.5rem] flex-1" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${pantalla}-${paso}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center gap-2.5">
                {modulo && (
                  <Image src={modulo.icono} alt="" width={32} height={32} className="h-8 w-8 shrink-0 rounded-full shadow-sm" />
                )}
                {libre && (
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-marca-ambar text-marca-ink">
                    <MousePointerClick className="h-4 w-4" aria-hidden="true" />
                  </span>
                )}
                {/* Sin numerar: no son pasos obligatorios sino cosas que se pueden hacer */}
                {modulo && <p className="text-xs font-semibold text-marca-suave">{modulo.nombre}</p>}
              </div>
              <h3 className="mt-2 text-[17px] font-extrabold leading-snug text-marca-primario">
                {actual.titulo}
                {actual.pro && (
                  <span className="ml-2 inline-block -translate-y-px rounded-full bg-gradient-to-br from-[#ffd24d] via-[#fab500] to-[#b57f00] px-2 py-0.5 align-middle text-[10px] font-extrabold tracking-[0.18em] text-[#032f44]">
                    PRO
                  </span>
                )}
              </h3>
              <p className="mt-1.5 text-pretty text-sm leading-relaxed text-marca-tinta">{actual.texto}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex items-center">
            <BotonIcono onClick={() => ir(paso - 1)} disabled={paso === 0} etiqueta="Anterior">
              <ChevronLeft className="h-5 w-5" />
            </BotonIcono>
            {esUltimo ? (
              <BotonIcono onClick={() => ir(0)} etiqueta="Ver el tour de nuevo">
                <RotateCcw className="h-4 w-4" />
              </BotonIcono>
            ) : (
              <BotonIcono onClick={() => setPausaUsuario((v) => !v)} etiqueta={pausaUsuario ? 'Reanudar' : 'Pausar'}>
                {pausaUsuario ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </BotonIcono>
            )}
          </div>

          {esperaClic ? (
            // Para quien no quiera tocar la demo: hace el clic por él
            <button
              type="button"
              onClick={() => actual.objetivo && accion(actual.objetivo)}
              className="inline-flex h-10 items-center gap-1.5 rounded-full bg-marca-ambar px-4 text-sm font-bold text-marca-ink transition-colors hover:brightness-95"
            >
              <MousePointerClick className="h-4 w-4" aria-hidden="true" />
              Hazlo por mí
            </button>
          ) : !esUltimo && (
            <button
              type="button"
              onClick={() => ir(paso + 1)}
              className="inline-flex h-10 items-center gap-1 rounded-full bg-marca-primario pl-4 pr-3 text-sm font-bold text-white transition-colors hover:bg-marca-p700"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {esUltimo && (pantalla === 'home' || actual.cierre) && (
          <a
            href="/#contacto"
            className="mt-3 inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-marca-verde px-5 text-sm font-bold text-white transition-colors hover:bg-marca-verdeOscuro"
          >
            Hablemos de tu campo
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        )}

        {pantalla !== 'home' && (
          <button
            type="button"
            onClick={() => irPantalla('home')}
            className="mt-3 inline-flex h-10 items-center justify-center gap-2 rounded-full border border-marca-p100 px-5 text-sm font-bold text-marca-primario transition-colors hover:bg-marca-p50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Volver al inicio
          </button>
        )}
      </div>
    </div>
  )
}

function BotonIcono({
  children,
  onClick,
  etiqueta,
  disabled,
}: {
  children: React.ReactNode
  onClick: () => void
  etiqueta: string
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={etiqueta}
      title={etiqueta}
      className="grid h-10 w-10 place-items-center rounded-full text-marca-primario transition-colors hover:bg-marca-p50 disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  )
}

/** Cierre de la ruta de un módulo: tapa la demo con la invitación a contactarnos */
function CierreDemo({ onInicio }: { onInicio: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#063D58]/85 px-24 text-center text-white backdrop-blur-[3px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
        <p className="text-[52px] font-extrabold leading-tight">¿Te interesa?</p>
        <p className="mx-auto mt-4 max-w-[760px] text-[26px] leading-snug text-white/85">
          Esto es solo una parte de Olive+. Si quieres conocer todas sus funciones, contáctanos y te la mostramos con
          los datos de tu campo.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <a
            href="/#contacto"
            className="inline-flex h-[68px] items-center gap-3 rounded-full bg-marca-verde px-10 text-[24px] font-bold text-white transition-colors hover:bg-marca-verdeOscuro"
          >
            Contáctanos
            <ArrowRight className="h-6 w-6" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={onInicio}
            className="inline-flex h-[68px] items-center rounded-full border-2 border-white/40 px-9 text-[22px] font-bold text-white transition-colors hover:bg-white/10"
          >
            Ver otro módulo
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
