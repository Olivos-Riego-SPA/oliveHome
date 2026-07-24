'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import EscenaModulos3D from '@/components/escena_modulos_3d'
import { MODULOS } from '@/components/escena_modulos_datos'

export default function EscenaLab() {
  const [activo, setActivo] = useState(0)
  const [voxels, setVoxels] = useState(false)
  const [autoCiclo, setAutoCiclo] = useState(true)

  // Modo demo: avanza al siguiente módulo cada 3s; una selección manual
  // reinicia el conteo desde ese módulo
  useEffect(() => {
    if (!autoCiclo) return
    const id = setInterval(() => setActivo((a) => (a + 1) % MODULOS.length), 3000)
    return () => clearInterval(id)
  }, [autoCiclo, activo])

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="relative h-[420px] overflow-hidden rounded-3xl bg-gradient-to-b from-sky-100 via-sky-50 to-emerald-50 sm:h-[520px]">
        <EscenaModulos3D
          moduloId={MODULOS[activo].id}
          voxels={voxels}
          onSeleccionModulo={(id) => setActivo(MODULOS.findIndex((m) => m.id === id))}
        />
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex cursor-pointer select-none items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-600 hover:border-[#084d6e]/40">
          <input
            type="checkbox"
            checked={voxels}
            onChange={(e) => setVoxels(e.target.checked)}
            className="h-4 w-4 accent-[#084d6e]"
          />
          Ver terreno en voxels
        </label>
        <label className="flex cursor-pointer select-none items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-600 hover:border-[#084d6e]/40">
          <input
            type="checkbox"
            checked={autoCiclo}
            onChange={(e) => setAutoCiclo(e.target.checked)}
            className="h-4 w-4 accent-[#084d6e]"
          />
          Ciclo automático (demo)
        </label>
        <div className="flex flex-col gap-3" role="tablist" aria-label="Módulos de Olive">
          {MODULOS.map((m, i) => (
            <button
              key={m.id}
              role="tab"
              aria-selected={activo === i}
              onClick={() => setActivo(i)}
              className={cn(
                'rounded-2xl border px-5 py-4 text-left transition-colors',
                activo === i
                  ? 'border-[#084d6e] bg-[#084d6e] text-white'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-[#084d6e]/40'
              )}
            >
              <span className="block text-base font-semibold">{m.nombre}</span>
              <span
                className={cn(
                  'mt-1 block text-sm',
                  activo === i ? 'text-white/80' : 'text-slate-500'
                )}
              >
                {m.descripcion}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
