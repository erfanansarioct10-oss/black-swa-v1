# SEO Context

> **Purpose:** This document defines the SEO standards, metadata conventions, URL architecture, structured data, and search optimization guidelines for the Black Swan International platform. Every AI agent working on the project must follow these rules when creating or modifying public-facing pages.

---

# 1. SEO Philosophy

Black Swan International is a **B2B industrial technology company** focused on generating high-quality business leads through organic search.

The website is designed with an **SEO-first** architecture where every public page contributes to search visibility, authority, and lead generation.

## Primary Goals

- Generate qualified quotation requests
- Increase organic search visibility
- Improve brand authority
- Create high-quality landing pages for products and services
- Maximize discoverability by both traditional search engines and AI-powered search platforms

## Target Search Platforms

- Google Search
- Bing
- Google AI Overview
- ChatGPT Search
- Perplexity
- Claude
- Gemini
- Other AI-powered search engines

---

# 2. SEO Principles

Every public page must:

- Have a unique purpose
- Solve a user's search intent
- Contain meaningful content
- Be crawlable
- Be indexable
- Load quickly
- Be mobile-friendly
- Be accessible
- Include proper structured data
- Encourage users to request a quotation

SEO must never be treated as an afterthought.

---

# 3. Metadata Standards

Every public page must define complete metadata using the Next.js Metadata API.

## Required Fields

- Title
- Description
- Canonical URL
- Open Graph Metadata
- Twitter Card Metadata
- Keywords
- Robots
- Language
- Site Name
- Author

### Example

```ts
export const metadata = {
  title,
  description,
  keywords,
  alternates,
  robots,
  openGraph,
  twitter,
};
```

Metadata must always be unique for every page.

---

# 4. Page Title Rules

Titles should:

- Clearly describe the page
- Include primary keywords naturally
- Mention Black Swan International when appropriate
- Be concise
- Be unique

### Good Examples

- Industrial CCTV Solutions | Black Swan International
- Network Switches | Black Swan International
- Structured Cabling Services | Black Swan International

### Avoid

- Home
- Products
- Page
- Untitled

---

# 5. Meta Description Rules

Descriptions should:

- Explain the page clearly
- Encourage users to click
- Include important keywords naturally
- Stay concise
- Be unique

Every public page must have its own meta description.

---

# 6. URL Structure

URLs must remain clean, descriptive, and predictable.

```text
/

about

services

catalog

catalog/[category]

catalog/[category]/[product]

contact

quote

privacy-policy

terms

robots.txt

sitemap.xml
```

## Rules

- Lowercase only
- Use hyphens instead of spaces
- Never expose database IDs
- Avoid unnecessary query parameters
- Use human-readable slugs
- Keep URLs permanent whenever possible

---

# 7. Dynamic Metadata

Dynamic pages must generate metadata at runtime.

Applicable pages include:

- Products
- Categories
- Services
- CMS Pages
- Future Blog Posts

Always use:

```ts
generateMetadata();
```

Metadata should be generated from database content whenever possible.

---

# 8. Structured Data (Schema.org)

Every applicable page should implement JSON-LD.

Supported schemas include:

- Organization
- WebSite
- WebPage
- Product
- Service
- BreadcrumbList
- FAQPage
- ContactPage
- LocalBusiness

Structured data must accurately reflect page content.

---

# 9. Open Graph Standards

Every page should include:

- Title
- Description
- URL
- Site Name
- Image
- Type

Open Graph images should:

- Be high quality
- Match company branding
- Be optimized
- Be stored in the Media Library

---

# 10. Twitter Card Standards

Use:

```text
summary_large_image
```

Every page should include:

- Title
- Description
- Image

---

# 11. Canonical URLs

Every public page must define a canonical URL.

Canonical URLs help prevent duplicate content and consolidate ranking signals.

Never create multiple URLs for identical content.

---

# 12. Robots Rules

## Development

```text
Disallow: /
```

## Production

```text
Allow: /
```

Never index:

- Admin Portal
- Authentication Pages
- Internal Dashboards
- API Routes
- Development Utilities

---

# 13. Sitemap Strategy

Generate the sitemap dynamically.

