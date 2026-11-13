'use client'

import { useId } from 'react'
import Image from 'next/image'
import { Bell, ChevronDown, CircleHelp, Megaphone, Moon } from 'lucide-react'
import logo from '@/app/public/images/demo/logo-oliveplus.png'
import { USUARIO_DEMO } from './demo_datos'

/**
 * Cabecera de Olive+ para la demo. `home` copia olive_next/app/layouts/HomeLayout.tsx (con el botón
 * de noticias); `modulo` copia layouts/MainLayout.tsx (sin noticias, el logo abre el menú — aquí
 * vuelve al inicio de la demo). Riego lleva además el campo como select en la cabecera
 * (layouts/MainLayoutRiego.tsx).
 */
export function CabeceraDemo({
  variante = 'home',
  onLogo,
  campo,
}: {
  variante?: 'home' | 'modulo'
  onLogo?: () => void
  /** Campo seleccionado, como select junto a la campanita (solo Riego) */
  campo?: { nombre: string; guia?: string }
}) {
  const boton = 'grid place-items-center rounded-lg p-1.5 text-white'
  return (
    <header className="relative z-30 flex h-[56px] items-center justify-between bg-[#084d6e] px-3 py-2">
      <div className="flex items-end gap-2.5">
        <button type="button" onClick={onLogo} tabIndex={-1} className="transition-opacity hover:opacity-80">
          <Image src={logo} alt="Olive+" className="h-auto w-28" priority />
        </button>
        <SelloPro className="mb-[2px] text-[11px]" />
      </div>
      <div className="flex items-center gap-1">
        {campo && (
          <span
            data-guia={campo.guia}
            className="mr-3 flex h-9 w-[300px] items-center justify-between rounded-lg px-3 text-[15px] text-white hover:bg-white/10"
          >
            {campo.nombre}
            <ChevronDown className="h-4 w-4 opacity-80" />
          </span>
        )}
        <span className={boton} aria-hidden="true">
          <Bell className="h-[22px] w-[22px]" />
        </span>
        {variante === 'home' && (
          <span className={`${boton} relative`} aria-hidden="true">
            <Megaphone className="h-[22px] w-[22px]" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-amber-400" />
          </span>
        )}
        <span className={boton} aria-hidden="true">
          <CircleHelp className="h-[22px] w-[22px]" />
        </span>
        <span className={boton} aria-hidden="true">
          <Moon className="h-[22px] w-[22px]" />
        </span>
        <span className="flex items-center gap-2 rounded-lg px-2 py-1">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-white/30 bg-white/20 text-xs font-bold text-white">
            {USUARIO_DEMO.iniciales}
          </span>
          <span className="max-w-[120px] truncate text-sm font-medium text-white">{USUARIO_DEMO.nombre}</span>
        </span>
      </div>
    </header>
  )
}

/** Sello PRO dorado del header (olive_next/app/components/ProHeaderBadge.tsx). Mide en `em`. */
export function SelloPro({ className = '' }: { className?: string }) {
  return (
    <span
      className={`relative inline-flex select-none items-center overflow-hidden rounded-full bg-gradient-to-br from-[#ffd24d] via-[#fab500] to-[#b57f00] shadow-[0_0_10px_rgba(250,181,0,0.35),inset_0_-1px_0_rgba(0,0,0,0.18)] ring-1 ring-inset ring-[#ffe38a]/70 ${className}`}
      style={{ padding: '0.3em 0.8em' }}
    >
      <span className="relative z-10 pl-[0.18em] font-extrabold leading-none tracking-[0.18em] text-[#032f44]">PRO</span>
      <span aria-hidden="true" className="demo-pro-brillo pointer-events-none absolute inset-y-0 left-0 w-1/2 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
    </span>
  )
}

/** Ola bajo el header (olive_next/app/components/Wave.tsx), con el mismo trazado recortado a 1440. */
export function Ola() {
  const id = useId()
  return (
    <div aria-hidden="true" className="pointer-events-none absolute top-[55px] z-[1] h-[40px] w-full">
      <svg viewBox="0 0 1440 100" className="block w-full rotate-180">
        <defs>
          <linearGradient id={`${id}-g0`} x1="0" x2="0" y1="1" y2="0">
            <stop offset="0%" stopColor="rgba(8, 77, 110, 1)" />
            <stop offset="100%" stopColor="rgba(0, 193, 198, 1)" />
          </linearGradient>
        </defs>
        <path fill={`url(#${id}-g0)`} d="M0,20L120,26.7C240,33,480,47,720,45C960,43,1200,27,1440,20L1440,100L0,100Z" />
        <path
          fill="rgba(8, 77, 110, 1)"
          opacity="0.9"
          transform="translate(0 50)"
          d="M0,10L120,8.3C240,7,480,3,720,3.3C960,3,1200,7,1440,18.3L1440,100L0,100Z"
        />
      </svg>
    </div>
  )
}
