<template>
    <div v-if="isTablePresentInVQBContext()">
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
                    <!-- <a-menu-item
                        :class="
                            readOnly
                                ? ' bg-gray-100 cursor-not-allowed pointer-events-none'
                                : ''
                        "
                    >
                        <div class="flex items-center h-8">
                            <AtlanIcon
                                icon="JoinHeader"
                                class="w-4 h-4 my-auto mr-1.5"
                            ></AtlanIcon>
                            <span>Join Table</span>
                        </div>
                    </a-menu-item> -->
                    <a-menu-item
                        :class="
                            readOnly
                                ? ' bg-gray-100 cursor-not-allowed pointer-events-none'
                                : ''
                        "
                    >
                        <div
                            class="flex items-center h-8"
                            @click="addFilterPanel"
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

            const addFilterPanel = () => {
                ifAddTableFirst(activeInlineTab, item)
                addFilter(activeInlineTab, item)
            }
            const addAggregatePanel = () => {
                ifAddTableFirst(activeInlineTab, item)
                addAggregate(activeInlineTab, item)
            }
            const addGroupPanel = () => {
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
            return {
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