Include:

- Homepage
- About
- Services
- Categories
- Products
- Contact
- CMS Pages
- Future Blog Posts

Exclude:

- Admin Pages
- Authentication Routes
- API Endpoints
- Internal Tools

---

# 14. Internal Linking Strategy

Every page should naturally link to related pages.

```text
Homepage
    ↓
Categories
    ↓
Products
    ↓
Related Services
    ↓
Request Quote
```

Internal links should improve navigation, authority, and user experience.

---

# 15. Breadcrumb Strategy

Every hierarchical page should include breadcrumbs.

Example:

```text
Home
↓
Catalog
↓
Networking
↓
Industrial Switches
↓
Managed Switch XYZ
```

Breadcrumbs should include **BreadcrumbList** structured data.

---

# 16. Image SEO

Every image must include:

- Descriptive filename
- Alt text
- Width
- Height
- Responsive sizing
- Lazy loading where appropriate
- Modern image format

### Good

```text
hikvision-industrial-ip-camera.jpg
```

### Bad

```text
IMG000123.jpg
```

---

# 17. Content Standards

Every page should include:

- One H1
- Logical heading hierarchy
- Helpful introduction
- Clear explanations
- Internal links
- Strong call-to-action
- Natural keyword usage

Avoid:

- Duplicate content
- Thin pages
- Placeholder text
- AI-generated filler
- Keyword stuffing

---

# 18. Local SEO

Maintain consistent company information throughout the website.

Include:

- Company Name
- Address
- Phone Number
- Email
- Business Hours
- Google Maps (Future)
- Social Profiles

Future integration:

- Google Business Profile
- LocalBusiness Schema

---

# 19. Core Web Vitals

Target metrics:

| Metric | Target  |
| ------ | ------- |
| LCP    | < 2.5s  |
| CLS    | < 0.1   |
| INP    | < 200ms |

Optimization Guidelines:

- Prefer Server Components
- Stream content
- Optimize images
- Optimize fonts
- Minimize JavaScript
- Code splitting
- Lazy loading

---

# 20. Accessibility & SEO

Accessibility supports SEO.

Every page should include:

- Semantic HTML
- Proper heading hierarchy
- Keyboard accessibility
- ARIA labels where necessary
- High color contrast
- Descriptive link text

---

# 21. AI Search Optimization (LLMO / GEO)

Optimize content for AI-powered search engines.

Guidelines:

- Use semantic HTML
- Write factual content
- Answer user intent directly
- Use structured headings
- Include structured data
- Maintain consistent terminology
- Avoid exaggerated marketing language
- Prefer clear, concise explanations

---

# 22. Technical SEO Requirements

The application must provide:

- Dynamic metadata
- Dynamic sitemap
- robots.txt
- Canonical URLs
- Structured data
- Open Graph metadata
- Twitter Cards
- Optimized images
- Fast loading
- Mobile responsiveness
- HTTPS
- Clean URL structure

---

# 23. SEO Checklist

Before publishing any public page, verify:

- [ ] Unique page title
- [ ] Unique meta description
- [ ] Canonical URL
- [ ] Open Graph metadata
- [ ] Twitter Card metadata
- [ ] Structured data
- [ ] H1 present
- [ ] Proper heading hierarchy
- [ ] Internal links
- [ ] Optimized images
- [ ] Accessible markup
- [ ] Mobile responsive
- [ ] Fast loading
- [ ] SEO-friendly URL
- [ ] Crawlable
- [ ] Indexable
- [ ] "Request Quote" CTA where applicable

---

# 24. AI Instructions

Every AI agent contributing to this project must:

- Follow all SEO standards defined in this document.
- Never create public pages without metadata.
- Always implement structured data where applicable.
- Prefer dynamic metadata over hardcoded values.
- Maintain consistent URL structures.
- Preserve SEO during refactoring.
- Ensure Core Web Vitals are not negatively impacted.
- Design every public page to support Black Swan International's lead-generation strategy.

---

## Final Principle

> **SEO is a core architectural concern of the Black Swan International platform. Every public page must be discoverable, fast, accessible, semantically structured, and optimized for both traditional search engines and AI-powered search systems.**
