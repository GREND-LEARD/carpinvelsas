/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        beige: {
          50: '#FDFAF3',
          100: '#FBF5E6',
          200: '#F6EBCE',
          300: '#F1E1B5',
          400: '#ECD79D',
          500: '#E7CD84',
          600: '#D9B95A',
          700: '#C6A33D',
          800: '#A88C2D',
          900: '#8A7425',
        },
        gray: {
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    function({ addBase, addComponents, theme }) {
      addBase({
        'html.light': {
          backgroundColor: theme('colors.white'),
          color: theme('colors.gray.900'),
        },
        'body': {
          backgroundColor: theme('colors.white'),
          color: theme('colors.gray.900'),
        },
        '@media (max-width: 640px)': {
          'body': {
            backgroundColor: theme('colors.white'),
            color: theme('colors.gray.900'),
          }
        }
      });
      
      addComponents({
        '.mobile-light': {
          '@media (max-width: 640px)': {
            backgroundColor: theme('colors.white'),
            color: theme('colors.gray.900'),
          }
        }
      });
    }
  ],
}
