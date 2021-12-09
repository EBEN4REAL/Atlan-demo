<template>
    <div>
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
                        v-for="(item, index) in items"
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
    import { defineComponent, ComputedRef, inject } from 'vue'
    import AtlanBtn from '@/UI/button.vue'
    import { useVModels } from '@vueuse/core'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { generateUUID } from '~/utils/helper/generator'

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
        },
        setup(props, { emit }) {
            const { submenuHovered, containerHovered } = useVModels(props)
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
                    }
                } else if (type === 'group') {
                    panel = {
                        id: uuid,
                        tableQualfiedName: undefined,
                        columns: [],
                        columsData: [],
                    }
                } else if (type === 'sort') {
                    panel = {
                        id: uuid,
                        column: {},
                        order: 'asc',
                    }
                }
                emit('add', type, panel)

                // emit('add', type)
            }
            const items = [
                {
                    id: 'aggregate',
                    icon: 'Trigger',
                    label: 'Aggregate',
                    class: 'mt-0.5 mr-2',
                },
                {
                    id: 'filter',
                    icon: 'Filter',
                    label: 'Filter',
                    class: 'mr-2',
                },
                {
                    id: 'sort',
                    icon: 'Sort',
                    label: 'Sort',
                    class: 'mr-2',
                },
                {
                    id: 'join',
                    icon: 'Union',
                    label: 'Join data',
                    class: 'mr-2',
                },
                {
                    id: 'group',
                    icon: 'BuilderGroup',
                    label: 'Group',
                    class: 'mr-2',
                },
            ]

            const handleMouseOver = () => {
                if (!containerHovered.value) containerHovered.value = true
                if (!submenuHovered.value) submenuHovered.value = true
            }
            const handleMouseOut = () => {
                if (containerHovered.value) containerHovered.value = false
                if (submenuHovered.value) submenuHovered.value = false
            }
            return {
                activeInlineTab,
                handleAdd,
                handleMouseOut,
                handleMouseOver,
                items,
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
