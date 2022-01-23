<template>
    <div class="flex flex-col gap-y-1">
        <div
            v-if="
                attribute.typeName !== 'boolean' &&
                attribute?.subTypeName !== 'user'
            "
            class="flex items-center gap-x-1"
        >
            <a-select
                v-model:value="localCondition.operator"
                class="flex-1"
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
                class="w-full"
                :data-type="dataType"
                :multiple="
                    attribute?.options?.multiValueSelect === 'true' && false
                "
                :operator="localCondition.operator"
                @change="handleValueChange"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import { defineComponent, PropType, toRefs, ref, computed } from 'vue'

    import DynamicInput2 from '~/components/common/input/dynamicInput2.vue'
    import { operators } from '~/constant/filters/operators'

    export default defineComponent({
        name: 'PropertyCondition',
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
                if (attribute.value?.options?.primitiveType) {
                    if (
                        attribute.value?.options?.customType &&
                        ['url', 'users', 'groups'].includes(
                            attribute.value?.options?.primitiveType
                        )
                    ) {
                        if (
                            ['users', 'groups'].includes(
                                attribute.value?.options?.primitiveType
                            )
                        )
                            return 'string_user'
                        return 'string'
                    }
                    return attribute.value.options.primitiveType
                }

                const keys: string[] = []
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

            const dataType = computed(
                () =>
                    attribute.value?.options?.customType ||
                    attribute.value?.subTypeName ||
                    attribute.value?.options?.enumType ||
                    attribute.value?.options?.primitiveType ||
                    attribute.value?.typeName
            )

            const milisecondsAdjust = (timestamp, operator, dataType) => {
                let ms = 0
                if (['lessThanEqual', 'greaterThan'].includes(operator))
                    ms = 999
                return Math.floor(timestamp / 1000) * 1000 + ms
            }

            const handleOperatorChange = () => {
                condition.value.operand = attribute.value.name
                condition.value.operator = localCondition.value.operator
                if (['date', 'datetime'].includes(dataType.value.toLowerCase()))
                    condition.value.value = milisecondsAdjust(
                        condition.value.value,
                        condition.value.operator,
                        dataType.value
                    )
                emit('change')
            }

            const handleValueChange = () => {
                if (attribute.value?.typeName === 'boolean') {
                    condition.value.operator = 'boolean'
                    condition.value.value =
                        localCondition.value.value === 'true' ||
                        localCondition.value.value === true
                    condition.value.operand = attribute.value.name
                } else if (localCondition.value.value === null) {
                    delete condition.value.operand
                    delete condition.value.value
                } else {
                    condition.value.operand = attribute.value.name
                    if (
                        ['date', 'datetime'].includes(
                            dataType.value.toLowerCase()
                        )
                    )
                        condition.value.value = milisecondsAdjust(
                            condition.value.value,
                            condition.value.operator,
                            dataType.value
                        )
                    else if (condition.value.operand === 'sizeMegaBytes')
                        // to filter by mb
                        condition.value.value =
                            localCondition.value.value * 1024 * 1024
                    else condition.value.value = localCondition.value.value
                }
                console.log(condition.value.value)

                emit('change')
            }

            return {
                dataType,
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

<style lang="less" scoped></style>
