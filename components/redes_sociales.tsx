import { cn } from '@/lib/utils'

/**
 * Redes sociales de Olive+, en un solo lugar: las usan el pie de página, la portada (fila) y los
 * botones flotantes sobre WhatsApp (vertical).
 */

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.352V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
)

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

export const REDES = [
  { nombre: 'LinkedIn', href: 'https://www.linkedin.com/company/olivosriego/', Icono: LinkedinIcon, fondo: '#0A66C2' },
  {
    nombre: 'Instagram',
    href: 'https://www.instagram.com/olivosriego/',
    Icono: InstagramIcon,
    fondo: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
  },
  { nombre: 'YouTube', href: 'https://www.youtube.com/@olive_plus', Icono: YoutubeIcon, fondo: '#FF0000' },
]

/**
 * - `fila`: círculos de vidrio sobre fondo oscuro (portada y pie).
 * - `flotante`: columna con el color de cada red, sobre el botón fijo de WhatsApp; se lee sobre
 *   cualquier sección, clara u oscura.
 */
export default function RedesSociales({ variante = 'fila', className }: { variante?: 'fila' | 'flotante'; className?: string }) {
  const flotante = variante === 'flotante'
  return (
    <ul className={cn(flotante ? 'flex flex-col items-center gap-2' : 'flex gap-3', className)} aria-label="Redes sociales de Olive+">
      {REDES.map(({ nombre, href, Icono, fondo }) => (
        <li key={nombre}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Olive+ en ${nombre}`}
            title={nombre}
            className={cn(
              'flex items-center justify-center rounded-full text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
              flotante
                ? 'h-11 w-11 shadow-[0_4px_14px_rgba(0,0,0,0.25)] hover:scale-110'
                : 'h-10 w-10 border border-white/25 bg-white/10 hover:bg-white/20',
            )}
            style={flotante ? { background: fondo } : undefined}
          >
            <Icono className={flotante ? 'h-5 w-5' : 'h-[18px] w-[18px]'} />
          </a>
        </li>
      ))}
    </ul>
  )
}
