<template>
    <Integrations v-if="isAccess" />
    <NoAccess v-else />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import Integrations from '@/admin/integrations/wrapper.vue'
    import NoAccess from '@/common/secured/access.vue'
    import useAuth from '~/composables/auth/useAuth'

    export default defineComponent({
        name: 'IntegrationPage',
        components: { Integrations, NoAccess },
        setup() {
            const { isAccess } = useAuth()
            return { isAccess }
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
