<template>
    <div>
        <a-dropdown :trigger="['click']">
            <AtlanIcon
                icon="KebabMenu"
                class="w-4 h-4 my-auto -mr-1.5 outline-none pl-2"
                :class="
                    item?.selected ? 'tree-light-color' : 'bg-gray-light-color'
                "
            />
            <template #overlay>
                <a-menu>
                    <a-menu-item
                        :class="[
                            readOnly
                                ? ' bg-gray-100 cursor-not-allowed pointer-events-none'
                                : '',
                            canJoinTablePanel ? ' ' : ' cursor-not-allowed ',
                        ]"
                    >
                        <div
                            class="flex items-center h-8"
                            @click="joinTablePanel"
                        >
                            <AtlanIcon
                                icon="JoinHeader"
                                class="w-4 h-4 my-auto mr-1.5"
                            ></AtlanIcon>
                            <span>Join Table</span>
                        </div>
                    </a-menu-item>
                    <a-menu-item
                        :class="
                            readOnly
                                ? '  cursor-not-allowed pointer-events-none'
                                : ''
                        "
                    >
                        <div
                            class="flex items-center h-8"
                            @click="addFilterPanel"
                            :class="[
                                !canAddOtherPanels ? ' cursor-not-allowed' : '',
                            ]"
                        >
                            <AtlanIcon
                                icon="FilterFunnel"
                                class="w-4 h-4 my-auto mr-1.5"
                            ></AtlanIcon>
                            <span>Filter</span>
                        </div>
                    </a-menu-item>
                    <a-menu-item>
                        <div
                            class="flex items-center h-8"
                            @click="addGroupPanel"
                            :class="[
                                !canAddOtherPanels ? ' cursor-not-allowed' : '',
                            ]"
                        >
                            <AtlanIcon
                                icon="BuilderGroup"
                                class="w-4 h-4 my-auto mr-1.5 focus:outline-none"
                            ></AtlanIcon>
                            <span>Group</span>
                        </div>
                    </a-menu-item>
                    <a-menu-item>
                        <div
                            class="flex items-center h-8"
                            @click="addAggregatePanel"
                            :class="[
                                !canAddOtherPanels
                                    ? 'bg-gray-100 cursor-not-allowed'
                                    : '',
                            ]"
                        >
                            <AtlanIcon
                                icon="Trigger"
                                class="w-4 h-4 my-auto mr-1.5 focus:outline-none"
                            ></AtlanIcon>
                            <span>Aggregate</span>
                        </div>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        PropType,
        toRefs,
        ComputedRef,
        inject,
        Ref,
        ref,
    } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import {
        addFilter,
        addAggregate,
        addGroup,
        addTable,
        addJoin,
    } from './composables/usepanels'

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
            const { item, treeData } = toRefs(props)
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const inlineTabs = inject('inlineTabs') as Ref<
                activeInlineTabInterface[]
            >

            const ifAddTableFirst = (
                activeInlineTab: Ref<activeInlineTabInterface>,
                item: Ref<assetInterface>
            ) => {
                if (
                    activeInlineTab.value.playground.vqb.selectedTables
                        .length === 0
                ) {
                    treeData.value.forEach((el) => {
                        if (
                            item.value?.entity?.attributes?.qualifiedName.includes(
                                el?.entity?.attributes?.qualifiedName
                            )
                        ) {
                            addTable(activeInlineTab, ref(el), inlineTabs)
                            return
                        }
                    })
                }
            }

            const canAddOtherPanels = computed(() => {
                if (
                    activeInlineTab.value.playground.vqb.selectedTables.length <
                    0
                )
                    return true
                const res =
                    item.value?.entity.attributes?.qualifiedName.includes(
                        activeInlineTab.value.playground.vqb.selectedTables[0]
                            .tableQualifiedName
                    )
                return res
            })

            const canJoinTablePanel = computed(() => {
                // debugger
                const { index, left, right } = checkWhichPosition()
                if (index >= 0) {
                    // if item is already there
                    // let res = false

                    // activeInlineTab.value.playground.vqb.selectedTables.every(
                    //     (tableD) => {
                    //         if (
                    //             item.value?.entity.attributes?.qualifiedName.includes(
                    //                 tableD.tableQualifiedName
                    //             )
                    //         ) {
                    //             res = true
                    //             return false
                    //         }
                    //         return true
                    //     }
                    // )

                    if (left) {
                        let canAddToLeft = false
                        activeInlineTab.value.playground.vqb.selectedTables.forEach(
                            (tableD) => {
                                if (
                                    item.value?.entity.attributes?.qualifiedName.includes(
                                        tableD.tableQualifiedName
                                    )
                                ) {
                                    canAddToLeft = true
                                    return canAddToLeft
                                }
                            }
                        )

                        return canAddToLeft
                    } else if (right) {
                        let canAddToRight = true
                        activeInlineTab.value.playground.vqb.selectedTables.forEach(
                            (tableD) => {
                                if (
                                    item.value?.entity.attributes?.qualifiedName.includes(
                                        tableD.tableQualifiedName
                                    )
                                ) {
                                    canAddToRight = false
                                    return canAddToRight
                                }
                            }
                        )

                        return canAddToRight
                    }
                } else {
                    let canAddToLeft = false
                    activeInlineTab.value.playground.vqb.selectedTables.forEach(
                        (tableD) => {
                            if (
                                item.value?.entity.attributes?.qualifiedName.includes(
                                    tableD.tableQualifiedName
                                )
                            ) {
                                canAddToLeft = true
                                return canAddToLeft
                            }
                        }
                    )

                    return canAddToLeft
                }
            })

            const addFilterPanel = () => {
                if (!canAddOtherPanels.value) return
                ifAddTableFirst(activeInlineTab, item)
                addFilter(activeInlineTab, item)
            }
            const addAggregatePanel = () => {
                if (!canAddOtherPanels.value) return
                ifAddTableFirst(activeInlineTab, item)
                addAggregate(activeInlineTab, item)
            }
            const addGroupPanel = () => {
                if (!canAddOtherPanels.value) return
                ifAddTableFirst(activeInlineTab, item)
                addGroup(activeInlineTab, item)
            }
            const isTablePresentInVQBContext = () => {
                // exception for 1 table
                if (
                    activeInlineTab.value.playground.vqb.selectedTables
                        .length === 0
                )
                    return true
                let res = false
                activeInlineTab.value.playground.vqb.selectedTables.forEach(
                    (table) => {
                        if (
                            item.value?.entity.attributes?.qualifiedName.includes(
                                table.tableQualifiedName
                            )
                        ) {
                            res = true
                        }
                    }
                )
                return res
            }

            const checkWhichPosition = () => {
                let index = -1,
                    pos
                const joinIndex =
                    activeInlineTab.value.playground.vqb.panels.findIndex(
                        (panel) => panel.id.toLowerCase() === 'join'
                    )

                if (joinIndex > 0) {
                    const subpanels =
                        activeInlineTab.value.playground.vqb.panels[joinIndex]
                            .subpanels

                    const subpanelLen = subpanels.length
                    // found very first empty filed in joins
                    for (let i = 0; i < subpanelLen; i++) {
                        // first check right side then left side
                        if (
                            Object.keys(subpanels[i].columnsDataLeft, {})
                                .length === 0
                        ) {
                            index = i
                            pos = 'left'
                            return {
                                index: index,
                                left: pos === 'left',
                                right: pos === 'right',
                            }
                        } else if (
                            Object.keys(subpanels[i].columnsDataRight, {})
                                .length === 0
                        ) {
                            index = i
                            pos = 'right'
                            return {
                                index: index,
                                left: pos === 'left',
                                right: pos === 'right',
                            }
                        }
                    }
                }

                return {
                    index: index,
                    left: pos === 'left',
                    right: pos === 'right',
                }
            }

            const joinTablePanel = () => {
                if (!canJoinTablePanel.value) return
                addJoin(activeInlineTab, item)
            }
            return {
                joinTablePanel,
                canAddOtherPanels,
                canJoinTablePanel,
                isTablePresentInVQBContext,
                addAggregatePanel,
                addFilterPanel,
                addGroupPanel,
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
