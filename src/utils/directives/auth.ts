/* eslint-disable import/prefer-default-export */
import { useAuthStore } from '~/store/auth'
import { isString } from '../checkType'

// auth directive use it as v-auth
export function authDirective(app: any) {
    app.directive('auth', {
        beforeMount(el, binding, vnode) {
            const authStore = useAuthStore()

            if (!binding.value) {
                return
            }

            if (Array.isArray(binding.value)) {
                if (
                    binding.value?.every(
                        (elem) => authStore.permissions.indexOf(elem) > -1
                    )
                ) {
                    return
                }
            }
            if (isString(binding.value)) {
                if (authStore.permissions.indexOf(binding.value) > -1) {
                    return
                }
            }

            el.setProperty('style', 'display: none !important');
        },
    })
}
