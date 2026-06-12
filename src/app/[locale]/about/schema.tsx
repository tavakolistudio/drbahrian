export function PersonSchema({ locale }: { locale: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: locale === 'fa' ? 'دکتر مریم بهریان' : 'Dr. Maryam Bahrian',
    jobTitle:
      locale === 'fa'
        ? 'روان‌شناس بالینی، درمان‌گر، نویسنده و مدرس دانشگاه'
        : 'Clinical Psychologist, Psychotherapist, Author, University Lecturer',
    email: 'bahriyanmaryam@gmail.com',
    url: 'https://drmaryambahrian.ir',
    sameAs: ['https://t.me/psychofreepen'],
    knowsAbout:
      locale === 'fa'
        ? ['روانکاوی', 'روان‌شناسی بالینی', 'روانکاوی و فرهنگ', 'روانکاوی و سیاست']
        : ['Psychoanalysis', 'Clinical Psychology', 'Psychoanalysis and Culture'],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: locale === 'fa' ? 'دانشگاه ایران' : 'Iranian University',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
