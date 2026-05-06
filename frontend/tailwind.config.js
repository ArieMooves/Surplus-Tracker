/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {
      colors: {
        'brand-maroon': '#800000',
        'brand-gold': '#FFD700',
        'brand-dark': '#4a0000',
      },
    },
  },
  plugins: [],
}
