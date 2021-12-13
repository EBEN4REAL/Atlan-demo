/* eslint-disable import/prefer-default-export */
import { useAuthStore } from '~/store/auth'
import { isString } from '../checkType'
import { storeToRefs } from 'pinia'

// auth directive use it as v-auth
export function authDirective(app: any) {
    app.directive('auth', {
        beforeMount(el, binding, vnode) {
            const authStore = storeToRefs(useAuthStore())
                if (!binding.value) {
                    return
                }
    
                if (Array.isArray(binding.value)) {
                    if (
                        binding.value?.every(
                            (elem) => authStore.permissions.value.indexOf(elem) > -1
                        )
                    ) {
                        return
                    }
                }
                if (isString(binding.value)) {
                    if (authStore.permissions.value.indexOf(binding.value) > -1) {
                        return
                    }
                }
    
                el.style.setProperty('display', 'none', 'important');
        },
    })
}
