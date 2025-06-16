module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        'fira-code': ['Fira Code', 'monospace']
      },
      colors: {
        brand: {
          blue: '#0f253a',
          mint: '#7ecdd6',
          lightmint: '#b4dff4',
          uploadBtn: '#A9D0E0',
          optimizeBtn: '#A6D8CF',
          preview: '#0F1A2B',
          lineNumbers: '#383737',
          inputBg: '#E0E0E0'
        }
      },
      boxShadow: {
        'custom': '0px 4px 16px rgba(0, 0, 0, 0.25)'
      }
    }
  },
  plugins: []
}
