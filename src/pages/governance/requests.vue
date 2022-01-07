<template>
    <RequestList v-if="isAccess" />
    <NoAccess v-else />
</template>

<script lang="ts">
    import { defineComponent, watch, onMounted } from 'vue'
    import { useHead } from '@vueuse/head'
    import RequestList from '~/components/governance/requests/index.vue'
    // import Overview from '~/components/admin/overview/index.vue'
    import NoAccess from '@/common/secured/access.vue'
    import useAuth from '~/composables/auth/useAuth'
    import { useTrackPage } from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        components: { RequestList, NoAccess },
        setup() {
            useHead({
                title: 'Requests',
            })
            const { isAccess } = useAuth()
            onMounted(() => {
                useTrackPage('governance', 'requests')
            })
            return { isAccess }
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
    permissions: [LIST_REQUEST]
</route>
