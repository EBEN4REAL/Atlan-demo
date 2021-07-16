// tailwind.config.js
import themeColors from "./src/styles/theme/atlan_theme.js";

export default {
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
      colors:themeColors
    },
  },
  variants: {
    extend: {
      animation: ["motion-safe"],
      borderWidth: ["last"],
      display: ["group-hover"],
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/typography"),
  ],
};
