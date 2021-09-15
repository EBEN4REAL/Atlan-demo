<template>
    <Insights />
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import { useHead } from '@vueuse/head'
    import Insights from '~/components/insights/index.vue'
    export default defineComponent({
        name: 'Insights Page',
        components: { Insights },
        props: {},
        setup(props) {
            useHead({
                title: 'Insights',
            })
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
