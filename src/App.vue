<template>
    <router-view v-if="isTypedefReady && isPermissionsReady" />
</template>

<script lang="ts">
    import { defineComponent, ref, watch, inject, computed } from 'vue'
    import useTypedefs from '~/composables/typedefs/useTypedefs'

    import useTenant from '~/composables/tenant/useTenant'
    import useConnection from '~/composables/connection/useConnection'
    import useGlossary from '~/composables/glossary/useGlossary'
    import usePermissions from '~/composables/auth/usePermissions'

    export default defineComponent({
        setup(props, context) {
            const isPermissionsReady = ref(false)
            const isTypedefReady = ref(false)

            // permissions
            const { data } = usePermissions()

            // tenant
            useTenant()

            // typedefs
            const { data: typedef } = useTypedefs()

            // connections
            useConnection()

            // glossary list
            useGlossary()

            watch([data], () => {
                isPermissionsReady.value = true
            })
            watch([typedef], () => {
                isTypedefReady.value = true
            })

            return { data, isTypedefReady, isPermissionsReady }
        },
    })
</script>
