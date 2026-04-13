'use client'

import Image from 'next/image'
import { Linkedin, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import logo from './../app/public/images/logo.png'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white border-t border-white/10">
      <div className="container mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Columna 1: Marca */}
          <div>
            <Image src={logo.src} alt="Olive+" width={140} height={80} className="mb-4" />
            <p className="text-sm text-white/70 leading-relaxed mb-5">
              Gestionamos el riego de tu campo con datos reales, tecnología y acompañamiento experto.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/company/olivosriego/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-clear border border-white/20 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/olivosriego/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-clear border border-white/20 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://www.youtube.com/@olive_plus"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-clear border border-white/20 flex items-center justify-center transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Columna 2: Plataforma */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Plataforma
            </h4>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li>
                <a href="#modulos" className="hover:text-white transition-colors">
                  Módulos
                </a>
              </li>
              <li>
                <a href="#nosotrosSection" className="hover:text-white transition-colors">
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
                <a href="/tutoriales" className="hover:text-white transition-colors">
                  Guías de uso
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
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-clear" />
                <a href="mailto:ventas@olivos.cl" className="hover:text-white transition-colors">
                  ventas@olivos.cl
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-clear" />
                <a
                  href="https://wa.me/56933720947"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  +56 9 3372 0947
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-clear" />
                <span>Chile</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-white/60">
            © {currentYear} Olive+. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
