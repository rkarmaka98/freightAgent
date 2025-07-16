module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1d4ed8',
        secondary: '#6b7280',
        accent: '#f59e0b'
      },
      fontSize: {
        h1: ['2.25rem', { lineHeight: '2.5rem' }],
        h2: ['1.875rem', { lineHeight: '2.25rem' }],
        h3: ['1.5rem', { lineHeight: '2rem' }],
        h4: ['1.25rem', { lineHeight: '1.75rem' }],
        h5: ['1.125rem', { lineHeight: '1.5rem' }],
        h6: ['1rem', { lineHeight: '1.5rem' }],
        body: ['1rem', { lineHeight: '1.5rem' }],
        caption: ['0.875rem', { lineHeight: '1.25rem' }]
      }
    }
  },
  plugins: []
}
