<template>
    <Integrations />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import Integrations from '@/admin/integrations/wrapper.vue'

    export default defineComponent({
        name: 'IntegrationPage',
        components: { Integrations },
        setup() {
            return {}
        },
    })
</script>

<style scoped></style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
    permissions: [LIST_INTEGRATION]
</route>
