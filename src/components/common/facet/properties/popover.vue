<template>
    <a-popover
        overlayClassName="properties-popover"
        :arrowPointAtCenter="false"
    >
        <template #title>
            <div class="flex items-center justify-between gap-x-4">
                <div class="flex items-center">
                    <span class="mr-1"> {{ property.displayName }}</span>
                    <a-tooltip placement="top">
                        <template #content>
                            {{ property.description }}
                        </template>
                        <AtlanIcon icon="Info"></AtlanIcon>
                    </a-tooltip>
                </div>

                <span class="text-xs cursor-pointer" @click="handleClearAll">
                    Clear All</span
                >
            </div>
        </template>
        <template #content>
            <div class=""></div>
            <div class="flex flex-col gap-y-2">
                <Condition
                    v-for="(condition, index) in localConditions"
                    :key="`index${dirtyTimestamp}`"
                    :index="index"
                    :property="property"
                    :condition="condition"
                    @change="handleChangeCondition"
                    @clear="handleRemove(index)"
                ></Condition>
            </div>
            <a-divider v-if="property.typeName !== 'boolean'" class="my-1">
                <a-button size="small" @click="handleAdd">
                    <AtlanIcon icon="Add" class="h-3 text-gray-500"></AtlanIcon
                ></a-button>
            </a-divider>
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
        emits: ['update:Condition', 'change'],
        setup(props, { emit }) {
            const { property } = toRefs(props)

            const { conditions } = useVModels(props)

            const localConditions = ref(conditions.value)

            const dirtyTimestamp = ref(`dirty_${Date.now().toString()}`)

            const handleAdd = () => {
                localConditions.value.push({
                    operator: '',
                    value: '',
                })
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

            const handleChangeCondition = () => {
                conditions.value = localConditions.value
                emit('change')
            }

            const handleClearAll = () => {
                localConditions.value = []
                localConditions.value.push({
                    operator: '',
                })

                dirtyTimestamp.value = `dirty_${Date.now().toString()}`

                handleChangeCondition()
            }

            return {
                property,
                localConditions,
                handleAdd,
                handleClearAll,
                handleChangeCondition,
                handleRemove,
                dirtyTimestamp,
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
            width: 250px;
            overflow-y: auto;
        }
    }
</style>
