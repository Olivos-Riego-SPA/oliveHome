'use client'

import { useState, useMemo, useEffect } from 'react'
import { Search, Play, X, Sparkles, Clock, Film } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import SiteHeader from '@/components/site_header'
import Footer from '@/components/footer'
import { JsonLd, videoObjectSchema, breadcrumbSchema } from '@/components/json_ld'
import vineyard from '../../public/images/vineyardback.jpg'

interface VideoData {
  id: number
  youtubeId: string
  title: string
  module: string
  moduleColor: string
  featured?: boolean
  orientation?: 'horizontal' | 'vertical'
}

interface SeriesEpisode {
  id: number
  youtubeId: string
  chapter: number
  title: string
}

const spotSeries: SeriesEpisode[] = [
  { id: 101, youtubeId: '8f0SkrSWCpQ', chapter: 1, title: 'Secuencia de riego' },
  { id: 102, youtubeId: '4lkBckT7FwQ', chapter: 2, title: 'Dosificación de agua' },
  { id: 103, youtubeId: 'g3raImwaJ_s', chapter: 3, title: 'Fertirriego' },
  { id: 104, youtubeId: 'akZNc6K7EJw', chapter: 4, title: 'Horario de riego' },
  { id: 105, youtubeId: 'LlmMaziZVwY', chapter: 5, title: 'Ciclos de riego' },
  { id: 106, youtubeId: 'xtW2geB1shc', chapter: 6, title: 'Condiciones de riego' },
]

interface ModuleInfo {
  id: string
  name: string
  available: boolean
}

const modules: ModuleInfo[] = [
  { id: 'riego', name: 'Riego', available: true },
  { id: 'suelo', name: 'Suelo', available: true },
  { id: 'planta', name: 'Planta', available: true },
  { id: 'pozo', name: 'Pozo', available: false },
  { id: 'clima', name: 'Clima', available: false },
  { id: 'analisis', name: 'Análisis de datos', available: false },
  { id: 'general', name: 'General', available: false },
  { id: 'configuracion', name: 'Configuración', available: false },
]

const videos: VideoData[] = [
  {
    id: 14,
    youtubeId: 'zH_TEOkSQNM',
    title: 'Aspectos generales del Módulo Riego',
    module: 'Riego',
    moduleColor: 'bg-sky-500',
    featured: true,
  },
  {
    id: 15,
    youtubeId: 'Z9bfEC84ilA',
    title: 'Alertas de controlador',
    module: 'Riego',
    moduleColor: 'bg-sky-500',
  },
  {
    id: 16,
    youtubeId: 'eujhTdCrAKs',
    title: 'Aspectos básicos de la humedad de suelo',
    module: 'Suelo',
    moduleColor: 'bg-amber-700',
    featured: true,
  },
  {
    id: 11,
    youtubeId: 'K_meOXI2uu4',
    title: 'Aspectos generales del Módulo Planta',
    module: 'Planta',
    moduleColor: 'bg-clear',
    featured: true,
  },
  {
    id: 12,
    youtubeId: 'jgBQf6r7NsM',
    title: 'Registros manuales en el Módulo Planta',
    module: 'Planta',
    moduleColor: 'bg-clear',
  },
]

type PlayingMedia =
  | { kind: 'video'; data: VideoData }
  | { kind: 'short'; data: SeriesEpisode }

