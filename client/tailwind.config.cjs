module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { inter: ['Inter', 'sans-serif'] },
      colors: {
        brand: {
          blue: '#0f253a',
          mint: '#7ecdd6',
          lightmint: '#b4dff4',
        },
      },
    },
  },
  plugins: [],
};
