'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Droplets } from 'lucide-react'
import Ovalo from './ovalComponent'

interface Strategy {
  id: number
  nivel: number
  nombre: string
  descripcion: string
}

const strategies: Strategy[] = [
  {
    id: 1,
    nivel: 100,
    nombre: 'Calicatas',
    descripcion:
      'Consiste en cavar pozos para evaluar manualmente la humedad del suelo y decidir la cantidad de agua a aplicar. Aunque simple, tiende a sobreestimar las necesidades hídricas, resultando en un uso excesivo de agua.',
  },
  {
    id: 2,
    nivel: 80,
    nombre: 'Demanda / ETc',
    descripcion:
      'Utiliza cálculos precisos basados en la Evapotranspiración del Cultivo para determinar el agua que el cultivo realmente necesita. Considera factores como el clima y el tipo de cultivo, reduciendo el desperdicio.',
  },
  {
    id: 3,
    nivel: 55,
    nombre: 'Balance Hídrico',
    descripcion:
      'Calcula la diferencia entre el agua disponible en el suelo y la demanda del cultivo. Permite reponer únicamente el agua consumida, evitando tanto el déficit como el exceso de riego.',
  },
  {
    id: 4,
    nivel: 35,
    nombre: 'Umbral Fisiológico',
    descripcion:
      'Monitorea indicadores clave del cultivo como potencial hídrico o conductancia estomática. Se aplica agua solo cuando el cultivo muestra signos de estrés hídrico, manteniendo el rendimiento.',
  },
  {
    id: 5,
    nivel: 20,
    nombre: 'Riego Deficitario Controlado',
    descripcion:
      'Suministra agua por debajo de las necesidades hídricas completas durante etapas específicas del desarrollo. Reduce el consumo sin afectar significativamente el rendimiento.',
  },
]

const Estrategias = () => {
  const [active, setActive] = useState<number>(1)
  const current = strategies.find((s) => s.id === active) ?? strategies[0]

  return (
    <div className="w-full">
      <div className="text-center mb-2">
        <h4 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Estrategias de Riego Compatibles
        </h4>
        <p className="text-white/70 text-sm md:text-base max-w-2xl mx-auto">
          Distintas estrategias implican distinto consumo de agua. Olive+ se adapta a todas, ayudándote a migrar hacia métodos más eficientes.
        </p>
      </div>

      {/* Escala visual */}
      <div className="flex items-center justify-between max-w-4xl mx-auto mt-8 mb-4 px-2 text-xs md:text-sm text-white/70">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-sky-300" />
          <span className="font-medium">Mayor uso de agua</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Menor uso de agua</span>
          <Droplets className="w-4 h-4 text-sky-300/50" />
        </div>
      </div>

      {/* Cápsulas */}
      <div className="flex justify-center items-end gap-3 md:gap-4 mb-8 px-2">
        {strategies.map((s) => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className="flex-1 max-w-[140px] h-64 md:h-72 transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 rounded-full"
            aria-label={`Seleccionar estrategia ${s.nombre}`}
            aria-pressed={active === s.id}
          >
            <Ovalo porcentaje={s.nivel} active={active === s.id} texto={s.nombre} />
          </button>
        ))}
      </div>

      {/* Descripción de la estrategia activa */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-sky-500/10 border border-sky-400/30 rounded-xl p-6 md:p-7 max-w-4xl mx-auto backdrop-blur-sm"
        >
          <h5 className="text-xl md:text-2xl font-bold text-white mb-3">{current.nombre}</h5>
          <p className="text-white/90 leading-relaxed">{current.descripcion}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default Estrategias
