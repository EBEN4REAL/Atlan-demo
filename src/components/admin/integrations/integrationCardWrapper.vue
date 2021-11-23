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
            integrationData: { type: Object, required: true },
        },
        setup(props) {
            const { integrationData: data } = toRefs(props)
            provide('data', data)
            return {}
        },
    })
</script>

<style scoped></style>
