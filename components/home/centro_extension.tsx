import Image, { type StaticImageData } from 'next/image'
import { ArrowRight, Play } from 'lucide-react'
import paisaje from '@/app/public/images/centro-extension-paisaje.webp'
import { ICONOS_MODULO } from './modulos_datos'
import Topografia from './topografia'

interface Video {
  youtubeId: string
  titulo: string
  modulo: string
  icono: StaticImageData
}

// Videos destacados (los mismos de /tutoriales)
const VIDEOS: Video[] = [
  { youtubeId: 'zH_TEOkSQNM', titulo: 'Aspectos generales del módulo Riego', modulo: 'Riego', icono: ICONOS_MODULO.riego },
  { youtubeId: 'eujhTdCrAKs', titulo: 'Aspectos básicos de la humedad de suelo', modulo: 'Suelo', icono: ICONOS_MODULO.suelo },
  { youtubeId: 'K_meOXI2uu4', titulo: 'Aspectos generales del módulo Planta', modulo: 'Planta', icono: ICONOS_MODULO.planta },
]

/**
 * Centro de Extensión Digital: aprender a usar Olive+ a tu ritmo. Tres tutoriales destacados,
 * el acceso a la página de tutoriales y la ayuda que trae cada módulo.
 */
export default function CentroExtension() {
  return (
    <section
      id="centro-extension"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#EEF4F7_0%,#E5EDF0_40%)] pb-80 pt-6 sm:pb-96 lg:pb-[31rem] lg:pt-10"
    >
      {/* El paisaje: su cielo continúa el celeste de la sección de arriba; abajo, cerros y viñedo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px] sm:h-[520px] lg:h-[640px]">
        <Image
          src={paisaje}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-[50%_22%]"
        />
        {/* Funde el borde superior de la foto con el cielo de la sección */}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#E5EDF0] to-transparent" />
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[60%] [mask-image:linear-gradient(180deg,#000_40%,transparent)]">
        <Topografia className="text-marca-primario/[0.06]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,480px)] lg:items-end lg:gap-16">
          <h2 className="text-balance text-4xl font-normal leading-[1.1] tracking-[-0.01em] text-marca-primario sm:text-5xl">
            Centro de Extensión <b className="font-extrabold">Digital</b>
          </h2>
          <p className="text-lg leading-relaxed text-marca-tinta">
            Aprende a tu ritmo: guías paso a paso y videos cortos para que tu equipo use Olive+ con confianza
            desde el primer día. Y dentro de la plataforma, cada módulo trae su propia ayuda.
          </p>
        </div>

        <ul className="mt-12 grid gap-8 md:grid-cols-3 lg:mt-14">
          {VIDEOS.map((v) => (
            <li key={v.youtubeId}>
              <a href="/tutoriales" className="group block focus-visible:outline-none">
                <span className="relative block aspect-video overflow-hidden rounded-[10px] bg-marca-p50 shadow-[0_8px_24px_rgba(6,47,92,0.14)] ring-offset-2 group-focus-visible:ring-2 group-focus-visible:ring-marca-verde">
                  {/* Miniatura de YouTube (dominio externo: img nativa con carga diferida) */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                  <span className="absolute inset-0 bg-marca-primario/25 transition-colors group-hover:bg-marca-primario/10" />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-white/95 shadow-[0_8px_20px_rgba(6,47,92,0.25)] transition-transform group-hover:scale-105">
                      <Play className="ml-0.5 h-6 w-6 fill-marca-primario text-marca-primario" aria-hidden="true" />
                    </span>
                  </span>
                </span>
                <span className="mt-4 flex items-center gap-2 text-sm font-bold text-marca-suave">
                  <Image src={v.icono} alt="" className="h-6 w-6" />
                  Módulo {v.modulo}
                </span>
                <span className="mt-1.5 block text-lg font-bold leading-snug text-marca-primario group-hover:underline group-hover:decoration-marca-p300 group-hover:underline-offset-4">
                  {v.titulo}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <a
          href="/tutoriales"
          className="mt-12 inline-flex h-[52px] items-center gap-2 rounded-full bg-marca-primario px-7 text-lg font-bold text-white shadow-[0_8px_24px_rgba(6,47,92,0.22)] transition-colors hover:bg-marca-p700"
        >
          Ver todos los tutoriales
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
