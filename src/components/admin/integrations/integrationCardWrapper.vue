<template>
    <component :is="integrationTypeObject.name" />
</template>

<script lang="ts">
    import { defineAsyncComponent, defineComponent, provide, toRefs } from 'vue'

    export default defineComponent({
        name: 'IntegrationCardWrapper',
        components: {
            slack: defineAsyncComponent(
                () => import('./slack/slackIntegrationCard.vue')
            ),
        },
        props: {
            integrationTypeObject: { type: Object, required: true },
        },
        setup(props) {
            const { integrationTypeObject } = toRefs(props)
            provide('integrationTypeObject', integrationTypeObject)
            return {}
        },
    })
</script>

<style scoped></style>
