import Image from 'next/image'
import { Mail, Phone, MapPin } from 'lucide-react'
import RedesSociales from './redes_sociales'

import logo from './../app/public/images/logo-oliveplus-negativo.svg'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white border-t border-white/10">
      <div className="mx-auto max-w-[1440px] px-6 py-14 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Columna 1: Marca */}
          <div>
            <Image src={logo} alt="Olive+" className="mb-5 h-11 w-auto" />
            <p className="text-sm text-white/70 leading-relaxed mb-5">
              Te ayudamos a gestionar el riego de tu campo con datos reales, tecnología y acompañamiento experto.
            </p>
            <RedesSociales />
          </div>

          {/* Columna 2: Plataforma */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Plataforma
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <a href="/#modulos" className="hover:text-white transition-colors">
                  Módulos
                </a>
              </li>
              <li>
                <a href="/#pro" className="hover:text-white transition-colors">
                  Olive+ PRO
                </a>
              </li>
              <li>
                <a href="/#nosotros" className="hover:text-white transition-colors">
                  Nosotros
                </a>
              </li>
              <li>
                <a
                  href="https://www.oliveplus.cl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Ingresar a Olive+
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Recursos */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Recursos
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <a href="/tutoriales" className="hover:text-white transition-colors">
                  Tutoriales
                </a>
              </li>
              <li>
                <a href="/#centro-extension" className="hover:text-white transition-colors">
                  Centro de Extensión Digital
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm text-white/70">
              {/* Sin el correo ni el teléfono escritos: se llega por los botones */}
              <li>
                <a
                  href="mailto:tecnologias@olivos.cl"
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white transition-colors hover:bg-white/20"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  Escríbenos por correo
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/56933720947"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white transition-colors hover:bg-white/20"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  Escríbenos por WhatsApp
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-clear" />
                <span>Chile, Argentina y EE. UU.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-white/75">
            © {currentYear} Olive+. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
