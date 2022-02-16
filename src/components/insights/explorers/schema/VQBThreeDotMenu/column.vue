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
    import { defineComponent, PropType, toRefs, ComputedRef, inject } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { addFilter, addAggregate, addGroup } from './composables/usepanels'
    export default defineComponent({
        components: {},
        props: {
            item: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { item } = toRefs(props)
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const addFilterPanel = () => {
                addFilter(activeInlineTab, item)
            }
            const addAggregatePanel = () => {
                addAggregate(activeInlineTab, item)
            }
            const addGroupPanel = () => {
                addGroup(activeInlineTab, item)
            }
            const isTablePresentInVQBContext = () => {
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
