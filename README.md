# وب‌سایت دکتر مریم بهریان

وب‌سایت حرفه‌ای دوزبانه (فارسی / انگلیسی) برای دکتر مریم بهریان، روان‌شناس بالینی.

## فناوری‌های استفاده‌شده

- **Next.js 15** — App Router
- **TypeScript** — کدنویسی ایمن
- **Tailwind CSS 3** — استایل‌دهی
- **next-intl** — پشتیبانی دوزبانه RTL/LTR
- **MDX** — مدیریت مقالات با gray-matter
- **next/font** — بارگذاری بهینه فونت (Vazirmatn، Inter، Playfair Display)

## ساختار پروژه

```
├── content/
│   ├── fa/posts/        ← مقالات فارسی (.mdx)
│   └── en/posts/        ← مقالات انگلیسی (.mdx)
├── src/
│   ├── app/
│   │   ├── layout.tsx           (root)
│   │   ├── [locale]/
│   │   │   ├── layout.tsx       (locale wrapper با فونت و dir)
│   │   │   ├── page.tsx         (صفحه خانه)
│   │   │   ├── about/
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [slug]/
│   │   │   │   ├── category/[category]/
│   │   │   │   └── tag/[tag]/
│   │   │   ├── teaching/
│   │   │   ├── books/
│   │   │   └── contact/
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── layout/     (Header, Footer, LanguageSwitcher)
│   │   ├── home/       (Hero, LatestPosts, CategoryGrid, Credentials, AboutTeaser)
│   │   ├── blog/       (PostCard, SearchBar, CategoryFilter, TOC, ...)
│   │   ├── contact/    (ContactForm)
│   │   └── ui/         (Button, Badge, Breadcrumb)
│   ├── i18n/           (routing.ts, request.ts)
│   ├── lib/            (posts.ts, utils.ts)
│   ├── messages/       (fa.json, en.json)
│   └── types/          (index.ts)
├── middleware.ts        (i18n routing)
└── tailwind.config.ts
```

## نصب و راه‌اندازی

```bash
npm install
npm run dev
```

سایت فارسی (پیش‌فرض): `http://localhost:3000`
سایت انگلیسی: `http://localhost:3000/en`

## افزودن مقاله جدید

### مقاله فارسی
فایل `content/fa/posts/slug-مقاله.mdx` را بسازید:

```mdx
---
title: "عنوان مقاله"
slug: "article-slug"
excerpt: "خلاصه کوتاه"
author: "دکتر مریم بهریان"
publishedAt: "2024-04-01"
category: "روانکاوی"
tags: ["تگ ۱", "تگ ۲"]
featured: false
draft: false
metaTitle: "عنوان سئو"
metaDescription: "توضیحات سئو"
---

محتوای مقاله به صورت Markdown...
```

### دسته‌بندی‌های پیشنهادی
- `روانکاوی`
- `روانکاوی-و-ادبیات`
- `روانکاوی-و-فرهنگ`
- `روانکاوی-و-سیاست`
- `بدن-میل-فقدان`
- `یادداشت‌های-درمانگر`
- `نقد-فیلم-و-کتاب`
- `پژوهش‌های-روان‌شناسی`
- `جستارهای-روان`

## متغیرهای CSS

رنگ‌ها در `src/app/globals.css` به صورت CSS Variables تعریف شده‌اند:

```css
:root {
  --bg: #F9F8F5;         /* پس‌زمینه اصلی */
  --surface: #F0EEE9;    /* پس‌زمینه کارت‌ها */
  --border: #E0DDD6;     /* حاشیه */
  --accent: #2C4A3E;     /* رنگ اصلی (زیتونی تیره) */
  --accent-light: #E8EFEB;
  --text-primary: #1A1916;
  --text-secondary: #585550;
  --text-muted: #9A968D;
}
```

## SEO

- `sitemap.xml` — خودکار از مقالات
- `robots.txt` — از طریق `app/robots.ts`
- JSON-LD Schema برای Person و BlogPosting
- Open Graph و Twitter Card کامل
- Canonical URL برای هر صفحه
- آدرس‌های تمیز: `/blog/slug`، `/en/blog/slug`

## فارسی به انگلیسی: انتقال مقالات قدیمی

برای انتقال مقالات از سایت قدیمی `drmaryambahrian.ir`:
1. متن مقاله را کپی کنید
2. frontmatter را بر اساس schema بالا بنویسید
3. فایل MDX را در `content/fa/posts/` ذخیره کنید
4. سایت خودکار مقاله را نمایش می‌دهد

## دارک‌مود

برای فعال کردن دارک‌مود، کلاس `dark` را به `html` element اضافه کنید. رنگ‌های دارک‌مود در `globals.css` تعریف شده‌اند.

## ایمیل تماس

`bahriyanmaryam@gmail.com`

## تلگرام

`@psychofreepen`
