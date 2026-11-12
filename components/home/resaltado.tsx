import { cn } from '@/lib/utils'

/**
 * Palabra clave subrayada con un trazo de marcador amarillo (el acento de la marca, #F2BC09).
 * Se usa con mesura: solo en 2 o 3 titulares de la página, nunca como fondo de superficies.
 */
export default function Resaltado({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('relative inline-block isolate', className)}>
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 300 18"
        preserveAspectRatio="none"
        className="absolute -bottom-[0.08em] left-[-2%] -z-10 h-[0.3em] w-[104%]"
      >
        <path
          d="M3 11C48 6 96 5 148 6.5C196 8 244 7 297 4.5L296 13C246 15 198 15.5 150 14.5C100 13.5 52 14 4 16Z"
          fill="#F2BC09"
          opacity="0.9"
        />
      </svg>
    </span>
  )
}
