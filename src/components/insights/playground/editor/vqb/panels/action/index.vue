<template>
    <div v-if="computedItems?.length > 0">
        <a-dropdown :trigger="['hover']" :class="$style.dropdownn">
            <AtlanBtn
                class="flex-none px-3.5 py-1 border-none border-r border-gray-300"
                size="sm"
                color="secondary"
                @click.stop="() => {}"
                padding="compact"
            >
                <AtlanIcon icon="Add" class="-mx-1 text-gray"></AtlanIcon>
            </AtlanBtn>
            <template #overlay>
                <a-menu
                    @mouseover="handleMouseOver"
                    @mouseout="handleMouseOut"
                    style="width: 140px"
                >
                    <template
                        v-for="(item, index) in computedItems"
                        :key="item.label + index"
                    >
                        <a-menu-item
                            class="p-0"
                            @click.stop="() => handleAdd(item.id)"
                        >
                            <div class="flex items-center px-3.5 py-1.5">
                                <AtlanIcon
                                    :icon="item.icon"
                                    :class="item.class"
                                ></AtlanIcon>
                                <span>{{ item.label }}</span>
                            </div>
                        </a-menu-item>
                    </template>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ComputedRef, computed, inject, toRefs } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import { useVModels } from '@vueuse/core'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { generateUUID } from '~/utils/helper/generator'
    import { useUtils } from '~/components/insights/playground/editor/vqb/composables/useUtils'

    export default defineComponent({
        name: 'Columns',
        components: { AtlanBtn },
        emits: ['add'],
        props: {
            submenuHovered: {
                type: Boolean,
                reqruied: true,
                default: false,
            },
            containerHovered: {
                type: Boolean,
                reqruied: true,
                default: false,
            },
            panelInfo: {
                type: Object,
                reqruied: true,
            },
        },
        setup(props, { emit }) {
            const { submenuHovered, containerHovered } = useVModels(props)
            const { panelInfo } = toRefs(props)
            const { collapseAllPanelsExceptCurrent } = useUtils()
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
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
                        columsData: [],
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

                // emit('add', type)
            }

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

            const handleMouseOver = () => {
                if (!containerHovered.value) containerHovered.value = true
                if (!submenuHovered.value) submenuHovered.value = true
            }
            const handleMouseOut = () => {
                if (containerHovered.value) containerHovered.value = false
                if (submenuHovered.value) submenuHovered.value = false
            }
            return {
                computedItems,
                activeInlineTab,
                handleAdd,
                handleMouseOut,
                handleMouseOver,
            }
        },
    })
</script>
<style lang="less" module>
    .dropdownn {
        :global(.ant-dropdown-menu-item) {
            @apply p-0 !important;
        }
    }
</style>
