<template>
    <Overview></Overview>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useHead } from '@vueuse/head'
    import Overview from '@/admin/overview.vue'
    import useAuth from '~/composables/auth/useAuth'

    export default defineComponent({
        components: { Overview },
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
    permissions: [UPDATE_WORKSPACE]
</route>
