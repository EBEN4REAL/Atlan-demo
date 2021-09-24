import commonjs from '@rollup/plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

export default {
    // input: 'node_modules/xml2js/lib/xml2js.js',
    // output: {
    //   dir: 'src/cjs',
    //   format: 'iife',
    //   exports: 'named',
    //   name: 'xml2js',
    // },
    plugins: [
        resolve(),
        commonjs({
            exclude: [/./],
            transformMixedEsModules: true,
            defaultIsModuleExports: true,
        }),
    ],
}
