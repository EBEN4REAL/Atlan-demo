<template>
    <router-view />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useI18n } from 'vue-i18n'
    import useTypedefs from '~/composables/typedefs/useTypedefs'

    import useTenant from '~/composables/tenant/useTenant'
    import useConnection from '~/composables/connection/useConnection'
    import useIntegration from '~/composables/integrations/useIntegrations'
    import usePermissions from '~/composables/auth/usePermissions'
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
            authStore.setUserDetails()

            // permissions
            usePermissions()

            // tenant
            useTenant()

            // typedefs
            useTypedefs()

            // // connections
            useConnection()

            // // glossary list
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

            return { locale, t }
        },
    })
</script>
