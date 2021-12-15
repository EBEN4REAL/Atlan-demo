/* eslint-disable import/prefer-default-export */
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useAuthStore } from '~/store/auth'
import { isString } from '../checkType'

// auth directive use it as v-auth
export function authDirective(app: any) {
    app.directive('auth', {
        beforeMount(el, binding, vnode) {
            const authStore = useAuthStore()
            const { permissions } = storeToRefs(authStore)
            if (!binding.value) {
                return
            }
            watch(
                permissions,
                () => {
                    if (Array.isArray(binding.value)) {
                        if (
                            binding.modifiers.or
                                ? binding.value?.some(
                                      (elem) =>
                                          permissions.value.indexOf(elem) > -1
                                  )
                                : binding.value?.every(
                                      (elem) =>
                                          permissions.value.indexOf(elem) > -1
                                  )
                        ) {
                            // Do this to revert display none if it was applied in previous evaluation
                            if (el.style.display === 'none')
                                el.style.removeProperty('display')
                            return
                        }
                    }
                    if (isString(binding.value)) {
                        if (permissions.value.indexOf(binding.value) > -1) {
                            // Do this to revert display none if it was applied in previous evaluation
                            if (el.style.display === 'none')
                                el.style.removeProperty('display')
                            return
                        }
                    }
                    el.style.setProperty('display', 'none', 'important')
                },
                { immediate: true, deep: true }
            )
        },
    })
}
