<template>
    <RequestList />
</template>

<script lang="ts">
    import { defineComponent, watch } from 'vue'
    import { useHead } from '@vueuse/head'
    import RequestList from '~/components/governance/requests/index.vue'
    // import Overview from '~/components/admin/overview/index.vue'
    export default defineComponent({
        components: { RequestList },
        // components: { Overview },
        setup() {
            useHead({
                title: 'Requests',
            })
        },
    })
</script>

<route lang="yaml">
meta:
layout: default
requiresAuth: true
</route>
