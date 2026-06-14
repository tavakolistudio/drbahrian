import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: '#1d1d1f',
        graphite: '#707070',
        fog: '#f5f5f7',
        snow: '#ffffff',
        'silver-mist': '#e8e8ed',
        azure: '#0071e3',
        cobalt: '#0066cc',
      },
      fontFamily: {
        vazir: ['var(--font-vazir)', 'Tahoma', 'Arial', 'sans-serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        pill: '999px',
        card: '28px',
        btn: '999px',
      },
      maxWidth: {
        page: '1200px',
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            maxWidth: '70ch',
            color: '#1d1d1f',
            lineHeight: '1.7',
            '--tw-prose-body': '#1d1d1f',
            '--tw-prose-headings': '#1d1d1f',
            '--tw-prose-links': '#0066cc',
            '--tw-prose-bold': '#1d1d1f',
            '--tw-prose-counters': '#707070',
            '--tw-prose-bullets': '#0071e3',
            '--tw-prose-hr': '#e8e8ed',
            '--tw-prose-quotes': '#707070',
            '--tw-prose-quote-borders': '#e8e8ed',
            '--tw-prose-captions': '#707070',
            '--tw-prose-code': '#1d1d1f',
            '--tw-prose-pre-code': '#1d1d1f',
            '--tw-prose-pre-bg': '#f5f5f7',
            '--tw-prose-th-borders': '#e8e8ed',
            '--tw-prose-td-borders': '#e8e8ed',
            a: {
              color: '#0066cc',
              textDecorationColor: 'transparent',
              transition: 'text-decoration-color 0.2s',
              '&:hover': { textDecorationColor: '#0066cc' },
            },
            'h1, h2, h3, h4': {
              color: '#1d1d1f',
              fontWeight: '600',
              letterSpacing: '-0.03em',
            },
            blockquote: {
              borderInlineStartColor: '#e8e8ed',
              color: '#707070',
              fontStyle: 'normal',
            },
            code: {
              color: '#1d1d1f',
              backgroundColor: 'rgba(0,113,227,0.08)',
              borderRadius: '4px',
              padding: '0.2em 0.4em',
              fontWeight: '400',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
          },
        },
        rtl: {
          css: {
            fontFamily: 'var(--font-vazir)',
            lineHeight: '2.1',
            letterSpacing: '0.01em',
          },
        },
      }),
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(12px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [typography],
}

export default config
