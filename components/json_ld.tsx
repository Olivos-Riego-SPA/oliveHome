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
  email: 'ventas@olivos.cl',
  telephone: '+56933720947',
  areaServed: {
    '@type': 'Country',
    name: 'Chile',
  },
  sameAs: [
    'https://www.linkedin.com/company/olivosriego/',
    'https://www.instagram.com/olivosriego/',
    'https://www.youtube.com/@olive_plus',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+56933720947',
    email: 'ventas@olivos.cl',
    contactType: 'sales',
    availableLanguage: ['Spanish'],
    areaServed: 'CL',
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
  offers: {
    '@type': 'Offer',
    priceCurrency: 'CLP',
    price: '0',
    availability: 'https://schema.org/InStock',
  },
  publisher: { '@id': `${siteUrl}/#organization` },
  featureList: [
    'Monitoreo de riego por sector',
    'Gestión de pozos y cumplimiento DGA',
    'Humedad de suelo en tiempo real',
    'Variables climáticas',
    'Sensores en planta',
    'Análisis de datos agregado',
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
