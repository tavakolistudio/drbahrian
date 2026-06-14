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
        'deep-teal': '#1c5d5f',
        'pine-shadow': '#0e4749',
        'sage': '#65b8a2',
        'lake-teal': '#2a7779',
        'forest-floor': '#156152',
        'ink-navy': '#16325a',
        'dusty-rose': '#d6aec1',
        'mint-mist': '#a2cbcd',
        'sea-foam': '#cae1e2',
        'paper-white': '#f2f8f7',
        'card-mint': '#e4f0f1',
        'blush-sand': '#f2e8e2',
        'charcoal-navy': '#283338',
      },
      fontFamily: {
        vazir: ['var(--font-vazir)', 'Tahoma', 'Arial', 'sans-serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        source: ['var(--font-source-serif)', 'Georgia', 'serif'],
        ibm: ['var(--font-ibm-plex-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        nav: '88px',
        pill: '1000px',
        btn: '48px',
      },
      maxWidth: {
        page: '1200px',
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            maxWidth: '70ch',
            color: '#333333',
            lineHeight: '1.9',
            '--tw-prose-body': '#333333',
            '--tw-prose-headings': '#283338',
            '--tw-prose-links': '#0e4749',
            '--tw-prose-bold': '#283338',
            '--tw-prose-counters': '#5a7074',
            '--tw-prose-bullets': '#1c5d5f',
            '--tw-prose-hr': '#e4f0f1',
            '--tw-prose-quotes': '#333333',
            '--tw-prose-quote-borders': '#1c5d5f',
            '--tw-prose-captions': '#5a7074',
            '--tw-prose-code': '#283338',
            '--tw-prose-pre-code': '#e0e0e0',
            '--tw-prose-pre-bg': '#1e1e1e',
            '--tw-prose-th-borders': '#e4f0f1',
            '--tw-prose-td-borders': '#e4f0f1',
            a: {
              color: '#0e4749',
              textDecorationColor: 'transparent',
              transition: 'text-decoration-color 0.2s',
              '&:hover': { textDecorationColor: '#0e4749' },
            },
            'h1, h2, h3, h4': {
              color: '#283338',
              fontWeight: '800',
              fontFamily: 'var(--font-source-serif), Georgia, serif',
              letterSpacing: '-0.03em',
            },
            blockquote: {
              borderInlineStartColor: '#1c5d5f',
              color: '#333333',
              fontStyle: 'normal',
            },
            code: {
              color: '#283338',
              backgroundColor: 'rgba(28,93,95,0.07)',
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
