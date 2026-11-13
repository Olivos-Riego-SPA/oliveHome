'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import logo from './../app/public/images/logo-oliveplus-negativo.svg'

const ENLACES = [
  { href: '/#modulos', texto: 'Módulos' },
  { href: '/#demo', texto: 'Cómo funciona' },
  { href: '/#pro', texto: 'PRO' },
  { href: '/#nosotros', texto: 'Nosotros' },
  { href: '/tutoriales', texto: 'Tutoriales' },
]

const APP_URL = 'https://www.oliveplus.cl'

/**
 * Cabecera fija. Transparente sobre la ola del hero; al hacer scroll toma el primario de marca.
 * "Ingresar a Olive+" es un enlace de texto: es para clientes, la acción de la home es escribirnos.
 */
const SiteHeader: React.FC = () => {
  const [abierto, setAbierto] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!abierto) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setAbierto(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [abierto])

  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-[60] rounded-full bg-white px-5 py-3 font-bold text-marca-primario focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Saltar al contenido
      </a>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300',
          scrolled || abierto ? 'bg-marca-primario shadow-[0_4px_16px_rgba(6,47,92,0.22)]' : 'bg-transparent',
        )}
      >
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-6 sm:px-10 lg:h-20 lg:px-16">
          <a href="/" aria-label="Olive+, ir al inicio" className="rounded-md">
            <Image src={logo} alt="Olive+" priority className="h-9 w-auto lg:h-11" />
          </a>

          <nav className="hidden items-center gap-9 md:flex" aria-label="Navegación principal">
            {ENLACES.map((e) => (
              <a
                key={e.href}
                href={e.href}
                className="text-[15px] font-semibold text-white/90 transition-colors hover:text-white"
              >
                {e.texto}
              </a>
            ))}
            <span className="h-5 w-px bg-white/25" aria-hidden="true" />
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15px] font-bold text-white underline decoration-white/40 underline-offset-[6px] transition-colors hover:decoration-white"
            >
              Ingresar a Olive+
            </a>
          </nav>

          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-white/40 px-4 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 md:hidden"
            onClick={() => setAbierto(!abierto)}
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={abierto}
            aria-controls="menu-movil"
          >
            {abierto ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            Menú
          </button>
        </div>
      </header>

      {abierto && (
        <div className="fixed inset-0 z-40 bg-marca-ink/50 md:hidden" onClick={() => setAbierto(false)}>
          <nav
            id="menu-movil"
            aria-label="Navegación principal"
            className="mt-[72px] flex flex-col gap-1 bg-marca-primario px-6 pb-6 pt-2"
            onClick={(e) => e.stopPropagation()}
          >
            {ENLACES.map((e) => (
              <a
                key={e.href}
                href={e.href}
                onClick={() => setAbierto(false)}
                className="rounded-lg px-2 py-3 text-lg font-semibold text-white hover:bg-white/10"
              >
                {e.texto}
              </a>
            ))}
            <a
              href={APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 rounded-lg px-2 py-3 text-lg font-bold text-white underline decoration-white/40 underline-offset-[6px]"
            >
              Ingresar a Olive+
            </a>
          </nav>
        </div>
      )}
    </>
  )
}

export default SiteHeader
