import Image from 'next/image'
import { Wrench, GraduationCap, Headphones, Sprout } from 'lucide-react'
import fotoCampo from '@/app/public/images/quehacemos1.webp'
import mapaPresencia from '@/app/public/images/mapa-presencia.svg'
import Ondas from './ondas'
import Topografia from './topografia'

// La cadena de servicios, en el orden en que el cliente la vive
const CADENA = [
  {
    icono: Wrench,
    titulo: 'Implementación en terreno',
    texto: 'Instalamos y calibramos los equipos en tu campo, junto a tu equipo.',
  },
  {
    icono: GraduationCap,
    titulo: 'Capacitación a tu equipo',
    texto: 'Formamos a las personas que van a usar Olive+ día a día.',
  },
  {
    icono: Headphones,
    titulo: 'Soporte técnico continuo',
    texto: 'Resolvemos dudas y problemas cuando los necesitas, durante toda la temporada.',
  },
  {
    icono: Sprout,
    titulo: 'Asesoría agronómica',
    texto: 'Interpretamos los datos contigo para tomar mejores decisiones de riego.',
  },
]

// Cifras oficiales, actualizadas el 13-11-2026
const CIFRAS = [
  { valor: '+267', etiqueta: 'clientes' },
  { valor: '+751', etiqueta: 'dispositivos' },
  { valor: '+40.000', etiqueta: 'hectáreas' },
]

/**
 * El equipo que te acompaña: la misión, la cadena de servicios (de la instalación a la asesoría)
 * y el respaldo en cifras sobre una foto de campo con el velo de marca.
 */
export default function SeccionEquipo() {
  return (
    <section id="nosotros" className="relative overflow-hidden bg-marca-p50 py-20 lg:py-28">
      <Topografia className="text-marca-primario/[0.06]" />
      <Ondas tono="claro" className="-right-64 -top-56 h-[700px] w-[700px]" />

      <div className="relative mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <div>
            <h2 className="text-balance text-4xl font-normal leading-[1.1] tracking-[-0.01em] text-marca-primario sm:text-5xl">
              Más que una plataforma, <b className="font-extrabold">un equipo</b>
            </h2>
            <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-marca-tinta">
              Estamos en terreno desde la instalación y te acompañamos toda la temporada: somos parte de tu
              cadena de servicios.
            </p>
          </div>

          {/* La misión */}
          <figure>
            <blockquote className="text-balance text-2xl font-semibold leading-snug text-marca-primario sm:text-[1.7rem]">
              <span aria-hidden="true" className="mr-1 font-extrabold text-marca-verde">
                “
              </span>
              Que riegues bien todos los días, con menos riesgo e incertidumbre, gracias a datos, tecnología y
              acompañamiento experto.
            </blockquote>
            <figcaption className="mt-3 text-sm font-bold text-marca-suave">Nuestra misión</figcaption>
          </figure>
        </div>

        {/* La cadena de servicios */}
        <ol className="relative mt-16 grid gap-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-8">
          {/* La cadena que une los eslabones (escritorio) */}
          <span aria-hidden="true" className="absolute left-7 right-7 top-7 hidden h-0.5 bg-marca-p100 lg:block" />
          {CADENA.map(({ icono: Icono, titulo, texto }) => (
            <li key={titulo} className="relative">
              <span className="relative grid h-14 w-14 place-items-center rounded-full bg-marca-ambar text-white shadow-[0_8px_20px_rgba(150,110,0,0.25)] ring-8 ring-marca-p50">
                <Icono className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-xl font-extrabold text-marca-primario">{titulo}</h3>
              <p className="mt-2 max-w-[34ch] leading-relaxed text-marca-tinta">{texto}</p>
            </li>
          ))}
        </ol>

        {/* El respaldo */}
        <div className="relative mt-16 overflow-hidden rounded-[18px] text-white lg:mt-20">
          <Image src={fotoCampo} alt="" fill sizes="(min-width: 1440px) 1312px, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-[rgba(8,77,110,0.94)]" />
          <Topografia className="text-white/[0.07]" />
          <Ondas className="-bottom-64 -right-40 h-[520px] w-[520px]" animada={false} />

          <div className="relative grid items-center gap-10 px-7 py-10 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:gap-16 lg:px-14 lg:py-12">
            <div>
              <h3 className="text-2xl font-normal sm:text-3xl">
                Un respaldo que <b className="font-extrabold">crece cada temporada</b>
              </h3>
              <p className="mt-2 text-white/80">En Chile, Argentina y Estados Unidos.</p>
              <dl className="mt-9 grid grid-cols-3 gap-4 sm:gap-12">
                {CIFRAS.map((c) => (
                  <div key={c.etiqueta}>
                    <dt className="sr-only">{c.etiqueta}</dt>
                    <dd>
                      <span className="block text-[1.55rem] font-extrabold leading-tight sm:text-5xl">
                        <span className="text-marca-ambar">+</span>
                        {c.valor.replace('+', '')}
                      </span>
                      <span aria-hidden="true" className="mt-1 block text-sm text-white/80 sm:text-base">
                        {c.etiqueta}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Dónde estamos: las Américas en puntos, con Chile, Argentina y EE. UU. marcados */}
            <figure className="mx-auto w-[220px] sm:w-[260px] lg:w-full lg:max-w-[300px]">
              <Image src={mapaPresencia} alt="Mapa de las Américas con Chile, Argentina y Estados Unidos marcados" className="h-auto w-full" />
            </figure>
          </div>
        </div>
      </div>
    </section>
  )
}
