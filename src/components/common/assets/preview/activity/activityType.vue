<template>
    <template v-if="data?.component">
        <component :is="data.component" :data="data" />
    </template>
</template>

<script lang="ts">
    import { defineComponent, PropType, defineAsyncComponent } from 'vue'
    import { activityInterface } from '~/types/activitylogs/activitylog.interface'

    export default defineComponent({
        name: 'ActivityType',
        components: {
            Certificate: defineAsyncComponent(
                () => import('./types/certificate/index.vue')
            ),
            Classifications: defineAsyncComponent(
                () => import('./types/classifications/index.vue')
            ),
            Description: defineAsyncComponent(
                () => import('./types/description/index.vue')
            ),
            Terms: defineAsyncComponent(
                () => import('./types/terms/index.vue')
            ),
            Experts: defineAsyncComponent(
                () => import('./types/experts/index.vue')
            ),
            Owners: defineAsyncComponent(
                () => import('./types/owners/index.vue')
            ),
            BusinessMetadata: defineAsyncComponent(
                () => import('./types/businessMetadata/index.vue')
            ),
            Announcement: defineAsyncComponent(
                () => import('./types/announcement/index.vue')
            ),
            Create: defineAsyncComponent(
                () => import('./types/create/index.vue')
            ),
        },
        props: {
            data: {
                type: Object as PropType<activityInterface>,
                default() {
                    return { displayValue: 'Event', value: [] }
                },
            },
        },
    })
</script>
