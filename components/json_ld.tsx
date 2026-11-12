interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[]
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

const siteUrl = 'https://home.oliveplus.cl'
const appUrl = 'https://www.oliveplus.cl'

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteUrl}/#organization`,
  name: 'Olive+',
  alternateName: ['OlivePlus', 'Olive plus'],
  url: siteUrl,
  logo: `${siteUrl}/images/logo.png`,
  description:
    'Plataforma para gestionar el riego de tu campo con datos reales, tecnología y acompañamiento experto.',
  email: 'tecnologias@olivos.cl',
  telephone: '+56933720947',
  areaServed: [
    { '@type': 'Country', name: 'Chile' },
    { '@type': 'Country', name: 'Argentina' },
    { '@type': 'Country', name: 'United States' },
  ],
  sameAs: [
    'https://www.linkedin.com/company/olivosriego/',
    'https://www.instagram.com/olivosriego/',
    'https://www.youtube.com/@olive_plus',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+56933720947',
    email: 'tecnologias@olivos.cl',
    contactType: 'sales',
    availableLanguage: ['Spanish', 'English'],
    areaServed: ['CL', 'AR', 'US'],
  },
}

export const softwareAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': `${siteUrl}/#software`,
  name: 'Olive+',
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'Agricultural management',
  operatingSystem: 'Web',
  url: appUrl,
  description:
    'Plataforma integral para monitorear, planificar y decidir el riego de tu campo con datos reales de planta, suelo, clima y pozo.',
  // Sin bloque `offers`: no se publican precios (un price '0' se lee como "gratis")
  inLanguage: ['es', 'en'],
  publisher: { '@id': `${siteUrl}/#organization` },
  featureList: [
    'Desempeño de riego y fertirriego por equipo y sector',
    'Mapa satelital de sectores pintados por desempeño',
    'Balance hídrico con riego, lluvia y ETo/ETc',
    'Humedad, temperatura y salinidad del suelo por profundidad',
    'Potencial hídrico de la planta, con sensores o lecturas Scholander',
    'ETc, horas frío y días grado desde la estación del campo',
    'Caudal, nivel freático y volumen de pozos, con envío a la DGA',
    'Tableros de indicadores propios por campo',
    'Sala de control multi-campo para televisor (Monitoreo)',
    'Exportación a Excel y PDF, en español e inglés',
  ],
}

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  url: siteUrl,
  name: 'Olive+',
  description:
    'Gestión inteligente del riego para tu campo con datos reales y acompañamiento experto.',
  inLanguage: 'es-CL',
  publisher: { '@id': `${siteUrl}/#organization` },
}

interface VideoSchemaInput {
  youtubeId: string
  title: string
  description?: string
}

export function videoObjectSchema({ youtubeId, title, description }: VideoSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: title,
    description: description ?? title,
    thumbnailUrl: [
      `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
      `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`,
    ],
    uploadDate: '2024-01-01',
    contentUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
    embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
    publisher: { '@id': `${siteUrl}/#organization` },
  }
}

export function breadcrumbSchema(
  items: { name: string; url: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
