import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import getAntDesignVariables from './src/styles/antd_variables'
import postcss from './postcss.config.js'
import styleImport from 'vite-plugin-style-import'
import svgLoader from 'vite-svg-loader'
import strip from '@rollup/plugin-strip'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import OptimizationPersist from 'vite-plugin-optimize-persist'
import PkgConfig from 'vite-plugin-package-config'
// import Components from 'unplugin-vue-components/vite'

import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
    const root = process.cwd()
    const env = loadEnv(mode, root)

    return {
        resolve: {
            alias: {
                '~/': `${path.resolve(__dirname, 'src')}/`,
                '@/': `${path.resolve(__dirname, 'src/components')}/`,
                '@services/': `${path.resolve(__dirname, 'src/services')}/`,
                '@common/': `${path.resolve(
                    __dirname,
                    'src/components/common'
                )}/`,
            },
        },
        define: {
            'process.env': process.env,
        },
        css: {
            postcss,
            modules: {
                scopeBehaviour: 'local',
                //globalModulePaths: ['./styles/antd.less']
            },
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
            // https://github.com/antfu/vite-plugin-optimize-persist
            PkgConfig(),
            OptimizationPersist(),
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
            styleImport({
                libs: [],
            }),
            svgLoader({
                // svgoConfig: [
                //     'prefixIds'
                // ],
                svgo: false,
            }),
            {
                ...strip({ include: '**/*.+(vue|js|ts)' }),
                apply: 'build',
            },
            VueI18n({
                runtimeOnly: true,
                compositionOnly: false,
                include: [path.resolve(__dirname, 'src/locales/**')],
            }),

            // Components(),
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
