import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: 'https://drmaryambahrian.ir/sitemap.xml',
    host: 'https://drmaryambahrian.ir',
  }
}
