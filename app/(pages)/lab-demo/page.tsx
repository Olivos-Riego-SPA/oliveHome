import type { Metadata } from 'next'
import DemoGuiada from '@/components/demo/demo_guiada'

// Prueba de concepto interna: no debe indexarse ni figura en el sitemap
export const metadata: Metadata = {
  title: 'Lab · Demo guiada de Olive+',
  description: 'Prueba de concepto interna: simulación compacta de Olive+ para la demo guiada del home.',
  robots: { index: false, follow: false },
}

export default function LabDemoPage() {
  return (
    <main className="min-h-screen bg-marca-papel">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <a href="/" className="text-sm text-slate-500 hover:text-[#084d6e]">
          ← Volver al home
        </a>
        <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">Demo guiada — prueba de concepto</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Simulación de Olive+ con datos ficticios, dibujada a tamaño de escritorio y alejada para que
          quepa compacta, con un foco que recorre los módulos mientras cuenta la historia. Página
          interna, no indexada.
        </p>

        {/* Compacta: nunca más ancha que esto, aunque haya pantalla de sobra */}
        <div className="mx-auto mt-10 max-w-[1040px]">
          <DemoGuiada />
        </div>
      </div>
    </main>
  )
}
