'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Droplets, Sprout, ChevronDown, Check } from 'lucide-react'
import Estrategias from './estrategias'
import quehacemos1 from './../app/public/images/quehacemos1.jpg'
import Image from 'next/image'

type PillarId = 'mision' | 'estrategias' | 'plataforma'

interface Pillar {
  id: PillarId
  icon: React.ElementType
  title: string
  summary: string
  expandable: boolean
}

const pillars: Pillar[] = [
  {
    id: 'mision',
    icon: Target,
    title: 'Nuestra Misión',
    summary:
      'Asegurar que nuestros clientes rieguen bien todos los días, reduciendo el riesgo y la incertidumbre, a través de datos, tecnología y acompañamiento experto.',
    expandable: false,
  },
  {
    id: 'estrategias',
    icon: Droplets,
    title: 'Estrategias de Riego',
    summary:
      'Somos compatibles con las principales metodologías de riego: desde calicatas hasta riego deficitario controlado. Adaptamos la plataforma a tu forma de trabajar.',
    expandable: true,
  },
  {
    id: 'plataforma',
    icon: Sprout,
    title: 'Qué hace Olive+',
    summary:
      'Más que un software: somos tu equipo de riego. Instalamos, monitoreamos y te acompañamos con datos reales del campo para que tomes mejores decisiones.',
    expandable: true,
  },
]

const oliveFeatures = [
  'Revisa tu campo en segundos desde donde estés, sin perder tiempo entre pantallas.',
  'Detecta de inmediato si algo anda mal con tus pozos, sensores o sectores.',
  'Decide cuánto regar hoy con información clara, no con suposiciones.',
  'Compara tus sectores e identifica rápidamente cuál necesita tu atención.',
  'Lleva el control de tu temporada con tus datos históricos siempre a mano.',
  'Cuenta con nuestro equipo cuando necesites ajustar, entender un dato o planificar.',
]

const NosotrosSection = () => {
  const [expanded, setExpanded] = useState<PillarId | null>(null)

  const toggle = (id: PillarId, expandable: boolean) => {
    if (!expandable) return
    setExpanded(expanded === id ? null : id)
  }

  return (
    <section id="nosotrosSection" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src={quehacemos1.src} alt="" fill style={{ objectFit: 'cover' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/85" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon
            const isOpen = expanded === pillar.id
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl p-8 flex flex-col transition-all hover:bg-white/10 hover:border-white/25 ${
                  pillar.expandable ? 'cursor-pointer' : ''
                }`}
                onClick={() => toggle(pillar.id, pillar.expandable)}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="bg-clear/20 p-3 rounded-xl border border-clear/30">
                    <Icon className="w-7 h-7 text-clear" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{pillar.title}</h3>
                </div>
                <div className="h-0.5 w-12 bg-clear rounded-full mb-5" />
                <p className="text-base text-white/85 leading-relaxed flex-1">{pillar.summary}</p>
                {pillar.expandable && (
                  <div className="mt-5 flex items-center gap-2 text-sm text-clear font-medium">
                    <span>{isOpen ? 'Ocultar detalles' : 'Ver detalles'}</span>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronDown className="w-4 h-4" />
                    </motion.span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              key={expanded}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="overflow-hidden"
            >
              <div className="mt-8 bg-white/5 backdrop-blur-md border border-white/15 rounded-2xl p-8 md:p-10">
                {expanded === 'estrategias' && <Estrategias />}
                {expanded === 'plataforma' && (
                  <div>
                    <h4 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      Una cadena de servicios completa
                    </h4>
                    <p className="text-white/70 mb-6">
                      No solo una plataforma. Un equipo que te acompaña en todo el proceso.
                    </p>
                    <div className="h-1 w-16 bg-clear rounded-full mb-8" />
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {oliveFeatures.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-clear/20 border border-clear/40 flex items-center justify-center mt-0.5">
                            <Check className="w-4 h-4 text-clear" strokeWidth={2.5} />
                          </div>
                          <p className="text-white/90 leading-relaxed">{feature}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default NosotrosSection
