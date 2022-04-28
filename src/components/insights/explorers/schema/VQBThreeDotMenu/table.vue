<template>
    <div>
        <a-tooltip color="#363636" placement="top">
            <template #title>Start a visual query</template>

            <div
                class="flex items-center w-6 h-6 p-1 rounded hover:bg-new-gray-300"
                @click="addTablePanel"
            >
                <AtlanIcon
                    icon="Vqb24"
                    class="w-4 h-4 my-auto mr-0.5"
                ></AtlanIcon>
            </div>
        </a-tooltip>
    </div>
    <!-- <a-dropdown :trigger="['click']">
        <AtlanIcon
            icon="KebabMenu"
            class="w-4 h-4 my-auto -mr-1.5 outline-none pl-2"
            :class="item?.selected ? 'tree-light-color' : 'bg-gray-light-color'"
        />
        <template #overlay>
            <a-menu>
                <a-menu-item
                    :class="
                        readOnly
                            ? ' bg-gray-100 cursor-not-allowed pointer-events-none'
                            : ''
                "
                    v-if="!isThisTablePresentInVQBContext()"
                >
                    <div class="flex items-center h-8" @click="addTablePanel">
                        <AtlanIcon
                            icon="Table"
                            class="w-4 h-4 my-auto mr-1.5"
                        ></AtlanIcon>
                        <span>Select Table</span>
                    </div>
                </a-menu-item>
                <a-menu-item
                    :class="
                        readOnly
                            ? ' bg-gray-100 cursor-not-allowed pointer-events-none'
                            : ''
                    "
                    v-if="!isThisBaseTable()"
                >
                    <div class="flex items-center h-8">
                        <AtlanIcon
                            icon="JoinHeader"
                            class="w-4 h-4 my-auto mr-1.5"
                        ></AtlanIcon>
                        <span>Join Table</span>
                    </div>
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown> -->
    <div></div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        toRefs,
        inject,
        ComputedRef,
        Ref,
        computed,
    } from 'vue'
    import { addTable } from './composables/usepanels'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        components: {},
        props: {
            item: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            treeData: {
                type: Object as PropType<any[]>,
                required: true,
                default: () => [],
            },
        },
        setup(props) {
            const { item } = toRefs(props)
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >

            const isThisTablePresentInVQBContext = () => {
                if (
                    activeInlineTab.value.playground.vqb.selectedTables
                        .length === 0
                )
                    return false

                return true
            }

            const isThisBaseTable = () => {
                if (
                    activeInlineTab.value.playground.vqb.selectedTables.length >
                        0 &&
                    activeInlineTab.value.playground.vqb.selectedTables[0]
                        .tableQualifiedName ===
                        item.value?.entity.attributes?.qualifiedName
                )
                    return true
                return false
            }

            const isBaseTableAdded = computed(() => {
                return (
                    activeInlineTab.value.playground.vqb.selectedTables
                        ?.length > 0
                )
            })
            const addTablePanel = () => {
                // if (isBaseTableAdded.value) return
                addTable(activeInlineTab, item, inlineTabs)
                useAddEvent('insights', 'schemaTree', 'itemClick', {
                    action: 'start_visual_query',
                    trigger: 'quick_action',
                    query_tab_id: activeInlineTab.value.key,
                    asset_type: item.value.typeName,
                })
            }

            return {
                isBaseTableAdded,
                isThisBaseTable,
                isThisTablePresentInVQBContext,
                addTablePanel,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
