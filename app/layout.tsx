import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Raleway } from 'next/font/google'
import { JsonLd, organizationSchema, softwareAppSchema, websiteSchema } from '@/components/json_ld'

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const siteUrl = 'https://home.oliveplus.cl'
const siteName = 'Olive+'
const siteDescription =
  'Olive+ es la plataforma para gestionar el riego de tu campo con datos reales, tecnología y acompañamiento experto. Más que un software, somos tu equipo de riego.'
const ogImage = '/images/logo.png'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Olive+ · Gestión inteligente del riego',
    template: '%s · Olive+',
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    'Olive+',
    'OlivePlus',
    'Olive plus',
    'oliveplus',
    'oliveplus.cl',
    'gestión de riego',
    'riego agrícola',
    'monitoreo de riego',
    'plataforma de riego',
    'agricultura de precisión',
    'telemetría agrícola',
    'sensores de riego',
    'Chile',
  ],
  authors: [{ name: 'Olive+' }],
  creator: 'Olive+',
  publisher: 'Olive+',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: siteUrl,
    siteName,
    title: 'Olive+ · Gestión inteligente del riego',
    description: siteDescription,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Olive+ · Gestión inteligente del riego',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Olive+ · Gestión inteligente del riego',
    description: siteDescription,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'technology',
};

export const viewport: Viewport = {
  themeColor: '#084d6e',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <JsonLd data={[organizationSchema, softwareAppSchema, websiteSchema]} />
      </head>
      <body
        className={`${raleway.className} antialiased relative min-h-screen bg-backColor`}
      >
        {/* Contenedor para el fondo anclado al fondo de la página */}
        <div className="bg-water-texture absolute bottom-0 left-0 right-0 bg-cover bg-no-repeat z-[-1]" style={{ height: '100vh' }} />

        {/* Contenido principal */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
