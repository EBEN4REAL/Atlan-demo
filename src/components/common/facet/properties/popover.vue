<template>
    <a-popover overlay-class-name="propertiesPopover">
        <template #title>
            <div class="flex items-center justify-between gap-x-4">
                <div class="flex flex-col">
                    <span> {{ attribute.displayName }}</span>
                    <span class="text-xs text-gray-500">
                        {{ attribute.description }}</span
                    >
                </div>

                <span
                    class="text-xs cursor-pointer hover:text-red-500"
                    @click="handleClearAll"
                >
                    clear</span
                >
            </div>
        </template>
        <template #content>
            <div class="p-3">
                <div class="flex flex-col gap-y-4">
                    <Condition
                        v-for="(condition, index) in localValue"
                        :key="`${index}_${dirtyTimestamp}`"
                        :index="index"
                        :attribute="attribute"
                        :condition="condition"
                        @change="handleChangeCondition"
                        @clear="handleRemove(index)"
                    ></Condition>
                </div>
                <a-divider v-if="attribute.typeName !== 'boolean'" class="my-2">
                    <a-button size="small" @click="handleAdd">
                        <AtlanIcon
                            icon="Add"
                            class="h-3 text-gray-500"
                        ></AtlanIcon
                    ></a-button>
                </a-divider>
            </div>
        </template>

        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import { defineComponent, PropType, toRefs, ref, computed } from 'vue'
    import Condition from './condition.vue'

    export default defineComponent({
        name: 'TermPopover',
        components: { Condition },
        props: {
            attribute: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            modelValue: {
                type: Array,
                required: false,
                default() {
                    return []
                },
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { attribute } = toRefs(props)
            const { modelValue } = useVModels(props)
            const localValue = ref(modelValue.value)

            const dirtyTimestamp = ref(`dirty_${Date.now().toString()}`)

            const isActive = computed(() => {
                return !!filteredConditions.value.find((i) => i.value)
            })

            const handleAdd = () => {
                localValue.value.push({
                    operator: '',
                })
            }

            const handleRemove = (index) => {
                if (index > -1) {
                    localValue.value.splice(index, 1)
                }
                if (localValue.value.length === 0) {
                    handleAdd()
                }
                dirtyTimestamp.value = `dirty_${Date.now().toString()}`
                handleChangeCondition()
            }

            if (localValue.value.length === 0) {
                handleAdd()
            }

            const handleChangeCondition = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            const handleClearAll = () => {
                localValue.value = []
                handleAdd()

                dirtyTimestamp.value = `dirty_${Date.now().toString()}`

                handleChangeCondition()
            }

            return {
                attribute,
                localValue,
                handleAdd,
                handleClearAll,
                handleChangeCondition,
                handleRemove,
                dirtyTimestamp,
                isActive,
            }
        },
    })
</script>

<style lang="less">
    .propertiesPopover {
        .ant-popover-inner {
            width: 250px !important;
        }

        .ant-popover-inner-content {
            max-height: 200px;
            overflow-y: auto;
        }
    }
</style>
