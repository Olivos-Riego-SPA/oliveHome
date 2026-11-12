import { cn } from '@/lib/utils'

interface OndasProps {
  /** Posición y tamaño (clases absolute/size del contenedor) */
  className?: string
  /** 'oscuro': sobre el primario (blanco translúcido) · 'claro': sobre fondos claros */
  tono?: 'oscuro' | 'claro'
  /** Anillos que se expanden lento, como al caer una gota */
  animada?: boolean
}

/**
 * Círculo de tono de la marca con anillos concéntricos: la onda que deja una gota al caer
 * en el agua. Decorativo (aria-hidden).
 * La animación respeta prefers-reduced-motion.
 */
export default function Ondas({ className, tono = 'oscuro', animada = true }: OndasProps) {
  const anillo = tono === 'oscuro' ? 'border-white/[0.09]' : 'border-marca-p100'
  const relleno = tono === 'oscuro' ? 'bg-white/[0.06]' : 'bg-marca-verde100/70'
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute', className)}>
      {/* Anillos fijos */}
      {[1, 0.78, 0.58].map((escala) => (
        <span
          key={escala}
          className={cn('absolute inset-0 m-auto rounded-full border', anillo)}
          style={{ width: `${escala * 100}%`, height: `${escala * 100}%` }}
        />
      ))}
      {/* Círculo de tono */}
      <span className={cn('absolute inset-0 m-auto h-[38%] w-[38%] rounded-full', relleno)} />
      {/* Anillos que se expanden desde el centro */}
      {animada &&
        [0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn('onda-expande absolute inset-0 m-auto h-[38%] w-[38%] rounded-full border', anillo)}
            style={{ animationDelay: `${i * 2.6}s` }}
          />
        ))}
    </div>
  )
}
