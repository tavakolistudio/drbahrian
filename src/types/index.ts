export type Locale = 'fa' | 'en'

export interface PostFrontmatter {
  title: string
  slug: string
  excerpt: string
  author: string
  publishedAt: string
  updatedAt?: string
  category: string
  tags?: string[]
  coverImage?: string
  metaTitle?: string
  metaDescription?: string
  featured?: boolean
  draft?: boolean
  readingTime?: string
}

export interface Post extends PostFrontmatter {
  content: string
  readingTimeMinutes: number
}

export interface PostMeta extends PostFrontmatter {
  readingTimeMinutes: number
}

export interface Category {
  slug: string
  label: string
  count?: number
}

export interface TocItem {
  id: string
  text: string
  level: number
}

export interface NavItem {
  href: string
  label: string
}
