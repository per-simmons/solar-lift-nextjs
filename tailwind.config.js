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
      typography: {
        DEFAULT: {
          css: {
            h2: {
              fontWeight: '700',
            },
            h3: {
              fontWeight: '600',
            },
            a: {
              color: '#F9C846',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            blockquote: {
              borderLeftColor: '#F9C846',
              backgroundColor: '#FEF9E6',
            },
            'ol': {
              listStyleType: 'decimal',
              paddingLeft: '1.5rem',
            },
            'ol > li': {
              position: 'relative',
              marginBottom: '0.75rem',
              paddingLeft: '0.5rem',
            },
            'ol > li::before': {
              content: 'none',
            },
            'ul': {
              marginTop: '1rem',
              marginBottom: '1.5rem',
              listStyleType: 'disc',
              paddingLeft: '1.5rem',
            },
            'ul > li': {
              position: 'relative',
              marginBottom: '0.75rem',
            },
            'ul > li::before': {
              content: 'none',
            },
            code: {
              backgroundColor: '#F1F1F1',
              borderRadius: '0.25rem',
              padding: '0.125rem 0.25rem',
            },
            pre: {
              backgroundColor: '#1F2937',
              color: '#F9FAFB',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
