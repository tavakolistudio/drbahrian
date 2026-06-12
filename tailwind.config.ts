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
        parchment: {
          50: '#FAFAF7',
          100: '#F5F4EF',
          200: '#ECEAE3',
          300: '#DDD9CF',
          400: '#C8C3B5',
          500: '#ABA49A',
          600: '#7D7870',
          700: '#4F4B45',
          800: '#1E1C18',
          900: '#0F0E0C',
        },
        olive: {
          50: '#EDF1EE',
          100: '#D5E0D8',
          200: '#A8C0B0',
          300: '#749F87',
          400: '#4A7D62',
          500: '#2A5C42',
          600: '#1E4331',
          700: '#142D21',
          800: '#0B1A13',
          900: '#050D09',
        },
        forest: {
          DEFAULT: '#2C4A3E',
          dark: '#1D3329',
          light: '#E8EFEB',
        },
      },
      fontFamily: {
        vazir: ['var(--font-vazir)', 'Tahoma', 'Arial', 'sans-serif'],
        inter: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      typography: (theme: (arg: string) => string) => ({
        DEFAULT: {
          css: {
            maxWidth: '70ch',
            color: theme('colors.parchment.800'),
            lineHeight: '1.9',
            a: {
              color: theme('colors.forest.DEFAULT'),
              textDecorationColor: 'transparent',
              transition: 'text-decoration-color 0.2s',
              '&:hover': { textDecorationColor: theme('colors.forest.DEFAULT') },
            },
            'h1, h2, h3, h4': { color: theme('colors.parchment.900'), fontWeight: '600' },
            blockquote: {
              borderInlineStartColor: theme('colors.forest.DEFAULT'),
              color: theme('colors.parchment.700'),
              fontStyle: 'normal',
            },
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
