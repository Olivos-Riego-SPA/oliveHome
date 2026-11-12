'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

/** Copia el correo al portapapeles: plan B cuando el mailto no abre un cliente de correo. */
export default function CopiarCorreo({ correo }: { correo: string }) {
  const [copiado, setCopiado] = useState(false)

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(correo)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      // Sin permiso de portapapeles: el correo sigue visible al lado para copiarlo a mano
    }
  }

  return (
    <button
      type="button"
      onClick={copiar}
      className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-bold text-white underline-offset-4 transition-colors hover:bg-white/10"
    >
      {copiado ? <Check className="h-4 w-4 text-marca-ambar" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      <span aria-live="polite">{copiado ? 'Copiado' : 'Copiar correo'}</span>
    </button>
  )
}
