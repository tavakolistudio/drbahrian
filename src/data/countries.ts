export interface Country {
  code: string
  name: string        // Persian name
  nameEn: string     // English name
  timezone: string   // Primary IANA timezone
  flag: string
}

export const COUNTRIES: Country[] = [
  { code: 'IR', name: 'ایران', nameEn: 'Iran', timezone: 'Asia/Tehran', flag: '🇮🇷' },
  { code: 'DE', name: 'آلمان', nameEn: 'Germany', timezone: 'Europe/Berlin', flag: '🇩🇪' },
  { code: 'GB', name: 'انگلستان', nameEn: 'United Kingdom', timezone: 'Europe/London', flag: '🇬🇧' },
  { code: 'US-E', name: 'آمریکا (شرقی)', nameEn: 'USA – Eastern', timezone: 'America/New_York', flag: '🇺🇸' },
  { code: 'US-C', name: 'آمریکا (مرکزی)', nameEn: 'USA – Central', timezone: 'America/Chicago', flag: '🇺🇸' },
  { code: 'US-M', name: 'آمریکا (کوهستانی)', nameEn: 'USA – Mountain', timezone: 'America/Denver', flag: '🇺🇸' },
  { code: 'US-W', name: 'آمریکا (غربی)', nameEn: 'USA – Pacific', timezone: 'America/Los_Angeles', flag: '🇺🇸' },
  { code: 'CA-E', name: 'کانادا (شرقی)', nameEn: 'Canada – Eastern', timezone: 'America/Toronto', flag: '🇨🇦' },
  { code: 'CA-W', name: 'کانادا (غربی)', nameEn: 'Canada – Pacific', timezone: 'America/Vancouver', flag: '🇨🇦' },
  { code: 'AU-E', name: 'استرالیا (شرقی)', nameEn: 'Australia – Eastern', timezone: 'Australia/Sydney', flag: '🇦🇺' },
  { code: 'AU-W', name: 'استرالیا (غربی)', nameEn: 'Australia – Western', timezone: 'Australia/Perth', flag: '🇦🇺' },
  { code: 'SE', name: 'سوئد', nameEn: 'Sweden', timezone: 'Europe/Stockholm', flag: '🇸🇪' },
  { code: 'NO', name: 'نروژ', nameEn: 'Norway', timezone: 'Europe/Oslo', flag: '🇳🇴' },
  { code: 'DK', name: 'دانمارک', nameEn: 'Denmark', timezone: 'Europe/Copenhagen', flag: '🇩🇰' },
  { code: 'FI', name: 'فنلاند', nameEn: 'Finland', timezone: 'Europe/Helsinki', flag: '🇫🇮' },
  { code: 'NL', name: 'هلند', nameEn: 'Netherlands', timezone: 'Europe/Amsterdam', flag: '🇳🇱' },
  { code: 'BE', name: 'بلژیک', nameEn: 'Belgium', timezone: 'Europe/Brussels', flag: '🇧🇪' },
  { code: 'FR', name: 'فرانسه', nameEn: 'France', timezone: 'Europe/Paris', flag: '🇫🇷' },
  { code: 'IT', name: 'ایتالیا', nameEn: 'Italy', timezone: 'Europe/Rome', flag: '🇮🇹' },
  { code: 'ES', name: 'اسپانیا', nameEn: 'Spain', timezone: 'Europe/Madrid', flag: '🇪🇸' },
  { code: 'CH', name: 'سوئیس', nameEn: 'Switzerland', timezone: 'Europe/Zurich', flag: '🇨🇭' },
  { code: 'AT', name: 'اتریش', nameEn: 'Austria', timezone: 'Europe/Vienna', flag: '🇦🇹' },
  { code: 'TR', name: 'ترکیه', nameEn: 'Turkey', timezone: 'Europe/Istanbul', flag: '🇹🇷' },
  { code: 'AE', name: 'امارات', nameEn: 'UAE', timezone: 'Asia/Dubai', flag: '🇦🇪' },
  { code: 'SA', name: 'عربستان', nameEn: 'Saudi Arabia', timezone: 'Asia/Riyadh', flag: '🇸🇦' },
  { code: 'QA', name: 'قطر', nameEn: 'Qatar', timezone: 'Asia/Qatar', flag: '🇶🇦' },
  { code: 'KW', name: 'کویت', nameEn: 'Kuwait', timezone: 'Asia/Kuwait', flag: '🇰🇼' },
  { code: 'BH', name: 'بحرین', nameEn: 'Bahrain', timezone: 'Asia/Bahrain', flag: '🇧🇭' },
  { code: 'OM', name: 'عمان', nameEn: 'Oman', timezone: 'Asia/Muscat', flag: '🇴🇲' },
  { code: 'JP', name: 'ژاپن', nameEn: 'Japan', timezone: 'Asia/Tokyo', flag: '🇯🇵' },
  { code: 'KR', name: 'کره جنوبی', nameEn: 'South Korea', timezone: 'Asia/Seoul', flag: '🇰🇷' },
  { code: 'MY', name: 'مالزی', nameEn: 'Malaysia', timezone: 'Asia/Kuala_Lumpur', flag: '🇲🇾' },
  { code: 'SG', name: 'سنگاپور', nameEn: 'Singapore', timezone: 'Asia/Singapore', flag: '🇸🇬' },
  { code: 'NZ', name: 'نیوزیلند', nameEn: 'New Zealand', timezone: 'Pacific/Auckland', flag: '🇳🇿' },
  { code: 'PL', name: 'لهستان', nameEn: 'Poland', timezone: 'Europe/Warsaw', flag: '🇵🇱' },
  { code: 'CZ', name: 'چک', nameEn: 'Czech Republic', timezone: 'Europe/Prague', flag: '🇨🇿' },
  { code: 'GR', name: 'یونان', nameEn: 'Greece', timezone: 'Europe/Athens', flag: '🇬🇷' },
  { code: 'PT', name: 'پرتغال', nameEn: 'Portugal', timezone: 'Europe/Lisbon', flag: '🇵🇹' },
  { code: 'RU', name: 'روسیه (مسکو)', nameEn: 'Russia – Moscow', timezone: 'Europe/Moscow', flag: '🇷🇺' },
  { code: 'OTHER', name: 'سایر کشورها', nameEn: 'Other', timezone: 'UTC', flag: '🌍' },
]

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find((c) => c.code === code)
}

export function getTimezoneByCode(code: string): string {
  return getCountryByCode(code)?.timezone ?? 'UTC'
}

export const TOPICS = [
  'اضطراب و استرس',
  'رابطه عاطفی',
  'خانواده',
  'سوگ و فقدان',
  'بحران شخصی',
  'ادامه جلسات قبلی',
  'سایر موارد',
]
