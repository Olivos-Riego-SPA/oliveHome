import Script from 'next/script'

/**
 * Google Analytics 4 con la misma propiedad que la plataforma (oliveplus.cl): en olive_next es el
 * `measurementId` de Firebase Analytics. Al ser subdominios de oliveplus.cl, GA4 comparte la cookie
 * entre home.oliveplus.cl y oliveplus.cl y reconoce a la misma persona en ambos; en los reportes se
 * separan por nombre de host.
 *
 * El identificador va en NEXT_PUBLIC_GA_MEASUREMENT_ID (.env.local en local, variables de entorno en
 * Vercel). Sin él, o en desarrollo (`next dev`), no se carga nada. Las navegaciones entre páginas las registra la medición mejorada
 * de GA4 (cambios en el historial del navegador).
 */
const ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export default function Analytics() {
  // Solo en el sitio publicado: en desarrollo no se ensucia la propiedad real con visitas de prueba
  if (!ID || process.env.NODE_ENV !== 'production') return null
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ID}`} strategy="afterInteractive" />
      <Script id="ga4" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${ID}', { sitio: 'home' });
        `}
      </Script>
    </>
  )
}

/** Registra un evento propio en GA4 (p. ej. clics en los llamados a la acción). No hace nada sin GA. */
export function registrarEvento(nombre: string, parametros?: Record<string, string | number>) {
  if (typeof window === 'undefined') return
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
  gtag?.('event', nombre, { sitio: 'home', ...parametros })
}
