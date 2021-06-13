import path from "path";
import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Pages from "vite-plugin-pages";
import Layouts from "vite-plugin-vue-layouts";

import VueI18n from "@intlify/vite-plugin-vue-i18n";
import styleImport from "vite-plugin-style-import";
import svgLoader from "vite-svg-loader";


import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {

  return {
    resolve: {
      alias: {
        "~/": `${path.resolve(__dirname, "src")}/`,
        "@/": `${path.resolve(__dirname, "src/components")}/`,
        "@common/": `${path.resolve(__dirname, "src/components/common")}/`,
      },
    },
    define: {
      "process.env": process.env,
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            "primary-color": "#2026d2",
            "link-color": "#2026d2",
            "heading-color": "#595c97",
            "text-color": "#595c97",
          },
          javascriptEnabled: true,
        },
      },
    },
    build: {
      sourcemap: false,
    },
    plugins: [
      visualizer(),
      Vue({
        include: [/\.vue$/],
      }),
      // https://github.com/hannoeru/vite-plugin-pages
      Pages({
        extensions: ["vue"],
        routeBlockLang: "yaml",
      }),
      // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
      Layouts(),
      // https://github.com/antfu/vite-plugin-pwa

      // https://github.com/intlify/vite-plugin-vue-i18n
      VueI18n({
        include: [path.resolve(__dirname, "locales/**")],
      }),
      styleImport({
        libs: [],
      }),
      svgLoader(),
    ],
    optimizeDeps: {
      include: ["vue", "vue-router", "@vueuse/core"],
    },
  };
});
