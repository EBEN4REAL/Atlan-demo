/* eslint-disable import/prefer-default-export */
import katex from 'katex'
import renderMathInElement from 'katex/dist/contrib/auto-render.js'

// katex directive use it as v-katex
export function katexDirective(app: any) {
    app.directive('katex', {
        beforeMount(el, binding) {
            const expression = binding.value.expression || binding.value
            const options={throwOnError:true}
            katex.render(expression, el, options)
        },
    })
}
