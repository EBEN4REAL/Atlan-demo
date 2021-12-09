/* eslint-disable import/prefer-default-export */
import { useAuthStore } from '~/store/auth'
import { isString } from '../checkType'

// auth directive use it as v-auth
export function authDirective(app: any) {
    app.directive('auth', {
        beforeMount(el, binding, vnode) {
            const authStore = useAuthStore()
            let time = 0
            if(authStore.permissions.length === 0){
               time = 3000
            }
            setTimeout(() => {
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
    
                el.style.setProperty('display', 'none', 'important');
            }, time);
        },
    })
}
