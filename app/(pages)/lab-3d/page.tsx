import type { Metadata } from 'next'
import EscenaLab from './escena_lab'

// Prueba de concepto interna: no debe indexarse ni figura en el sitemap
export const metadata: Metadata = {
  title: 'Lab · Escena 3D (prueba de concepto)',
  description:
    'Prueba de concepto interna: escena 3D low poly para presentar los módulos de Olive.',
  robots: { index: false, follow: false },
}

export default function Lab3DPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <a href="/" className="text-sm text-slate-500 hover:text-[#084d6e]">
        ← Volver al home
      </a>
      <h1 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl">
        Escena 3D — prueba de concepto
      </h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        Bloque de campo low poly con los cuatro módulos de Olive. Al elegir un módulo (o hacer
        clic en su dispositivo), el bloque rota para dejarlo al frente. Página interna, no
        indexada.
      </p>
      <div className="mt-8">
        <EscenaLab />
      </div>
    </main>
  )
}
