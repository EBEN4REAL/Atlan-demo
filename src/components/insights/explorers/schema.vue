<template>
    <div class="flex flex-col items-center w-full h-full p-3 bg-white">
        <div class="w-full h-32 mb-3 rounded placeholder"></div>
        <template v-for="table in tables" :key="table.id">
            <div
                class="flex items-center justify-center w-full px-2 py-2 mb-3 rounded cursor-pointer  placeholder"
                @click="() => openAssetSidebar(table)"
                :class="
                    isAssetSidebarOpened(table)
                        ? 'active-placeholder'
                        : 'placeholder'
                "
            >
                {{ table.label }}
            </div>
        </template>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, Ref, toRefs, computed } from 'vue'
    import { tableInterface } from '~/types/insights/table.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    export default defineComponent({
        components: {},
        props: {
            inlineTabs: {
                type: Object as PropType<activeInlineTabInterface[]>,
                required: true,
            },
            activeInlineTab: {
                type: Object as PropType<activeInlineTabInterface>,
                required: true,
            },
        },
        emits: ['openAssetSidebar'],
        setup(props, { emit }) {
            const { activeInlineTab } = toRefs(props)
            const tables: tableInterface[] = [
                {
                    id: '1y',
                    label: ' Table 1',
                },
                {
                    id: '2y',
                    label: 'Table 2',
                },
                {
                    id: '3y',
                    label: 'Table 3',
                },
            ]

            const openAssetSidebar = (table: tableInterface) => {
                emit('openAssetSidebar', table)
            }
            const isAssetSidebarOpened = (table: tableInterface) => {
                if (
                    activeInlineTab.value &&
                    activeInlineTab.value.assetSidebar
                ) {
                    if (activeInlineTab.value.assetSidebar.id === table.id)
                        return true
                }
                return false
            }
            return {
                isAssetSidebarOpened,
                openAssetSidebar,
                tables,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
    .active-placeholder {
        @apply bg-primary text-white;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
