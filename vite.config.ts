import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import { resolve } from 'path'
import commonjs from '@rollup/plugin-commonjs'
import getAntDesignVariables from './src/styles/antd_variables'
import postcss from './postcss.config.js'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import styleImport from 'vite-plugin-style-import'
import svgLoader from 'vite-svg-loader'

import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
    const root = process.cwd()
    const env = loadEnv(mode, root)

    return {
        logLevel: 'silent',
        resolve: {
            alias: {
                '~/': `${path.resolve(__dirname, 'src')}/`,
                '@/': `${path.resolve(__dirname, 'src/components')}/`,
                '@common/': `${path.resolve(
                    __dirname,
                    'src/components/common'
                )}/`,
                'antd/lib': 'antd/es',
                '@antv/x6': '@antv/x6/dist/x6.js',
                vue: 'vue/dist/vue.esm-bundler.js',
            },
        },
        define: {
            'process.env': process.env,
        },
        css: {
            postcss,
            preprocessorOptions: {
                less: {
                    modifyVars: getAntDesignVariables,
                    javascriptEnabled: true,
                },
            },
        },
        build: {
            sourcemap: false,
            commonjsOptions: {
                //transformMixedEsModules: true,
                //defaultIsModuleExports: true
            },
        },
        plugins: [
            //commonjs({enforce: 'pre'}),
            visualizer(),
            Vue({
                include: [/\.vue$/],
            }),
            // https://github.com/hannoeru/vite-plugin-pages
            Pages({
                extensions: ['vue'],
                routeBlockLang: 'yaml',
            }),
            // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
            Layouts(),
            // https://github.com/antfu/vite-plugin-pwa

            // https://github.com/intlify/vite-plugin-vue-i18n
            VueI18n({
                include: [path.resolve(__dirname, 'locales/**')],
            }),
            styleImport({
                libs: [],
            }),
            svgLoader(),
        ],
        optimizeDeps: {
            //include: ["vue", "vue-router", "@vueuse/core"],
            exclude: ['monaco-editor'],
        },
        server: {
            proxy: {
                '/api': {
                    target: env.VITE_DEV_API_BASE_URL,
                    changeOrigin: true,
                    ws: false,
                },
            },
        },
    }
})
