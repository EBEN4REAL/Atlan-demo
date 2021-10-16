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

    export default defineComponent({
        components: {
            Health,
        },
        setup() {
            useHead({
                title: 'Health page',
            })
        },
    })
</script>
<style lang="less" module></style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
