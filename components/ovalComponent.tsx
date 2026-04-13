import React from 'react'
import './ovalComponent.css'
import { Droplet } from 'lucide-react'

interface OvaloProps {
  porcentaje: number
  active: boolean
  texto: string
}

const Ovalo: React.FC<OvaloProps> = ({ porcentaje, active, texto }) => {
  const fillHeight = Math.min(Math.max(porcentaje, 10), 100)

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div
        className={`relative w-full h-full rounded-full border-2 border-white/20 transition-all duration-500 capsule-clip ${
          active ? 'shadow-[0_0_25px_rgba(56,189,248,0.45)]' : ''
        }`}
        style={{
          background: active
            ? 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.15), rgba(255,255,255,0.02) 60%)'
            : 'rgba(255,255,255,0.04)',
        }}
      >
        {/* Gota flotante (refuerza que es agua) */}
        <div
          className={`absolute top-3 left-1/2 -translate-x-1/2 z-20 transition-opacity duration-500 ${
            active ? 'opacity-90' : 'opacity-40'
          }`}
        >
          <Droplet
            className={`w-5 h-5 ${active ? 'text-sky-200' : 'text-white/60'}`}
            fill={active ? '#7dd3fc' : 'transparent'}
            strokeWidth={2}
          />
        </div>

        {/* Contenedor del líquido */}
        <div
          className="absolute left-0 right-0 bottom-0 water-fill transition-all duration-700 ease-out"
          style={{ height: `${fillHeight}%` }}
        >
          {/* Superficie ondulante SVG */}
          <svg
            className="absolute top-0 left-0 w-[200%] h-6 -translate-y-[50%] water-wave"
            viewBox="0 0 1200 40"
            preserveAspectRatio="none"
          >
            <path
              d="M0,20 C150,0 300,40 600,20 C900,0 1050,40 1200,20 L1200,40 L0,40 Z"
              fill={active ? '#38bdf8' : '#64748b'}
              opacity={active ? 0.9 : 0.6}
            />
          </svg>
          <svg
            className="absolute top-0 left-0 w-[200%] h-6 -translate-y-[40%] water-wave-slow"
            viewBox="0 0 1200 40"
            preserveAspectRatio="none"
          >
            <path
              d="M0,20 C200,40 400,0 600,20 C800,40 1000,0 1200,20 L1200,40 L0,40 Z"
              fill={active ? '#0ea5e9' : '#475569'}
              opacity={active ? 0.7 : 0.5}
            />
          </svg>

          {/* Cuerpo del agua */}
          <div
            className="absolute inset-0 top-2"
            style={{
              background: active
                ? 'linear-gradient(to bottom, #38bdf8 0%, #0284c7 70%, #075985 100%)'
                : 'linear-gradient(to bottom, #94a3b8 0%, #64748b 70%, #475569 100%)',
            }}
          />

          {/* Burbujas */}
          <div className="bubble bubble1" />
          <div className="bubble bubble2" />
          <div className="bubble bubble3" />
          <div className="bubble bubble4" />
          <div className="bubble bubble5" />
        </div>

        {/* Brillo lateral para dar volumen */}
        <div
          className={`absolute top-0 left-2 w-2 h-full rounded-full transition-opacity duration-500 pointer-events-none ${
            active ? 'opacity-40' : 'opacity-15'
          }`}
          style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.8), transparent 60%)',
          }}
        />

        {/* Texto centrado */}
        <div className="absolute inset-0 flex items-center justify-center z-10 px-3">
          <p className="text-center text-white text-sm font-semibold leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {texto}
          </p>
        </div>
      </div>
      {active && (
        <div className="mt-3 w-0.5 h-6 bg-sky-300" />
      )}
    </div>
  )
}

export default Ovalo
