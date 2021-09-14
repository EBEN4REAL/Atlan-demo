<template>
    <div class="flex flex-col items-center w-full h-full bg-white border-r">
        <div class="w-full p-3 pb-0">
            <div class="w-full h-40 mb-3 rounded placeholder"></div>
        </div>
        <div class="w-full p-3 pt-0 overflow-y-auto scrollable-container">
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
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs } from 'vue'
    import { tableInterface } from '~/types/insights/table.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { tablesData } from './tablesDemoData'

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
            const tables: tableInterface[] = tablesData

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
    .scrollable-container {
        height: calc(100vh - 14rem);
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
