<template>
    <div
        v-if="computedItems?.length > 0"
        class="flex items-center px-3 py-2 bg-white group-hover:border-white float-btn-container"
    >
        <div
            class="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer plus-button bg-primary"
        >
            <AtlanIcon class="w-3 h-3" icon="PlusWhite"></AtlanIcon>
        </div>
        <div class="ml-2 gap-x-1 action-buttons-container">
            <template v-for="item in computedItems" :key="item.label">
                <div
                    class="flex items-center px-2 rounded-lg cursor-pointer hover:bg-primary-light hover:text-primary panel-action"
                    @click="() => handleAdd(item.id)"
                >
                    <AtlanIcon
                        :icon="item.icon"
                        class="mr-1"
                        :class="['text-sm', item.class]"
                    />
                    <span>{{ item.label }}</span>
                </div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs, ComputedRef, computed, inject } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import { generateUUID } from '~/utils/helper/generator'
    import { useVModels } from '@vueuse/core'

    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useSort } from '~/components/insights/playground/editor/vqb/composables/useSort'

    export default defineComponent({
        name: 'FloatingAddAction',
        emits: ['add'],
        props: {
            // panelInfo: {
            //     type: Object,
            //     reqruied: true,
            // }
        },
        setup(props, { emit }) {
            // const { panelInfo } = toRefs(props)
            const { collapseAllPanelsExceptCurrent } = useUtils()
            const { syncSortAggregateAndGroupPanel } = useSort()
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>

            const computedItems = computed(() => {
                let _items: any = []

                const aggregatePanel =
                    activeInlineTab.value.playground.vqb.panels.find(
                        (panel) => panel.id.toLowerCase() === 'aggregate'
                    )

                if (!aggregatePanel) {
                    _items.push({
                        id: 'aggregate',
                        icon: 'Trigger',
                        label: 'Aggregate',
                    })
                }

                const join = activeInlineTab.value.playground.vqb.panels.find(
                    (panel) => panel.id.toLowerCase() === 'join'
                )
                if (!join) {
                    _items.push({
                        id: 'join',
                        icon: 'Union',
                        label: 'Join data',
                    })
                }
                const filter = activeInlineTab.value.playground.vqb.panels.find(
                    (panel) => panel.id.toLowerCase() === 'filter'
                )
                if (!filter) {
                    _items.push({
                        id: 'filter',
                        icon: 'Filter',
                        label: 'Filter',
                    })
                }

                const groupPanel =
                    activeInlineTab.value.playground.vqb.panels.find(
                        (panel) => panel.id.toLowerCase() === 'group'
                    )
                if (!groupPanel) {
                    _items.push({
                        id: 'group',
                        icon: 'BuilderGroup',
                        label: 'Group',
                    })
                }
                const sortPanel =
                    activeInlineTab.value.playground.vqb.panels.find(
                        (panel) => panel.id.toLowerCase() === 'sort'
                    )
                if (!sortPanel) {
                    _items.push({
                        id: 'sort',
                        icon: 'Sort',
                        label: 'Sort',
                    })
                }

                return _items
            })

            const handleAdd = (type) => {
                let panel = {}
                let uuid = generateUUID()

                if (type === 'aggregate') {
                    panel = {
                        id: uuid,
                        column: {},
                        aggregators: [],
                        expand: true,
                    }
                } else if (type === 'group') {
                    panel = {
                        id: uuid,
                        tableQualfiedName: undefined,
                        columns: [],
                        columnsData: [],
                        expand: true,
                    }
                } else if (type === 'sort') {
                    panel = {
                        id: uuid,
                        column: {},
                        order: 'asc',
                        expand: true,
                        active: false,
                        aggregateORGroupColumn: {},
                    }
                } else if (type === 'filter') {
                    panel = {
                        id: uuid,
                        column: {},
                        filter: {
                            filterType: 'and',
                        },
                        expand: true,
                    }
                } else if (type === 'join') {
                    panel = {
                        id: uuid,
                        columnsDataLeft: {},
                        columnsDataRight: {},
                        joinType: {
                            type: 'inner_join',
                            name: 'Inner Join',
                        },
                        expand: true,
                    }
                }
                // collapseAllPanelsExceptCurrent(panelInfo.value, activeInlineTab)
                emit('add', type, panel)
                syncSortAggregateAndGroupPanel(activeInlineTab)
            }
            return {
                computedItems,
                handleAdd,
            }
        },
        components: { AtlanBtn },
    })
</script>
<style lang="less" scoped>
    .float-btn-container {
        width: fit-content;
        border-radius: 50px;
        max-width: 56px;
        height: 49px;
        // transition: max-width 1s ease;
        &:hover {
            max-width: 100% !important;
            .action-buttons-container {
                display: flex;
            }
            .plus-button {
                transform: rotate(135deg);
            }
        }
        .action-buttons-container {
            display: none;
        }
        .panel-action {
            padding-top: 6px;
            padding-bottom: 6px;
        }
        .plus-button {
            transform: rotate(90deg);
            transition: all 250ms ease-out;
            // &:hover {
            //     transform: rotate(135deg);
            // }
        }
    }
</style>
