'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export interface ModuleItem {
  id: string
  title: string
  shortLabel: string
  description: string
  iconSrc: string
  previewSrc: string
  backgroundSrc: string
}

interface ModulesTabsProps {
  modules: ModuleItem[]
  autoplayMs?: number
}

const ModulesTabs: React.FC<ModulesTabsProps> = ({ modules, autoplayMs = 6000 }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isPaused) return
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % modules.length)
    }, autoplayMs)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPaused, modules.length, autoplayMs])

  const handleSelect = (index: number) => {
    setActiveIndex(index)
    setIsPaused(true)
  }

  const active = modules[activeIndex]

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Fondo con imagen del módulo activo (crossfade sobre base oscura) */}
      <div className="absolute inset-0 z-0 bg-black">
        <AnimatePresence initial={false}>
          <motion.div
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Image src={active.backgroundSrc} alt="" fill style={{ objectFit: 'cover' }} priority />
            <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/75 to-black/60" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 w-full px-4 md:px-12 lg:px-20 py-14 md:py-20">
        {/* Chips horizontales (mobile) */}
        <div className="flex md:hidden gap-2 overflow-x-auto pb-4 mb-6 -mx-4 px-4 snap-x scrollbar-hide">
          {modules.map((m, i) => (
            <button
              key={m.id}
              onClick={() => handleSelect(i)}
              className={`flex-shrink-0 snap-start px-4 py-2 rounded-full border transition-all text-sm font-medium ${
                i === activeIndex
                  ? 'bg-clear border-clear text-white'
                  : 'bg-white/10 border-white/20 text-white/80'
              }`}
              aria-label={`Ver ${m.title}`}
            >
              {m.shortLabel}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-stretch">
          {/* Tabs verticales (desktop) */}
          <nav
            className="hidden md:flex flex-col w-72 flex-shrink-0 gap-1"
            aria-label="Módulos de Olive+"
          >
            {modules.map((m, i) => {
              const isActive = i === activeIndex
              return (
                <button
                  key={m.id}
                  onClick={() => handleSelect(i)}
                  className={`group relative text-left px-5 py-4 rounded-lg transition-all border ${
                    isActive
                      ? 'bg-white/10 border-white/30 backdrop-blur-sm'
                      : 'border-transparent hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 transition-opacity">
                      <Image
                        src={m.iconSrc}
                        alt=""
                        width={32}
                        height={32}
                        className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-90'}`}
                      />
                    </div>
                    <span
                      className={`font-semibold transition-colors ${
                        isActive ? 'text-white' : 'text-white/70'
                      }`}
                    >
                      {m.shortLabel}
                    </span>
                  </div>
                  {isActive && !isPaused && (
                    <motion.div
                      key={`progress-${activeIndex}`}
                      className="absolute bottom-0 left-0 h-0.5 bg-clear rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: autoplayMs / 1000, ease: 'linear' }}
                    />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Contenido del módulo activo */}
          <div className="flex-1 min-h-[420px] md:min-h-[480px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 h-full"
              >
                <div className="flex-1 max-w-2xl">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/20">
                      <Image src={active.iconSrc} alt="" width={56} height={56} />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white">{active.title}</h3>
                  </div>
                  <div className="h-1 w-16 bg-clear rounded-full mb-5" />
                  <p className="text-base md:text-lg text-white/90 leading-relaxed">
                    {active.description}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Image
                    src={active.previewSrc}
                    alt={`Vista previa ${active.title}`}
                    width={420}
                    height={420}
                    className="rounded-xl drop-shadow-2xl"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModulesTabs
