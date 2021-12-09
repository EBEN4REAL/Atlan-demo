<template>
    <router-view />
</template>

<script lang="ts">
    import { defineComponent, ref, watch, inject, computed } from 'vue'
    import useTypedefs from '~/composables/typedefs/useTypedefs'

    import useTenant from '~/composables/tenant/useTenant'
    import useConnection from '~/composables/connection/useConnection'
    import useIntegration from '~/composables/integrations/useIntegrations'
    import usePermissions from '~/composables/auth/usePermissions'
    import { useAuthStore } from './store/auth'
    import useGlossary from './composables/glossary2/useGlossary'

    export default defineComponent({
        setup(props, context) {
            // const isPermissionsReady = ref(false)
            // const isTypedefReady = ref(false)

            const authStore = useAuthStore()
            authStore.setUserDetails()

            // permissions
            const { data: permissions } = usePermissions()

            // tenant
            // useTenant()

            // typedefs
            const { data: typedef } = useTypedefs()

            // // connections
            useConnection()

            // // glossary list
            useGlossary()

            useIntegration()

            // watch([data], () => {
            //     isPermissionsReady.value = true
            // })
            // watch([typedef], () => {
            //     isTypedefReady.value = true
            // })

            return {}
        },
    })
</script>
