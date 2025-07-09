module.exports = {
  content: [
    "./src/**/*.{astro,js,jsx,ts,tsx,md,mdx,html}",
    // Add other paths if needed
  ],
  plugins: [
    require('tailwindcss/nesting'),
    // other plugins...
  ],
  // ...other config...
}