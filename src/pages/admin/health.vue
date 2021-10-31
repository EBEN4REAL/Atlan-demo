<template>
    <iframe
        src="https://beta.atlan.com/api/observe/d/TFHNXCk7k/atlan-service-overview?orgId=1&refresh=1m&kiosk"
    ></iframe>
    <Health />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useHead } from '@vueuse/head'
    import Health from '@/admin/health/health.vue'
    import useAuth from '~/composables/auth/useAuth'

    export default defineComponent({
        components: {
            Health,
        },
        setup() {
            useHead({
                title: 'Health page',
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
