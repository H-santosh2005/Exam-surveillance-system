/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0d1730',
          900: '#111f3d',
          800: '#16294f',
          700: '#1c3260'
        },
        brand: {
          blue: '#2563eb',
          purple: '#6d28d9',
          purpleDark: '#4c1d95',
          green: '#16a34a',
          amber: '#d97706',
          red: '#dc2626'
        }
      },
      boxShadow: {
        card: '0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15,23,42,0.06)'
      }
    }
  },
  plugins: []
}
