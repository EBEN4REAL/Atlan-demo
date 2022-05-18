<template>
    <template v-if="data?.component">
        <component :is="data.component" :data="data" :typeName="typeName" />
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
            Name: defineAsyncComponent(() => import('./types/name/index.vue')),

            Terms: defineAsyncComponent(
                () => import('./types/terms/index.vue')
            ),
            Category: defineAsyncComponent(
                () => import('./types/category/index.vue')
            ),

            Experts: defineAsyncComponent(
                () => import('./types/experts/index.vue')
            ),
            Owners: defineAsyncComponent(
                () => import('./types/owners/index.vue')
            ),
            Admins: defineAsyncComponent(
                () => import('./types/admins/index.vue')
            ),
            Viewers: defineAsyncComponent(
                () => import('./types/viewers/index.vue')
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
            Delete: defineAsyncComponent(
                () => import('./types/delete/index.vue')
            ),
            ProcessSQL: defineAsyncComponent(
                () => import('./types/lineage/processSQL.vue')
            ),
            MultipleAttributes: defineAsyncComponent(
                () => import('./types/multipleAttributes/index.vue')
            ),
        },
        props: {
            data: {
                type: Object as PropType<activityInterface>,
                default() {
                    return { displayValue: 'Event', value: [] }
                },
            },
            typeName: {
                type: String,
                required: false,
                default: () => '',
            },
        },
    })
</script>
