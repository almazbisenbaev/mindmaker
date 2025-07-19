import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://mindmaker.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://mindmaker.vercel.app/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
        url: 'https://mindmaker.vercel.app/doc/4b770e6d-063c-4ddf-a2bf-fa24d2bb6723',
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.4,
    },
    {
        url: 'https://mindmaker.vercel.app/doc/28be7ff0-db36-4c7e-8093-17510cc1fd02',
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.4,
    },
  ]
}