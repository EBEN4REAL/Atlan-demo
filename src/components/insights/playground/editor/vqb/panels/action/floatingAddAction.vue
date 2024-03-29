<template>
    <div
        v-if="computedItems?.length > 0 && isContextTableSelected"
        class="flex items-center bg-white group-hover:border-white float-btn-container"
    >
        <div
            class="relative flex items-center group-hover: justify-center p-2.5 rounded-full cursor-pointer bg-white"
        >
            <AtlanIcon class="w-3 h-3" icon="PlusWhite"></AtlanIcon>
            <div
                class="absolute dead-center flex items-center justify-center p-2.5 rounded-full cursor-pointer bg-primary"
            >
                <AtlanIcon
                    class="w-3 h-3 plus-button"
                    icon="PlusWhite"
                ></AtlanIcon>
            </div>
        </div>
        <div class="ml-2 gap-x-1 action-buttons-container">
            <template v-for="item in computedItems" :key="item.label">
                <div
                    class="flex items-center px-1.5 rounded-lg cursor-pointer hover:bg-primary-light hover:text-primary panel-action"
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
    import { useUtils as useAddPanelsUtils } from './useUtils'
    import useAddEvent from '~/composables/eventTracking/useAddEvent'

    export default defineComponent({
        name: 'FloatingAddAction',
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
            const { syncSortAggregateAndGroupPanel } = useSort()
            const { getInitialPanelStructure } = useAddPanelsUtils()

            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const isContextTableSelected = computed(() => {
                const selectPanel =
                    activeInlineTab.value.playground.vqb.panels.find(
                        (panel) => panel.id.toLowerCase() === 'columns'
                    )
                return selectPanel?.subpanels[0]?.tableQualfiedName
                    ? true
                    : false
            })

            const computedItems = computed(() => {
                let _items: any = []

                const join = activeInlineTab.value.playground.vqb.panels.find(
                    (panel) => panel.id.toLowerCase() === 'join'
                )
                if (!join) {
                    _items.push({
                        id: 'join',
                        icon: 'JoinHeader',
                        label: 'Join data',
                    })
                }
                const filter = activeInlineTab.value.playground.vqb.panels.find(
                    (panel) => panel.id.toLowerCase() === 'filter'
                )
                if (!filter) {
                    _items.push({
                        id: 'filter',
                        icon: 'FilterFunnel',
                        label: 'Filter',
                        class: '-mt-0.5',
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
                const panel = getInitialPanelStructure(type)
                collapseAllPanelsExceptCurrent(panelInfo.value, activeInlineTab)
                emit('add', type, panel)
                syncSortAggregateAndGroupPanel(activeInlineTab)
                // useAddEvent('insights', 'query', 'panelAdd', {
                //     panel_type: type,
                //     panel_source: 'action menu',
                // })
            }
            return {
                isContextTableSelected,
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
        height: 48px;
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
            transform-origin: center;
            // &:hover {
            //     transform: rotate(135deg);
            // }
        }
        .dead-center {
            transform: translate(-50%, -50%);
            top: 50%;
            left: 50%;
        }
        padding: 2px 8.5px;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
    }
</style>
