// tailwind.config.js

module.exports = {
  jit: true,
  important: true,
  purge: {
    safeList: [],
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
      // etc.
    ],
  },
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Avenir"],
        serif: ["Avenir"],
      },
      colors: {
        primary: {
          100: "#d2d4f6",
          200: "#a6a8ed",
          300: "#797de4",
          400: "#4d51db",
          500: "#2026d2",
          600: "#1a1ea8",
          700: "#13177e",
          800: "#0d0f54",
          900: "#06082a",
        },
        sidebar: "#f7f6f3",
        dark: {
          100: "#d2d2d3",
          200: "#a5a6a7",
          300: "#79797b",
          400: "#4c4d4f",
          500: "#1f2023",
          600: "#191a1c",
          700: "#131315",
          800: "#0c0d0e",
          900: "#060607",
        },
        body: "#f8f8fd",
      },
    },
  },
  variants: {
    extend: {},
  }, 
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography'),
  ],
}