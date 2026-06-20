import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

export async function getHeroSlides() {
  return client.fetch(`
    *[_type == "heroSlide"] | order(order asc) {
      _id,
      headline,
      ctaText,
      ctaLink,
      imageUrl,
      overlayOpacity,
      order
    }
  `)
}

export async function getPageContent(pageType: string) {
  return client.fetch(`
    *[_type == "pageContent" && pageType == $pageType][0] {
      _id,
      pageType,
      title,
      content,
      seoDescription
    }
  `, { pageType })
}

export async function getPrivacyPolicy() {
  return getPageContent('privacy')
}

export async function getTermsOfService() {
  return getPageContent('terms')
}

export async function getAboutContent() {
  return getPageContent('about')
}

export async function getContactContent() {
  return getPageContent('contact')
}
