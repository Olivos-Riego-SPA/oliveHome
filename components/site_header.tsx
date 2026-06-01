'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import logo from './../app/public/images/logo.png'

interface SiteHeaderProps {
  onScrollToModulos?: () => void
  onScrollToContacto?: () => void
}

const SiteHeader: React.FC<SiteHeaderProps> = ({
  onScrollToModulos,
  onScrollToContacto,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleInternalNav = (action: (() => void) | undefined, fallback?: string) => {
    if (action) {
      action()
    } else if (fallback) {
      window.location.href = fallback
    }
    setIsMenuOpen(false)
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-primary shadow-md'
            : 'bg-transparent backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <a href="/" aria-label="Ir al inicio">
              <Image src={logo.src} priority alt="Olive+" width={130} height={80} />
            </a>
            <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
              <Button
                className="text-white"
                variant="ghost"
                onClick={() => handleInternalNav(onScrollToModulos, '/#modulos')}
              >
                Módulos
              </Button>
              <Button
                className="text-white"
                variant="ghost"
                onClick={() => handleInternalNav(onScrollToContacto, '/#nosotrosSection')}
              >
                Nosotros
              </Button>
              <Button asChild className="text-white" variant="ghost">
                <a href="/tutoriales">Tutoriales</a>
              </Button>
              <Button
                asChild
                className="text-white bg-clear border-clear hover:bg-clear/90"
                variant="outline"
              >
                <a href="https://www.oliveplus.cl" target="_blank" rel="noopener noreferrer">
                  Ingresar a Olive+
                </a>
              </Button>
            </nav>
            <Button
              variant="outline"
              className="md:hidden text-white border-white/40"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Abrir menú"
              aria-expanded={isMenuOpen}
            >
              Menú
            </Button>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="bg-primary p-4 mt-16 flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:text-white/80"
              onClick={() => handleInternalNav(onScrollToModulos, '/#modulos')}
            >
              Módulos
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:text-white/80"
              onClick={() => handleInternalNav(onScrollToContacto, '/#nosotrosSection')}
            >
              Nosotros
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start text-white hover:text-white/80">
              <a href="/tutoriales" onClick={() => setIsMenuOpen(false)}>
                Tutoriales
              </a>
            </Button>
            <Button
              asChild
              className="w-full justify-start bg-clear text-white hover:bg-clear/90 mt-2"
            >
              <a href="https://www.oliveplus.cl" target="_blank" rel="noopener noreferrer">
                Ingresar a Olive+
              </a>
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

export default SiteHeader
