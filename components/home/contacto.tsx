import Image from 'next/image'
import { ArrowUpRight, Mail, MessageCircle } from 'lucide-react'
import fotoCampo from '@/app/public/images/fondocentro.webp'
import Ondas from './ondas'
import Resaltado from './resaltado'
import { APP_URL, CORREO_CONTACTO, WHATSAPP_NUMERO } from './constantes'

const ASUNTO = 'Quiero conocer Olive+'
const CUERPO = [
  'Hola, quiero conocer Olive+.',
  '',
  'Nombre del campo:',
  'Comuna o región:',
  'Cultivo y hectáreas:',
  'Equipos que tengo (controlador, estación, sensores):',
].join('\r\n')
const MAILTO = `mailto:${CORREO_CONTACTO}?subject=${encodeURIComponent(ASUNTO)}&body=${encodeURIComponent(CUERPO)}`
const WHATSAPP = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent('Hola, quiero conocer Olive+.')}`

const BOTON =
  'inline-flex min-h-[56px] items-center justify-center gap-3 rounded-full px-7 py-3 text-[19px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-marca-primario'

/**
 * Cierre de la home: escribirnos. Correo y WhatsApp con el mismo peso (el agricultor en terreno usa
 * WhatsApp), y qué pasa después de escribir. El correo y el teléfono no van escritos: se llega solo por los botones.
 */
export default function Contacto() {
  return (
    <section id="contacto" className="relative overflow-hidden bg-marca-primario text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Image src={fotoCampo} alt="" fill sizes="100vw" className="object-cover object-bottom" />
        <div className="absolute inset-0 bg-[rgba(8,77,110,0.88)]" />
        <Ondas className="-bottom-80 -right-48 h-[760px] w-[760px]" />
      </div>

      <div className="relative mx-auto grid max-w-[1440px] gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-center lg:gap-20 lg:px-16 lg:py-28">
        <div>
          <h2 className="text-balance text-4xl font-normal leading-[1.08] tracking-[-0.01em] sm:text-5xl lg:text-[3.4rem]">
            Conversemos sobre <b className="font-extrabold">tu <Resaltado>campo</Resaltado></b>
          </h2>
          <p className="mt-6 max-w-[52ch] text-pretty text-lg leading-relaxed text-white/85">
            Cuéntanos qué cultivas, cuántas hectáreas manejas y qué equipos tienes en terreno. Te mostramos
            Olive+ funcionando y vemos juntos cómo conectarlo a tu campo.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={MAILTO} className={`${BOTON} bg-marca-verde text-white shadow-[0_8px_24px_rgba(2,60,30,0.3)] hover:bg-marca-verdeOscuro`}>
              <Mail className="h-5 w-5" aria-hidden="true" />
              Escríbenos por correo
            </a>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className={`${BOTON} bg-white text-marca-primario shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:bg-marca-p50`}
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>

        <div className="space-y-4">
          {/* Qué pasa después */}
          <div className="rounded-[18px] border border-white/20 bg-white/[0.08] px-6 py-6 backdrop-blur-sm">
            <p className="font-bold">Qué pasa después</p>
            <ol className="mt-3 space-y-2.5 text-white/85">
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-marca-ambar text-sm font-extrabold text-marca-ink">1</span>
                Te respondemos y conversamos sobre tu campo.
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-marca-ambar text-sm font-extrabold text-marca-ink">2</span>
                Te mostramos Olive+ funcionando, con datos como los tuyos.
              </li>
              <li className="flex gap-3">
                <span aria-hidden="true" className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-marca-ambar text-sm font-extrabold text-marca-ink">3</span>
                Vemos juntos cómo conectar tus equipos.
              </li>
            </ol>
          </div>

          <a
            href={APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-[18px] border border-white/15 px-6 py-4 transition-colors hover:bg-white/[0.06]"
          >
            <span className="flex-1">
              <span className="block font-bold">¿Ya usas Olive+?</span>
              <span className="block text-white/75">Ingresa a la plataforma</span>
            </span>
            <ArrowUpRight className="h-5 w-5 text-white/70 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
