/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#fffaf0',
        primary: '#0a0a0a',
        'brand-pink': '#ff4d8b',
        'brand-teal': '#1a3a3a',
        'brand-lavender': '#b8a4ed',
        'brand-peach': '#ffb084',
        'brand-ochre': '#e8b94a',
        'brand-mint': '#a4d4c5',
        'brand-coral': '#ff6b5a',
        'surface-soft': '#faf5e8',
        'surface-card': '#f5f0e0',
        'surface-strong': '#ebe6d6',
        'surface-dark': '#0a1a1a',
        hairline: '#e5e5e5',
        ink: '#0a0a0a',
        'body-strong': '#1a1a1a',
        body: '#3a3a3a',
        muted: '#6a6a6a',
        'muted-soft': '#9a9a9a',
      },
      borderRadius: {
        xs: '6px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-2.5px',
        tighter: '-2px',
        tight: '-1px',
      },
    },
  },
  plugins: [],
}
