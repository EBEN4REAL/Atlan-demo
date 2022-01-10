<template>
    <div
        v-if="computedItems?.length > 0"
        class="flex items-center w-full p-3 bg-gray-100 border-t border-gray-300 rounded-b group-hover:border-white"
    >
        <template v-for="item in computedItems" :key="item.label">
            <AtlanBtn
                class="flex items-center px-4 mr-3 text-gray-700 bg-white border border-gray-300 rounded"
                size="sm"
                color="secondary"
                padding="compact"
                @click.stop="() => handleAdd(item.id)"
            >
                <template #prefix>
                    <AtlanIcon
                        :icon="item.icon"
                        :class="['text-sm', item.class]"
                    />
                </template>
                <span>{{ item.label }}</span>
            </AtlanBtn>
        </template>
    </div>
</template>

<script lang="ts">
    import { defineComponent, toRefs, ComputedRef, computed, inject } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import { generateUUID } from '~/utils/helper/generator'
    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    export default defineComponent({
        name: 'Footer Panels',
        emits: ['add'],
        props: {
            panelInfo: {
                type: Object,
                reqruied: true,
            },
        },
        setup(props, { emit }) {
            const { panelInfo } = toRefs(props)
            const { collapseAllPanelsExceptCurrent } = useUtils()
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
                        class: 'mt-0.5 mr-2',
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
                        class: 'mr-2',
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
                        class: 'mr-2',
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
                        class: 'mr-2',
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
                        class: 'mr-2',
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
                collapseAllPanelsExceptCurrent(panelInfo.value, activeInlineTab)
                emit('add', type, panel)
            }
            return {
                computedItems,
                handleAdd,
            }
        },
        components: { AtlanBtn },
    })
</script>
<style lang="less" scoped></style>
