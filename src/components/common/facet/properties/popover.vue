<template>
    <a-popover
        overlay-class-name="propertiesPopover"
        :destroyTooltipOnHide="true"
        @visible-change="visibleChange"
    >
        <template #title> </template>
        <template #content>
            <div class="flex flex-col px-3 py-2 bg-gray-100 gap-x-4">
                <div class="flex justify-between">
                    <Truncate :tooltipText="attribute.displayName" :rows="2" />

                    <div
                        class="text-xs cursor-pointer hover:text-red-500"
                        @click="handleClearAll"
                    >
                        clear
                    </div>
                </div>

                <span class="text-xs text-gray-500">
                    {{
                        attribute.description || attribute.options?.description
                    }}</span
                >
            </div>
            <div class="p-3">
                <div class="flex flex-col gap-y-4">
                    <template
                        v-for="(condition, index) in localValue"
                        :key="`${index}_${dirtyTimestamp}`"
                    >
                        <Condition
                            :index="index"
                            :attribute="attribute"
                            :condition="condition"
                            :totalConditions="localValue.length"
                            @change="handleChangeCondition(condition)"
                            @clear="handleRemove(index)"
                        />
                        <div
                            v-if="
                                index !== localValue.length - 1 &&
                                attribute?.subTypeName !== 'announcement' &&
                                attribute?.subTypeName !== 'user'
                            "
                            class="flex text-gray-500"
                        >
                            AND
                            <div class="w-full h-0 my-auto ml-2 border-b"></div>
                        </div>
                    </template>
                </div>

                <a-divider
                    v-if="
                        attribute.typeName !== 'boolean' &&
                        attribute?.subTypeName !== 'announcement' &&
                        attribute?.subTypeName !== 'user'
                    "
                    class="my-2"
                >
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
    import { defineComponent, toRefs, ref, computed } from 'vue'
    import Condition from './condition.vue'
    import Truncate from '@/common/ellipsis/index.vue'

    export default defineComponent({
        name: 'PropertiesPopover',
        components: { Condition, Truncate },
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
        emits: ['change', 'update:modelValue', 'visibilityChange'],
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

            const handleChangeCondition = (condition) => {
                modelValue.value = localValue.value
                emit('change', attribute, condition, localValue.value)
            }

            const handleClearAll = () => {
                localValue.value = []
                handleAdd()

                dirtyTimestamp.value = `dirty_${Date.now().toString()}`

                handleChangeCondition()
            }

            const visibleChange = visible => {
                emit("visibilityChange" , visible)
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
                visibleChange
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
