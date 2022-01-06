<template>
    <Overview v-if="isAccess"></Overview>
    <NoAccess v-else />
</template>

<script lang="ts">
    import { defineComponent, onMounted } from 'vue'
    import { useHead } from '@vueuse/head'
    import Overview from '@/admin/overview/index.vue'
    import useAuth from '~/composables/auth/useAuth'
    import NoAccess from '@/common/secured/access.vue'
    import { useTrackPage } from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        components: { Overview, NoAccess },
        setup() {
            useHead({
                title: 'Overview',
            })
            onMounted(() => {
                useTrackPage('admin', 'overview')
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
    permissions: [UPDATE_WORKSPACE]
</route>
