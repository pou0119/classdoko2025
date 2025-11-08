// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // ここでTailwindがCSSを適用するファイルパスを指定します
  content: [
    // Next.jsのapp/pagesとcomponentsフォルダ内のファイルをスキャン対象に追加
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}