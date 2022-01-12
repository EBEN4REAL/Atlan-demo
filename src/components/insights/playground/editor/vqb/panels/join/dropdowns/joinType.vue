<template>
    <div
        class=""
        tabindex="-1"
        @keyup="
            () => {
                isAreaFocused = false
            }
        "
    >
        <template v-for="(item, index) in dropdownOption" :key="item.key">
            <div
                class="relative flex items-center justify-between w-full px-4 cursor-pointer h-9 group-hover:bg-primary-light group"
                @click="(e) => onCheckChange(item, e)"
                :class="[
                    selectedJoinType.type === item.key
                        ? 'bg-primary-light'
                        : 'bg-white',
                    'hover:bg-primary-light',
                ]"
            >
                <div class="flex items-center">
                    <AtlanIcon :icon="item.icon" class="mr-1 text-primary" />
                    <span>{{ item.label }}</span>
                </div>
                <AtlanIcon
                    icon="Check"
                    class="absolute text-primary group-hover:opacity-0 right-4"
                    v-if="selectedJoinType.type === item.key"
                />

                <a-popover :trigger="'hover'" placement="right">
                    <AtlanIcon
                        icon="Info"
                        class="absolute transition opacity-0 cursor-pointer right-4 delay-50 text-primary group-hover:opacity-100"
                    />
                    <template #content>
                        <div class="infoPopover">
                            <AtlanIcon
                                :icon="`${item.icon}Info`"
                                style="width: 220px; height: 206px"
                            />
                            <div class="mt-3 text-sm font-bold text-gray-700">
                                {{
                                    item.key === 'left_join'
                                        ? 'The Left Join returns all records from the left table and the matching records from the right table'
                                        : item.key === 'inner_join'
                                        ? 'The Inner Join returns all common records from the left table and the right table'
                                        : item.key === 'right_join'
                                        ? 'The Right Join returns all records from the right table and the matching records from the left table'
                                        : 'The Outer Join returns all records from the left and the right table'
                                }}
                            </div>

                            <div
                                class="flex items-center mt-3 text-sm cursor-pointer text-primary"
                            >
                                Learn more
                                <AtlanIcon
                                    icon="ArrowRight"
                                    class="w-4 h-4 ml-1"
                                />
                            </div>
                        </div>
                    </template>
                </a-popover>
            </div>
        </template>
    </div>
</template>
<script lang="ts">
    import { computed, ComputedRef, inject, defineComponent, toRefs } from 'vue'
    import { useJoin } from '~/components/insights/playground/editor/vqb/composables/useJoin'
    import { useVQB } from '~/components/insights/playground/editor/vqb/composables/useVQB'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'Sub panel',
        components: {},
        props: {
            disabled: {
                type: Boolean,
                required: false,
                default: false,
            },
            selectedJoinType: {
                type: Object,
                required: true,
            },
            isAreaFocused: {
                type: Boolean,
                required: true,
                default: false,
            },
        },

        setup(props, { emit }) {
            const { disabled } = toRefs(props)
            const { isAreaFocused, selectedJoinType } = useVModels(props)
            const { updateVQB } = useVQB()
            const { list } = useJoin()
            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as ComputedRef<string>
            const inlineTabs = inject('inlineTabs') as ComputedRef<
                activeInlineTabInterface[]
            >

            const onCheckChange = (checked, event) => {
                selectedJoinType.value = {
                    type: checked.key,
                    name: checked.label,
                }
                updateVQB(activeInlineTabKey, inlineTabs)
                isAreaFocused.value = false
            }

            const dropdownOption = computed(() => {
                let data = list.map((ls) => ({
                    label: ls.name,
                    key: ls.type,
                    icon: ls.name.replace(' ', ''),
                }))

                return data
            })

            return {
                isAreaFocused,
                selectedJoinType,
                dropdownOption,
                onCheckChange,
                disabled,
            }
        },
    })
</script>
<style lang="less" scoped>
    .infoPopover {
        padding: 12px;

        width: 244px;
        // height: 350px;

        /* Grays/white */

        background: #ffffff;
        /* popover_drop_shadow */

        box-shadow: 0px 9px 32px rgba(0, 0, 0, 0.12);
        border-radius: 4px;
    }
</style>
