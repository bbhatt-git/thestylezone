/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://thestylezone.com.np',
  generateRobotsTxt: false, // We'll use our custom robots.txt
  outDir: 'public',
  
  // Default priority and change frequency
  changefreq: 'daily',
  priority: 0.7,
  
  // Exclude specific paths
  exclude: ['/checkout*', '/api/*', '/orders', '/wishlist'],
  
  // Manually add important pages that might be missed
  additionalPaths: async (config) => {
    const result = []
    
    // Add static pages with high priority
    result.push({
      loc: '/',
      priority: 1.0,
      changefreq: 'daily',
      lastmod: new Date().toISOString(),
    })
    
    result.push({
      loc: '/shop',
      priority: 0.9,
      changefreq: 'daily',
      lastmod: new Date().toISOString(),
    })
    
    result.push({
      loc: '/about',
      priority: 0.8,
      changefreq: 'monthly',
      lastmod: new Date().toISOString(),
    })
    
    return result
  },
  
  // Transform function to customize URLs
  transform: async (config, path) => {
    // Set different priorities based on path
    if (path === '/') {
      return {
        loc: path,
        priority: 1.0,
        changefreq: 'daily',
        lastmod: new Date().toISOString(),
      }
    }
    
    if (path.startsWith('/shop/')) {
      return {
        loc: path,
        priority: 0.8,
        changefreq: 'weekly',
        lastmod: new Date().toISOString(),
      }
    }
    
    if (path === '/shop') {
      return {
        loc: path,
        priority: 0.9,
        changefreq: 'daily',
        lastmod: new Date().toISOString(),
      }
    }
    
    if (path === '/about') {
      return {
        loc: path,
        priority: 0.8,
        changefreq: 'monthly',
        lastmod: new Date().toISOString(),
      }
    }
    
    if (['/contact'].includes(path)) {
      return {
        loc: path,
        priority: 0.7,
        changefreq: 'monthly',
        lastmod: new Date().toISOString(),
      }
    }
    
    // Default for other pages
    return {
      loc: path,
      priority: 0.5,
      changefreq: 'monthly',
      lastmod: new Date().toISOString(),
    }
  },
}