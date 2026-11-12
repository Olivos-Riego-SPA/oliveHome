import Image from 'next/image'
import { ArrowUpRight, Mail, MessageCircle } from 'lucide-react'
import fotoCampo from '@/app/public/images/fondocentro.webp'
import Ondas from './ondas'
import { APP_URL, CORREO_CONTACTO, WHATSAPP_NUMERO } from './constantes'

const CORREO = CORREO_CONTACTO
const ASUNTO = 'Quiero conocer Olive+'
const CUERPO = [
  'Hola, quiero conocer Olive+.',
  '',
  'Nombre del campo:',
  'Comuna o región:',
  'Cultivo y hectáreas:',
  'Equipos que tengo (controlador, estación, sensores):',
].join('\r\n')
const MAILTO = `mailto:${CORREO}?subject=${encodeURIComponent(ASUNTO)}&body=${encodeURIComponent(CUERPO)}`
const WHATSAPP = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent('Hola, quiero conocer Olive+.')}`

/**
 * Cierre de la home: escribirnos. Hace de par con el hero (misma ola con foto y ondas).
 */
export default function Contacto() {
  return (
    <section id="contacto" className="relative overflow-hidden bg-marca-primario text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Image src={fotoCampo} alt="" fill sizes="100vw" className="object-cover object-bottom" />
        <div className="absolute inset-0 bg-[rgba(8,77,110,0.88)]" />
        <Ondas className="-bottom-80 -right-48 h-[760px] w-[760px]" />
      </div>

      <div className="relative mx-auto grid max-w-[1440px] gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:items-center lg:gap-20 lg:px-16 lg:py-28">
        <div>
          <h2 className="text-balance text-4xl font-normal leading-[1.08] tracking-[-0.01em] sm:text-5xl lg:text-[3.4rem]">
            Conversemos sobre <b className="font-extrabold">tu campo</b>
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-white/85">
            Cuéntanos qué cultivas, cuántas hectáreas manejas y qué equipos tienes en terreno. Te mostramos
            Olive+ funcionando y vemos juntos cómo conectarlo a tu campo.
          </p>
          <a
            href={MAILTO}
            className="mt-9 inline-flex h-[56px] items-center gap-3 rounded-full bg-marca-verde px-8 text-lg font-bold text-white shadow-[0_8px_24px_rgba(2,60,30,0.3)] transition-colors hover:bg-marca-verdeOscuro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-marca-primario"
          >
            <Mail className="h-5 w-5" aria-hidden="true" />
            Escríbenos a {CORREO}
          </a>
        </div>

        <ul className="divide-y divide-white/15 rounded-[18px] border border-white/20 bg-white/[0.08] backdrop-blur-sm">
          <li>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-t-[18px] px-6 py-5 transition-colors hover:bg-white/[0.06]"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-marca-verde">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="flex-1">
                <span className="block font-bold">Prefiero WhatsApp</span>
                <span className="block text-white/75">+56 9 3372 0947</span>
              </span>
              <ArrowUpRight className="h-5 w-5 text-white/70 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </li>
          <li>
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-b-[18px] px-6 py-5 transition-colors hover:bg-white/[0.06]"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/15">
                <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="flex-1">
                <span className="block font-bold">¿Ya usas Olive+?</span>
                <span className="block text-white/75">Ingresa a la plataforma</span>
              </span>
              <ArrowUpRight className="h-5 w-5 text-white/70 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}
