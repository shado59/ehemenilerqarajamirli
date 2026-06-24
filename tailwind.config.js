module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ancient: {
          900: '#0b0a0a',
          sand: '#f5e0b7',
          amber: '#b7791f'
        }
      }
    }
  },
  plugins: [],
}
