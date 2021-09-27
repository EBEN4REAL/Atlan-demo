<template>
    <Insights />
</template>

<script lang="ts">
    import { defineComponent, provide, toRef } from 'vue'
    import { useHead } from '@vueuse/head'
    import Insights from '~/components/insights/index.vue'
    export default defineComponent({
        name: 'Insights Page',
        components: { Insights },
        props: {
            id: {
                type: String,
                required: true,
                default: '',
            },
        },
        setup(props) {
            useHead({
                title: 'Insights',
            })
            const savedQueryGuidFromURL = toRef(props, 'id')
            provide('savedQueryGuidFromURL', savedQueryGuidFromURL)
        },
    })
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
