import type { Metadata } from 'next'

const description =
  'Videos cortos y guías paso a paso para que tu equipo use Olive+ con confianza desde el primer día.'

export const metadata: Metadata = {
  title: 'Tutoriales y guías',
  description,
  alternates: {
    canonical: '/tutoriales',
  },
  openGraph: {
    title: 'Tutoriales y guías · Olive+',
    description,
    url: 'https://home.oliveplus.cl/tutoriales',
    type: 'website',
    images: [{ url: '/og-home.jpg', width: 1200, height: 630, alt: 'Olive+ · Gestión inteligente del riego' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tutoriales y guías · Olive+',
    description,
    images: ['/og-home.jpg'],
  },
}

export default function TutorialesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
