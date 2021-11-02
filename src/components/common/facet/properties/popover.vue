<template>
    <a-popover
        overlayClassName="properties-popover"
        :arrowPointAtCenter="false"
    >
        <template #title>
            <div class="flex items-center justify-between gap-x-4">
                <span> {{ property.displayName }}</span>
                <span class="text-xs cursor-pointer" @click="handleClearAll">
                    Clear All</span
                >
            </div>
        </template>
        <template #content>
            <div class=""></div>
            <div class="flex flex-col gap-y-1">
                <template
                    v-for="(condition, index) in localConditions"
                    :key="index"
                >
                    <Condition
                        :index="index"
                        :property="property"
                        :condition="condition"
                        @clear="handleRemove(index)"
                    ></Condition>
                    <a-divider class="my-1">
                        <a-button
                            size="small"
                            @click="handleAdd"
                            v-if="
                                index === localConditions.length - 1 ||
                                localConditions.length === 0
                            "
                        >
                            <AtlanIcon
                                icon="Add"
                                class="h-3 text-gray-500"
                            ></AtlanIcon
                        ></a-button>
                    </a-divider>
                </template>
            </div>
        </template>

        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import { defineComponent, PropType, toRefs, ref } from 'vue'
    import Condition from './condition.vue'
    import AtlanIcon from '../../icon/atlanIcon.vue'

    export default defineComponent({
        name: 'TermPopover',
        components: { Condition, AtlanIcon },
        props: {
            property: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            conditions: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
        },
        setup(props, { emit }) {
            const { property } = toRefs(props)

            const { conditions } = useVModels(props)

            const localConditions = ref(conditions.value)

            const handleAdd = () => {
                localConditions.value.push({
                    operator: '',
                    value: '',
                })
            }

            const handleClearAll = () => {
                localConditions.value = []
                handleAdd()
            }

            const handleRemove = (index) => {
                if (index > -1) {
                    localConditions.value.splice(index, 1)
                }
                if (localConditions.value.length === 0) {
                    handleAdd()
                }
            }

            if (localConditions.value.length === 0) {
                handleAdd()
            }

            return {
                property,
                localConditions,
                handleAdd,
                handleClearAll,
                handleRemove,
            }
        },
    })
</script>

<style lang="less">
    .properties-popover {
        .ant-popover-title {
            @apply bg-gray-100;
        }
        .ant-popover-inner-content {
            max-height: 200px;
            overflow-y: auto;
        }
    }
</style>
