/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#1e40af',
        'brand-secondary': '#3b82f6',
        'base-100': '#f8fafc',
        'base-200': '#e2e8f0',
        'base-300': '#cbd5e1',
        'base-content': '#020617',
        'dark-100': '#0f172a',
        'dark-200': '#1e293b',
        'dark-300': '#334155',
        'dark-content': '#f1f5f9',
      },
    },
  },
  plugins: [],
}