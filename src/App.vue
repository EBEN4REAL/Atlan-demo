<template>
    <router-view />
</template>

<script lang="ts">
    import { defineComponent, ref, watch, inject, computed } from 'vue'
    import { useI18n } from 'vue-i18n'
    import useTypedefs from '~/composables/typedefs/useTypedefs'
    import { useConnection } from '~/composables/connection/useConnection'
    import useIntegration from '~/composables/integrations/useIntegrations'
    import { useAuthStore } from './store/auth'
    import useGlossary from './composables/glossary2/useGlossary'
    import usePersona from './composables/persona/usePersona'
    import usePurpose from './composables/purpose/usePurpose'

    export default defineComponent({
        setup(props, context) {
            // const isPermissionsReady = ref(false)
            // const isTypedefReady = ref(false)

            const { locale, t } = useI18n({
                inheritLocale: true,
            })
            const authStore = useAuthStore()

            const bootstrapApp = () => {
                authStore.setUserDetails()

                // permissions
                // ? this habe be been moved to load before app mount
                // usePermissions()

                // tenant
                // ? this habe be been moved to load before app mount
                // useTenant()

                // typedefs
                useTypedefs()

                // connections
                useConnection()

                // glossary list
                useGlossary()

                const { call } = useIntegration(true)
                // if (!route.fullPath.includes('/admin/integrations')) call()

                usePersona()

                usePurpose()

                // watch([data], () => {
                //     isPermissionsReady.value = true
                // })
                // watch([typedef], () => {
                //     isTypedefReady.value = true
                // })
            }

            if (authStore.isAuthenticated) {
                bootstrapApp()
            }
            return { locale, t }
        },
    })
</script>
