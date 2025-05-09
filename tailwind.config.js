/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'founders-grotesk': ['Founders Grotesk', 'sans-serif'],
      },
      colors: {
        'accent-color': '#FFB800',
      },
      boxShadow: {
        'custom': '0 4px 12px rgba(0, 0, 0, 0.05)',
        'custom-lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'custom': '16px',
      },
    },
  },
  plugins: [],
}
