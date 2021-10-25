<template>
    <IntegrationsView />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useHead } from '@vueuse/head'
    import IntegrationsView from '@/admin/integrations/integrationsView.vue'
    import useAuth from '~/services2/service/composable/useAuth'

    export default defineComponent({
        components: {
            IntegrationsView,
        },
        setup() {
            useHead({
                title: 'Overview',
            })
            const { isAccess } = useAuth()
            return { isAccess }
        },
    })
</script>
<style lang="less" module></style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
