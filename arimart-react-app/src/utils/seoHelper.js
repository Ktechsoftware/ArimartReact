// utils/seoHelper.js

/**
 * SEO Helper Utility for dynamic meta tag management
 * Supports products, categories, pages, and custom configurations
 */

class SEOHelper {
  constructor(defaultConfig = {}) {
    this.defaultConfig = {
      siteName: 'Arimart',
      domain: 'http://arimartreact.kuldeepchaurasia.in/',
      defaultImage: '/default-og-image.jpg',
      twitterHandle: '@arimart',
      ...defaultConfig
    };
  }

  /**
   * Update or create meta tag
   * @param {Object} config - Meta tag configuration
   */
  setMetaTag({ name, property, content }) {
    if (typeof document === 'undefined') return;
    
    const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
    let meta = document.querySelector(selector);
    
    if (!meta) {
      meta = document.createElement('meta');
      if (property) meta.setAttribute('property', property);
      if (name) meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  }

  /**
   * Set page title
   * @param {string} title - Page title
   */
  setTitle(title) {
    if (typeof document !== 'undefined') {
      document.title = title;
    }
  }

  /**
   * Set canonical URL
   * @param {string} url - Canonical URL
   */
  setCanonical(url) {
    if (typeof document === 'undefined') return;
    
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }

  /**
   * Update SEO for product pages
   * @param {Object} product - Product data
   * @param {Object} options - Additional options
   */
  updateProductSEO(product, options = {}) {
    const {
      customTitle,
      customDescription,
      customImage,
      includePrice = true,
      includeBrand = true
    } = options;

    // Page title
    const title = customTitle || `${product.productName} | ${this.defaultConfig.siteName}`;
    this.setTitle(title);

    // Meta description
    const description = customDescription || 
      `Buy ${product.productName} at best price. ${product.shortdesc || ''}`.substring(0, 160);
    
    // Product image URL
    const imageUrl = customImage || 
      `https://apiari.kuldeepchaurasia.in/Uploads/${product.image}` || 
      this.defaultConfig.defaultImage;

    // Current URL
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    // Basic meta tags
    this.setMetaTag({ name: 'description', content: description });
    this.setMetaTag({ name: 'keywords', content: this.generateKeywords(product) });

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: imageUrl },
      { property: 'og:url', content: currentUrl },
      { property: 'og:type', content: 'product' },
      { property: 'og:site_name', content: this.defaultConfig.siteName }
    ];

    // Add product-specific OG tags
    if (includePrice && product.price) {
      ogTags.push(
        { property: 'product:price:amount', content: product.price.toString() },
        { property: 'product:price:currency', content: 'INR' }
      );
    }

    if (includeBrand && product.brand) {
      ogTags.push({ property: 'product:brand', content: product.brand });
    }

    if (product.categoryName) {
      ogTags.push({ property: 'product:category', content: product.categoryName });
    }

    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: this.defaultConfig.twitterHandle },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: imageUrl }
    ];

    // Apply all tags
    [...ogTags, ...twitterTags].forEach(tag => this.setMetaTag(tag));

    // Set canonical URL
    this.setCanonical(currentUrl);

    return { title, description, imageUrl };
  }

  /**
   * Update SEO for category pages
   * @param {Object} category - Category data
   * @param {Object} options - Additional options
   */
  updateCategorySEO(category, options = {}) {
    const { customTitle, customDescription, productsCount } = options;

    const title = customTitle || `${category.name} Products | ${this.defaultConfig.siteName}`;
    const description = customDescription || 
      `Shop ${category.name} products. ${productsCount ? `${productsCount} products available.` : ''} ${category.description || ''}`.substring(0, 160);

    this.setTitle(title);
    this.setMetaTag({ name: 'description', content: description });
    
    // Open Graph for categories
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: typeof window !== 'undefined' ? window.location.href : '' }
    ];

    ogTags.forEach(tag => this.setMetaTag(tag));
  }

  /**
   * Update SEO for general pages
   * @param {Object} pageData - Page data
   */
  updatePageSEO(pageData) {
    const {
      title,
      description,
      keywords,
      image,
      type = 'website',
      noIndex = false
    } = pageData;

    if (title) this.setTitle(`${title} | ${this.defaultConfig.siteName}`);
    if (description) this.setMetaTag({ name: 'description', content: description });
    if (keywords) this.setMetaTag({ name: 'keywords', content: keywords });

    // Robots meta
    this.setMetaTag({ 
      name: 'robots', 
      content: noIndex ? 'noindex,nofollow' : 'index,follow' 
    });

    // Open Graph
    if (title || description || image) {
      const ogTags = [
        title && { property: 'og:title', content: `${title} | ${this.defaultConfig.siteName}` },
        description && { property: 'og:description', content: description },
        { property: 'og:type', content: type },
        image && { property: 'og:image', content: image }
      ].filter(Boolean);

      ogTags.forEach(tag => this.setMetaTag(tag));
    }
  }

  /**
   * Generate keywords from product data
   * @param {Object} product - Product data
   */
  generateKeywords(product) {
    const keywords = [
      product.name,
      product.categoryName,
      product.subcategoryName,
      product.brand,
      'online shopping',
      'buy online',
      this.defaultConfig.siteName.toLowerCase()
    ].filter(Boolean);

    return keywords.join(', ');
  }

  /**
   * Reset to default SEO
   */
  resetToDefault() {
    this.setTitle(this.defaultConfig.siteName);
    this.setMetaTag({ name: 'description', content: 'Shop quality products online at best prices' });
  }

  /**
   * Generate structured data (JSON-LD) for products
   * @param {Object} product - Product data
   */
  setProductStructuredData(product) {
    if (typeof document === 'undefined') return;

    const structuredData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "image": `https://apiari.kuldeepchaurasia.in/Uploads/${product.image}`,
      "brand": {
        "@type": "Brand",
        "name": product.brand || this.defaultConfig.siteName
      },
      "offers": {
        "@type": "Offer",
        "url": typeof window !== 'undefined' ? window.location.href : '',
        "priceCurrency": "INR",
        "price": product.price,
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": this.defaultConfig.siteName
        }
      }
    };

    // Add category if available
    if (product.categoryName) {
      structuredData.category = product.categoryName;
    }

    // Remove existing structured data
    const existing = document.querySelector('script[type="application/ld+json"]');
    if (existing) existing.remove();

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }
}

// Create a singleton instance
const seoHelper = new SEOHelper({
  siteName: 'Arimart',
  domain: 'http://arimartreact.kuldeepchaurasia.in/', // Update with your actual domain
  twitterHandle: '@arimart', // Update with your Twitter handle
  defaultImage: '/og-default.jpg' // Add a default OG image
});

export default seoHelper;

// Named exports for specific functions
export const {
  updateProductSEO,
  updateCategorySEO,
  updatePageSEO,
  setProductStructuredData,
  resetToDefault
} = seoHelper;