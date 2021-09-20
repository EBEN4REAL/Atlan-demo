<template>
    <div class="flex flex-col items-center w-full h-full bg-white border-r">
        <div class="w-full p-3 mb-3">
            <Connector
                v-model:data="connectors"
                :item="{
                    id: 'connector',
                    label: 'Connector',
                    component: 'connector',
                    overallCondition: 'OR',
                    filters: [
                        {
                            attributeName: 'connector',
                            condition: 'OR',
                            isMultiple: false,
                            operator: 'eq',
                        },
                    ],
                    isDeleted: false,
                    isDisabled: false,
                    exclude: false,
                }"
                @change="handleChange"
            ></Connector>
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
    import { defineComponent, Ref, inject } from 'vue'
    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import { tableInterface } from '~/types/insights/table.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { tablesData } from './tablesDemoData'
    import Connector from '@common/facets/connector.vue'

    export default defineComponent({
        components: { Connector },
        props: {},
        setup(props, { emit }) {
            const tables: tableInterface[] = tablesData
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as Ref<activeInlineTabInterface>
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
            const { openAssetSidebar } = useAssetSidebar(tabs, activeInlineTab)

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
            const connectors = {
                connectorsPayload: [],
                checked: [],
            }
            const handleChange = (e) => {
                console.log(e, 'connectorChange')
            }
            return {
                connectors,
                isAssetSidebarOpened,
                openAssetSidebar,
                handleChange,
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
