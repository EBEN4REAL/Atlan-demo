<template>
    <component :is="`slack`" />
</template>

<script lang="ts">
    import { defineAsyncComponent, defineComponent, provide, toRefs } from 'vue'

    export default defineComponent({
        name: 'IntegrationCardWrapper',
        components: {
            slack: defineAsyncComponent(
                () => import('./integrationCards/slack.vue')
            ),
        },
        props: {
            integration: { type: Object, required: true },
            integrationData: { type: Object, required: true },
        },
        setup(props) {
            const { integrationData: data, integration } = toRefs(props)
            provide('data', data)
            provide('integration', integration)
            return {}
        },
    })
</script>

<style scoped></style>
