<template>
    <a-popover placement="left">
        <template #content>
            <div class="flex flex-col hovercard text-gray">
                <div class="flex justify-between mb-2 text-sm">
                    <span class="text-gray-500">TERM</span>
                    <span v-if="term.isPropagated" class="text-primary"
                        >Propagated</span
                    >
                </div>
                <span class="mb-1 text-sm font-bold">{{
                    term.displayName
                }}</span>
                <span class="mb-4 text-xs text-gray-500">{{
                    term.glossaryName
                }}</span>
                <span class="mb-1 text-xs text-gray-500">Description</span>
                <span class="mb-4 text-sm">{{ term.description }}</span>

                <span class="mb-1 text-xs text-gray-500">Categories</span>
                <div class="flex flex-wrap gap-3">
                    <span
                        v-for="(category, idx) in term.categories"
                        :key="idx"
                        class="px-3 py-1 text-sm rounded-full bg-gray-light"
                        >{{ category }}</span
                    >
                </div>
            </div>
        </template>
        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        props: {},
        setup() {
            const term = {
                isPropagated: true,
                displayName: 'Transaction table',
                glossaryName: 'Sales',
                description:
                    'Transaction table stores all the information required for a trip',
                categories: ['Databricks', 'Warehouse', 'DB_Dump'],
            }
            return { term }
        },
        name: 'TermInfoHoverCard',
    })
</script>

<style scoped>
    .hovercard {
        max-width: 226px;
    }
</style>
