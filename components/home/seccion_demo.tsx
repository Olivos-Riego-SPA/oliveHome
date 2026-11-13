import DemoGuiada from '@/components/demo/demo_guiada'
import Ondas from './ondas'
import Topografia from './topografia'

/**
 * "Así funciona Olive+": la demo guiada (components/demo), entre los módulos y la ruta del riego.
 * Bloque oscuro con ondas, de la familia de la sección PRO, para dar contraste entre dos secciones
 * claras. La demo solo avanza mientras está a la vista, y sus llamados llevan a #contacto.
 */
export default function SeccionDemo() {
  return (
    <div className="relative">
      <section id="demo" className="relative overflow-hidden bg-marca-p700 text-white">
        {/* Entrada curva desde los módulos (celeste), con un filete verde; espejada respecto de PRO */}
        <svg aria-hidden="true" viewBox="0 0 1440 120" preserveAspectRatio="none" className="relative block h-12 w-full -scale-x-100 lg:h-24">
          <path d="M0 0H1440V60C1180 96 900 108 640 96C380 84 170 64 0 70Z" fill="#028C44" transform="translate(0 6)" />
          <path d="M0 0H1440V60C1180 96 900 108 640 96C380 84 170 64 0 70Z" fill="#EEF4F7" />
        </svg>

        {/* La textura se desvanece abajo para empalmar con la onda de salida, que va lisa */}
        <Topografia className="text-white/[0.06] [mask-image:linear-gradient(180deg,#000_75%,transparent)]" />
        <Ondas className="-left-72 top-32 h-[900px] w-[900px]" />
        <Ondas className="-right-56 top-[40%] h-[520px] w-[520px]" animada={false} />

        <div className="relative mx-auto max-w-[1440px] px-6 pb-20 pt-10 sm:px-10 lg:px-16 lg:pb-28 lg:pt-14">
          <div className="max-w-3xl">
            <h2 className="text-balance text-4xl font-normal leading-[1.1] tracking-[-0.01em] text-white/75 sm:text-5xl lg:text-[3.4rem]">
              Así funciona <b className="font-extrabold text-white">Olive+</b>
            </h2>
            <p className="mt-6 max-w-[60ch] text-pretty text-lg leading-relaxed text-white/80">
              Recórrelo con los datos de un campo de ejemplo. Te guiamos paso a paso y, cuando quieras, eliges
              tú el módulo que quieres ver.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-[1120px] text-left text-marca-ink">
            <DemoGuiada />
          </div>
        </div>
      </section>

      {/* Salida curva: la onda oscura se monta sobre la foto de la ruta del riego (así no queda una franja) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="pointer-events-none absolute left-0 top-full z-10 block h-12 w-full -translate-y-px lg:h-24"
      >
        <path d="M0 0H1440V60C1180 96 900 108 640 96C380 84 170 64 0 70Z" fill="#063D58" />
      </svg>
    </div>
  )
}
