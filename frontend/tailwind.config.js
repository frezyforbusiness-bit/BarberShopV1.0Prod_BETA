/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // Barber premium palette
        navy: {
          DEFAULT: '#1a1f36',
          light: '#2a2f46',
          dark: '#0a0f26',
        },
        gold: {
          DEFAULT: '#d4af37',
          light: '#e4c147',
          dark: '#c49f27',
        },
        cream: {
          DEFAULT: '#f5f1e8',
          light: '#fffaf0',
          dark: '#e8e4da',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