export default function TutorialPage() {
  const [query, setQuery] = useState('')
  const [activeModule, setActiveModule] = useState<string>('todos')
  const [playing, setPlaying] = useState<PlayingMedia | null>(null)

  const filteredVideos = useMemo(() => {
    const q = query.trim().toLowerCase()
    return videos.filter((v) => {
      const matchesQuery = q === '' || v.title.toLowerCase().includes(q) || v.module.toLowerCase().includes(q)
      const matchesModule = activeModule === 'todos' || v.module.toLowerCase() === activeModule.toLowerCase()
      return matchesQuery && matchesModule
    })
  }, [query, activeModule])

  const featured = videos.filter((v) => v.featured)
  const comingSoonModules = modules.filter((m) => !m.available)

  useEffect(() => {
    if (playing) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [playing])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPlaying(null)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const structuredData = [
    breadcrumbSchema([
      { name: 'Inicio', url: 'https://home.oliveplus.cl/' },
      { name: 'Tutoriales', url: 'https://home.oliveplus.cl/tutoriales' },
    ]),
    ...videos.map((v) =>
      videoObjectSchema({
        youtubeId: v.youtubeId,
        title: `${v.title} · Módulo ${v.module}`,
        description: `Tutorial de Olive+ sobre ${v.module.toLowerCase()}: ${v.title}.`,
      }),
    ),
    ...spotSeries.map((ep) =>
      videoObjectSchema({
        youtubeId: ep.youtubeId,
        title: `SPOT en Acción · Capítulo ${ep.chapter}: ${ep.title}`,
        description: `Capítulo ${ep.chapter} de la serie SPOT en Acción: ${ep.title}. Guía práctica para dispositivos Spot de Talgil.`,
      }),
    ),
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <JsonLd data={structuredData} />
      <SiteHeader />

      {/* Hero compacto */}
      <section className="relative pt-28 pb-16 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src={vineyard.src} alt="" fill style={{ objectFit: 'cover' }} priority />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-primary/80" />
        </div>
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/25 rounded-full px-4 py-1.5 mb-5">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-white text-sm font-semibold tracking-wide">Tutoriales y guías</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Aprende Olive+ a tu ritmo
          </h1>
          <p className="text-base md:text-lg text-white/85 leading-relaxed mb-8 max-w-2xl mx-auto">
            Videos cortos y guías paso a paso para que tu equipo use la plataforma con confianza desde el primer día.
          </p>

          {/* Buscador */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              placeholder="Buscar un tutorial..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-md border border-white/25 rounded-full pl-12 pr-5 py-3.5 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
            />
          </div>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-6 py-12">
        {/* Filtros por módulo */}
        <div className="mb-10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-blk/60 mb-3">
            Filtra por módulo
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveModule('todos')}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                activeModule === 'todos'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-blk border-gray-200 hover:border-primary/40'
              }`}
            >
              Todos
            </button>
            {modules.map((m) => {
              const isActive = activeModule === m.name.toLowerCase()
              return (
                <button
                  key={m.id}
                  onClick={() => m.available && setActiveModule(m.name.toLowerCase())}
                  disabled={!m.available}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    !m.available
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      : isActive
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-blk border-gray-200 hover:border-primary/40'
                  }`}
                  title={!m.available ? 'Próximamente' : undefined}
                >
                  {m.name}
                  {!m.available && <span className="ml-1.5 text-[10px] opacity-70">· pronto</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* Empieza aquí (destacados) — solo si no hay filtro activo y sin búsqueda */}
        {activeModule === 'todos' && query === '' && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-5 h-5 text-clear" />
              <h2 className="text-2xl md:text-3xl font-bold text-blk">Empieza aquí</h2>
            </div>
            <p className="text-blk/70 mb-6">Los tutoriales recomendados para sacarle provecho a Olive+ desde el día uno.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {featured.map((v) => (
                <VideoCard key={v.id} video={v} onPlay={(d) => setPlaying({ kind: 'video', data: d })} />
              ))}
            </div>
          </section>
        )}

        {/* Serie: SPOT en Acción */}
        {activeModule === 'todos' && query === '' && (
          <section className="mb-12 relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[#063a54]" />
            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative z-10 p-8 md:p-10">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 py-1 mb-3">
                    <Film className="w-3.5 h-3.5 text-clear" />
                    <span className="text-white/90 text-xs font-semibold uppercase tracking-wider">Serie · 6 capítulos</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">SPOT en Acción</h2>
                  <p className="text-white/75 max-w-2xl leading-relaxed">
                    Guía práctica para dominar los dispositivos Spot de Talgil. Aprende a configurar y operar tu sistema paso a paso.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 -mx-8 md:-mx-10 px-8 md:px-10 snap-x snap-mandatory scrollbar-hide">
                {spotSeries.map((ep) => (
                  <ShortCard
                    key={ep.id}
                    episode={ep}
                    onPlay={(d) => setPlaying({ kind: 'short', data: d })}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Grid de todos los videos filtrados */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl md:text-3xl font-bold text-blk">
              {activeModule === 'todos' && query === ''
                ? 'Todos los tutoriales'
                : `${filteredVideos.length} ${filteredVideos.length === 1 ? 'resultado' : 'resultados'}`}
            </h2>
          </div>

          {filteredVideos.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
              <Clock className="w-10 h-10 text-blk/30 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-blk mb-1">No encontramos tutoriales</h3>
              <p className="text-blk/60 text-sm">
                Prueba con otra búsqueda o quita los filtros para ver todo el contenido.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredVideos.map((v) => (
                <VideoCard key={v.id} video={v} onPlay={(d) => setPlaying({ kind: 'video', data: d })} />
              ))}
            </div>
          )}
        </section>

        {/* Próximamente */}
        {comingSoonModules.length > 0 && (
          <section className="mt-16 bg-gradient-to-br from-primary/5 to-clear/5 border border-primary/10 rounded-2xl p-8 md:p-10">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-xl md:text-2xl font-bold text-blk">Próximamente</h2>
            </div>
            <p className="text-blk/70 mb-5 max-w-2xl">
              Estamos preparando tutoriales para los siguientes módulos. Vuelve pronto para encontrar contenido nuevo.
            </p>
            <div className="flex flex-wrap gap-2">
              {comingSoonModules.map((m) => (
                <span
                  key={m.id}
                  className="bg-white border border-gray-200 text-blk/70 text-sm font-medium px-3 py-1.5 rounded-full"
                >
                  {m.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Modal lightbox */}
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPlaying(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`relative w-full ${playing.kind === 'short' ? 'max-w-sm' : 'max-w-5xl'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPlaying(null)}
                aria-label="Cerrar video"
                className="absolute -top-12 right-0 text-white/80 hover:text-white flex items-center gap-2 text-sm"
              >
                Cerrar <X className="w-5 h-5" />
              </button>
              <div
                className={`${playing.kind === 'short' ? 'aspect-[9/16]' : 'aspect-video'} bg-black rounded-xl overflow-hidden shadow-2xl`}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${playing.data.youtubeId}?autoplay=1`}
                  title={playing.data.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="mt-4 text-white">
                {playing.kind === 'video' ? (
                  <>
                    <span
                      className={`inline-block ${playing.data.moduleColor} text-white text-xs font-semibold px-2.5 py-1 rounded-full mb-2`}
                    >
                      {playing.data.module}
                    </span>
                    <h3 className="text-xl font-semibold">{playing.data.title}</h3>
                  </>
                ) : (
                  <>
                    <span className="inline-block bg-clear text-white text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
                      SPOT en Acción · Capítulo {playing.data.chapter}
                    </span>
                    <h3 className="text-xl font-semibold">{playing.data.title}</h3>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface VideoCardProps {
  video: VideoData
  onPlay: (video: VideoData) => void
}

function VideoCard({ video, onPlay }: VideoCardProps) {
  return (
    <button
      onClick={() => onPlay(video)}
      className="group text-left bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="relative aspect-video bg-black overflow-hidden">
        <img
          src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
          alt={`Miniatura del tutorial: ${video.title}`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center transition-all group-hover:bg-white/30 group-hover:scale-110">
            <Play className="w-6 h-6 text-white ml-0.5" fill="white" strokeWidth={0} />
          </div>
        </div>
        <span className={`absolute top-3 left-3 ${video.moduleColor} text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg`}>
          {video.module}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-blk font-semibold leading-snug group-hover:text-primary transition-colors">
          {video.title}
        </h3>
      </div>
    </button>
  )
}

interface ShortCardProps {
  episode: SeriesEpisode
  onPlay: (episode: SeriesEpisode) => void
}

function ShortCard({ episode, onPlay }: ShortCardProps) {
  return (
    <button
      onClick={() => onPlay(episode)}
      className="group flex-shrink-0 w-44 md:w-48 snap-start text-left bg-black rounded-2xl overflow-hidden relative aspect-[9/16] border border-white/10 hover:border-white/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
    >
      <img
        src={`https://i.ytimg.com/vi/${episode.youtubeId}/hqdefault.jpg`}
        alt={`SPOT en Acción Capítulo ${episode.chapter}: ${episode.title}`}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <span className="absolute top-3 left-3 bg-white/15 backdrop-blur-sm border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
        Cap. {episode.chapter}
      </span>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center transition-all group-hover:bg-white/30 group-hover:scale-110">
          <Play className="w-5 h-5 text-white ml-0.5" fill="white" strokeWidth={0} />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-white text-sm font-semibold leading-tight line-clamp-2">
          {episode.title}
        </p>
      </div>
    </button>
  )
}
