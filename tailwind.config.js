/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rewear: {
          bg: '#F3F1E7',
          card: '#FAF8F2',
          header: '#EDF5E7',
          dark: '#2B4525',
          tagline: '#334E2D',
          green: '#44663B',
          'green-hover': '#37542E',
          muted: '#6C7D6E',
          border: '#E6E3D7',
          inputBorder: '#E1E6DD',
          inputIcon: '#798C7B',
          text: '#2A3B2C',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      boxShadow: {
        'leaf': '0 20px 48px rgba(44, 70, 40, 0.1), 0 4px 12px rgba(0, 0, 0, 0.03)',
        'btn': '0 6px 16px rgba(68, 102, 59, 0.22)',
        'btn-hover': '0 8px 20px rgba(68, 102, 59, 0.3)',
      },
      borderRadius: {
        '3xl': '28px',
        '4xl': '36px',
        'pill': '50px',
      }
    },
  },
  plugins: [],
}
