import { cn } from '@/lib/utils'

/**
 * Curvas de nivel (textura topográfica) generadas de forma determinista: varios "cerros", cada uno
 * con anillos irregulares concéntricos. Se usan muy tenues como materia de fondo (no como adorno):
 * el campo visto desde arriba. Hereda el color de `currentColor`.
 */

const ANCHO = 1440
const ALTO = 900

// Cerros: centro, radio base, cantidad de curvas y "personalidad" de la forma
const CERROS = [
  { x: 180, y: 160, r: 34, n: 9, f: 1.0 },
  { x: 1180, y: 120, r: 30, n: 10, f: 2.3 },
  { x: 760, y: 520, r: 40, n: 11, f: 3.7 },
  { x: 260, y: 760, r: 30, n: 8, f: 5.1 },
  { x: 1320, y: 760, r: 36, n: 9, f: 6.4 },
]

function curva(cx: number, cy: number, radio: number, fase: number, k: number) {
  const puntos: string[] = []
  const pasos = 72
  for (let i = 0; i <= pasos; i++) {
    const t = (i / pasos) * Math.PI * 2
    // Ondulaciones de baja frecuencia: el anillo se deforma como una cota real
    const deform =
      1 +
      0.16 * Math.sin(2 * t + fase) +
      0.09 * Math.sin(3 * t + fase * 1.7 + k * 0.15) +
      0.05 * Math.sin(5 * t + fase * 0.6 + k * 0.3)
    const r = radio * deform
    puntos.push(`${(cx + r * Math.cos(t) * 1.25).toFixed(1)},${(cy + r * Math.sin(t)).toFixed(1)}`)
  }
  return `M${puntos.join('L')}Z`
}

const CAMINOS = CERROS.flatMap((c) =>
  Array.from({ length: c.n }, (_, k) => curva(c.x, c.y, c.r + k * 26, c.f + k * 0.08, k)),
)

export default function Topografia({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${ANCHO} ${ALTO}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      vectorEffect="non-scaling-stroke"
    >
      {CAMINOS.map((d, i) => (
        <path key={i} d={d} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  )
}
