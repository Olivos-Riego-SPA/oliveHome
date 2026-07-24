'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { MODULOS, type ModuloId } from './escena_modulos_datos'

// WebGL no existe en el servidor: la escena se carga solo en el cliente
const EscenaBloque = dynamic(() => import('./escena_bloque'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm opacity-60">
      Cargando escena 3D…
    </div>
  ),
})

type Props = {
  /** Id del módulo en foco: 'riego' | 'pozo' | 'suelo' | 'planta' | 'clima' | 'analisis'.
   *  El orden del contexto que la controla da lo mismo: la escena mapea por id. */
  moduloId: ModuloId | string
  /** Terreno en grilla de voxels en vez de malla low poly */
  voxels?: boolean
  /** Callout con nombre y descripción sobre el dispositivo activo */
  mostrarAviso?: boolean
  /** Clic sobre un dispositivo en la escena */
  onSeleccionModulo?: (id: ModuloId) => void
}

/**
 * Escena 3D de los módulos de Olive, controlada por id de módulo.
 * Ocupa el 100% de su contenedor: el padre define ancho y alto.
 */
export default function EscenaModulos3D({
  moduloId,
  voxels = false,
  mostrarAviso = true,
  onSeleccionModulo,
}: Props) {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const indice = Math.max(
    0,
    MODULOS.findIndex((m) => m.id === moduloId)
  )

  return (
    <EscenaBloque
      moduloActivo={indice}
      reducedMotion={reducedMotion}
      voxels={voxels}
      mostrarAviso={mostrarAviso}
      onSeleccionModulo={(i) => onSeleccionModulo?.(MODULOS[i].id)}
    />
  )
}
