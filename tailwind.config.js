/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#F4F1EC', // warm off-white
          warm: '#F4F1EC',
        },
        surface: {
          DEFAULT: '#EAE5DE', // card surface
          muted: '#E3DDD5',
        },
        border: {
          DEFAULT: '#D8D2C9', // divider/border
          subtle: '#E0DAD1',
        },
        ink: {
          DEFAULT: '#2B2A28', // text primary: soft charcoal
          primary: '#2B2A28',
          secondary: '#77726B', // text secondary
          muted: '#9E988F',
          dark: '#1E1D1C', // dark contrast block
        },
        accent: {
          DEFAULT: '#8C8279', // warm stone gray
          hover: '#736A62',
          light: '#A39990',
        },
        charcoal: {
          DEFAULT: '#1E1D1C',
          panel: '#1A1918',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.2em',
        eyebrow: '0.18em',
      },
      maxWidth: {
        content: '1100px',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
