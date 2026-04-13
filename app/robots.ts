import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://home.oliveplus.cl/sitemap.xml',
    host: 'https://home.oliveplus.cl',
  }
}
