<template>
    <div class="flex flex-col gap-y-1">
        <div
            class="flex items-center gap-x-1"
            v-if="attribute.typeName !== 'boolean'"
        >
            <a-select
                v-model:value="localCondition.operator"
                class="flex-1 selector"
                @change="handleOperatorChange"
            >
                <template #suffixIcon>
                    <AtlanIcon icon="CaretDown" />
                </template>
                <a-select-option
                    v-for="item in defaultOperator"
                    :key="item.id"
                    :value="item.id"
                >
                    {{ item?.label }}
                </a-select-option>
            </a-select>
            <div class="p-1 cursor-pointer">
                <AtlanIcon
                    icon="Trash"
                    class="h-3 text-gray-500 hover:text-red-700"
                    @click="handleRemove"
                >
                </AtlanIcon>
            </div>
        </div>

        <div v-if="!['isNull', 'isNotNull'].includes(localCondition.operator)">
            <DynamicInput2
                v-model="localCondition.value"
                :data-type="
                    attribute.options?.customType ||
                    attribute.subTypeName ||
                    attribute.typeName
                "
                @change="handleValueChange"
            ></DynamicInput2>
        </div>
    </div>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import { defineComponent, PropType, toRefs, ref, computed } from 'vue'

    import DynamicInput2 from '~/components/common/input/dynamicInput2.vue'
    import { operators } from '~/constant/filters/operators'

    export default defineComponent({
        name: 'TermPopover',
        components: { DynamicInput2 },
        props: {
            attribute: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
            condition: {
                type: Object,
                required: false,
                default() {
                    return {}
                },
            },
        },
        emits: ['clear', 'update:Condition', 'change'],
        setup(props, { emit }) {
            const { condition } = useVModels(props)

            const localCondition = ref(condition.value)

            const { attribute } = toRefs(props)

            const operatorDataType = computed(() => {
                let keys = []
                keys.push(attribute.value?.typeName)

                if (attribute.value?.subTypeName) {
                    keys.push(attribute.value?.subTypeName)
                }

                if (attribute.value.isMandatory) {
                    keys.push('mandatory')
                }
                return keys.join('_')
            })

            const defaultOperator = ref(operators[operatorDataType.value])
            const localOperator = ref(condition.operator)

            if (!localCondition.value.operator) {
                if (defaultOperator.value?.length > 0) {
                    localCondition.value.operator = defaultOperator.value[0].id
                }
            }

            const handleRemove = () => {
                emit('clear')
            }

            const handleOperatorChange = () => {
                condition.value.operand = attribute.value.name
                condition.value.operator = localCondition.value.operator
                emit('change')
            }

            const handleValueChange = () => {
                if (attribute.value?.typeName === 'boolean') {
                    condition.value.operator = 'boolean'
                    condition.value.value =
                        localCondition.value.value === 'true'
                    condition.value.operand = attribute.value.name
                } else {
                    condition.value.operand = attribute.value.name
                    condition.value.value = localCondition.value.value
                }

                emit('change')
            }

            return {
                localCondition,
                handleRemove,
                localOperator,
                defaultOperator,
                handleOperatorChange,
                handleValueChange,
                operatorDataType,
                attribute,
            }
        },
    })
</script>

<style lang="less" scoped>
    .selector:deep(.ant-select-arrow) {
        @apply flex items-center;
    }
</style>
