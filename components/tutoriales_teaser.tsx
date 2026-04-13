'use client'

import { motion } from 'framer-motion'
import { PlayCircle, ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import fondotuto from './../app/public/images/fondotuto.jpg'

interface FeaturedVideo {
  youtubeId: string
  title: string
  module: string
}

const featuredVideos: FeaturedVideo[] = [
  {
    youtubeId: 'zH_TEOkSQNM',
    title: 'Aspectos generales del Módulo Riego',
    module: 'Riego',
  },
  {
    youtubeId: 'eujhTdCrAKs',
    title: 'Aspectos básicos de la humedad de suelo',
    module: 'Suelo',
  },
  {
    youtubeId: 'K_meOXI2uu4',
    title: 'Aspectos generales del Módulo Planta',
    module: 'Planta',
  },
]

const TutorialesTeaser = () => {
  return (
    <section id="tutorialesGuias" className="relative py-20 overflow-hidden">
      {/* Fondo con overlay */}
      <div className="absolute inset-0 z-0">
        <Image src={fondotuto.src} alt="" fill style={{ objectFit: 'cover' }} />
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/80 to-black/90" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/25 rounded-full px-4 py-1.5 mb-5 shadow-lg">
            <PlayCircle className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-semibold tracking-wide">Tutoriales y guías</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Aprende a sacarle todo el provecho a Olive+
          </h2>
          <p className="text-base md:text-lg text-white/80 leading-relaxed">
            Guías paso a paso y videos cortos para que tu equipo use la plataforma con
            confianza desde el primer día.
          </p>
        </motion.div>

        {/* Grid de videos destacados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 max-w-6xl mx-auto">
          {featuredVideos.map((video, i) => (
            <motion.a
              key={video.youtubeId}
              href={`/tutoriales`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group bg-white/5 backdrop-blur-md border border-white/15 rounded-xl overflow-hidden hover:bg-white/10 hover:border-white/30 transition-all"
            >
              <div className="relative aspect-video bg-black overflow-hidden">
                <img
                  src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
                  alt={`Miniatura del tutorial ${video.title}`}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center transition-all group-hover:bg-white/30 group-hover:scale-110">
                    <Play className="w-7 h-7 text-white ml-1" fill="white" strokeWidth={0} />
                  </div>
                </div>
                <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  {video.module}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-white font-semibold leading-snug group-hover:text-clear transition-colors">
                  {video.title}
                </h3>
              </div>
            </motion.a>
          ))}
        </div>

        {/* CTA final */}
        <div className="text-center">
          <Button
            asChild
            className="bg-clear hover:bg-clear/90 text-white text-base px-7 py-6 rounded-full"
          >
            <a href="/tutoriales" className="inline-flex items-center gap-2">
              Ver todos los tutoriales
              <ArrowRight className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default TutorialesTeaser
