/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "contix-primary": "#6347F9",
        "contix-dark": "#151418",
        "contix-success": "#00C853",
        "contix-gray": "#6C6C70",
        "contix-light": "#F5F5F5",
      },
    },
  },
  plugins: [],
}
