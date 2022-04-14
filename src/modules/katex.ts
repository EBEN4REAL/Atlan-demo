/* eslint-disable import/prefer-default-export */
import katex from 'katex'
import { UserModule } from '~/types'

export const install: UserModule = ({ app }) => {
    app.directive('katex', {
        beforeMount(el, binding) {
            const expression = binding.value.expression || binding.value
            const options = { throwOnError: false }
            katex.render(expression, el, options)
        },
        beforeUpdate(el, binding) {
            const expression = binding.value.expression || binding.value
            const options = { throwOnError: false }
            katex.render(expression, el, options)
        },
    })
}
