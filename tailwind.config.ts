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
            color: theme('colors.ash'),
            lineHeight: '1.9',
            '--tw-prose-body': theme('colors.ash'),
            '--tw-prose-headings': theme('colors.bone'),
            '--tw-prose-links': '#8052ff',
            '--tw-prose-bold': theme('colors.bone'),
            '--tw-prose-counters': theme('colors.smoke'),
            '--tw-prose-bullets': theme('colors.smoke'),
            '--tw-prose-hr': 'rgba(255,255,255,0.08)',
            '--tw-prose-quotes': theme('colors.ash'),
            '--tw-prose-quote-borders': '#8052ff',
            '--tw-prose-captions': theme('colors.smoke'),
            '--tw-prose-code': theme('colors.bone'),
            '--tw-prose-pre-code': theme('colors.ash'),
            '--tw-prose-pre-bg': '#0d0d0d',
            '--tw-prose-th-borders': 'rgba(255,255,255,0.12)',
            '--tw-prose-td-borders': 'rgba(255,255,255,0.06)',
            a: {
              color: '#8052ff',
              textDecorationColor: 'transparent',
              transition: 'text-decoration-color 0.2s',
              '&:hover': { textDecorationColor: '#8052ff' },
            },
            'h1, h2, h3, h4': {
              color: '#ffffff',
              fontWeight: '300',
              letterSpacing: '-0.02em',
            },
            blockquote: {
              borderInlineStartColor: '#8052ff',
              color: theme('colors.ash'),
              fontStyle: 'normal',
            },
            code: {
              color: '#ffffff',
              backgroundColor: 'rgba(128,82,255,0.12)',
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
