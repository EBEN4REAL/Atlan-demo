<template>
    <router-view v-if="isReady" />
</template>

<script lang="ts">
    import { defineComponent, ref, watch, inject, computed } from 'vue'
    import useTypedefs from './services2/meta/composable/useTypedefs'

    import useTenant from './services2/service/composable/useTenant'
    import useConnectionList from './services2/meta/composable/useConnectionList'
    import useGlossaryList from './services2/meta/composable/useGlossaryList'
    import usePermissions from './services2/service/composable/usePermissions'
    import { useAuthStore } from './store/auth'
    import { useRoute, useRouter } from 'vue-router'

    export default defineComponent({
        setup(props, context) {
            const isReady = ref(false)

            // permissions
            const { data } = usePermissions()

            // tenant
            useTenant()

            // typedefs
            useTypedefs()

            // connections
            useConnectionList()

            // glossary list
            useGlossaryList()

            watch(data, () => {
                isReady.value = true
            })

            return { data, isReady }
        },
    })
</script>
