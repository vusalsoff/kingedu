export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/kabinet', '/ceo-login'],
    },
    sitemap: 'https://www.kingedu.az/sitemap.xml',
  }
}
