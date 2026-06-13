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
        void: '#000000',
        bone: '#ffffff',
        ash: '#bdbdbd',
        smoke: '#9a9a9a',
        'plum-voltage': '#8052ff',
        'amber-spark': '#ffb829',
        lichen: '#15846e',
      },
      fontFamily: {
        vazir: ['var(--font-vazir)', 'Tahoma', 'Arial', 'sans-serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            maxWidth: '70ch',
            color: '#4a4a4a',
            lineHeight: '1.9',
            '--tw-prose-body': '#4a4a4a',
            '--tw-prose-headings': '#1a1a1a',
            '--tw-prose-links': '#2C4A3E',
            '--tw-prose-bold': '#1a1a1a',
            '--tw-prose-counters': '#6b6b6b',
            '--tw-prose-bullets': '#2C4A3E',
            '--tw-prose-hr': 'rgba(0,0,0,0.08)',
            '--tw-prose-quotes': '#4a4a4a',
            '--tw-prose-quote-borders': '#2C4A3E',
            '--tw-prose-captions': '#6b6b6b',
            '--tw-prose-code': '#1a1a1a',
            '--tw-prose-pre-code': '#e0e0e0',
            '--tw-prose-pre-bg': '#1e1e1e',
            '--tw-prose-th-borders': 'rgba(0,0,0,0.12)',
            '--tw-prose-td-borders': 'rgba(0,0,0,0.06)',
            a: {
              color: '#2C4A3E',
              textDecorationColor: 'transparent',
              transition: 'text-decoration-color 0.2s',
              '&:hover': { textDecorationColor: '#2C4A3E' },
            },
            'h1, h2, h3, h4': {
              color: '#1a1a1a',
              fontWeight: '300',
              letterSpacing: '-0.02em',
            },
            blockquote: {
              borderInlineStartColor: '#2C4A3E',
              color: '#4a4a4a',
              fontStyle: 'normal',
            },
            code: {
              color: '#1a1a1a',
              backgroundColor: 'rgba(44,74,62,0.08)',
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
