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
              listStyleType: 'none',
              counterReset: 'list-counter',
              paddingLeft: '0',
            },
            'ol > li': {
              position: 'relative',
              counterIncrement: 'list-counter',
              marginBottom: '1.5rem',
            },
            'ol > li::before': {
              content: 'counter(list-counter) "."',
              fontWeight: '700',
              color: '#333',
              marginRight: '0.5rem',
              display: 'inline-block',
            },
            'ul': {
              marginTop: '1rem',
              marginBottom: '1.5rem',
              listStyleType: 'none',
              paddingLeft: '0',
            },
            'ul > li': {
              position: 'relative',
              paddingLeft: '1.75rem',
              marginBottom: '0.75rem',
            },
            'ul > li::before': {
              backgroundColor: '#333',
              width: '8px',
              height: '8px',
              top: '0.6em',
              left: '0.5rem',
              content: '""',
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
