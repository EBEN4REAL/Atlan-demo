<template>
    <ConfigureNewSSO />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import ConfigureNewSSO from '@/admin/sso/configure/configureNewSSO.vue'

    export default defineComponent({
        name: 'ConfigureSSO',
        components: {
            ConfigureNewSSO,
        },
        setup() {},
    })
</script>

<style></style>
<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
