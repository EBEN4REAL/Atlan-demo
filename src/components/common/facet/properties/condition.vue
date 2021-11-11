<template>
    <div :key="index" class="flex flex-col gap-y-1">
        <div
            v-if="property.typeName !== 'boolean'"
            class="flex items-center gap-x-1"
        >
            <a-select
                v-model:value="localCondition.operator"
                class="flex-1"
                @change="handleOperatorChange"
            >
                <a-select-option
                    v-for="item in defaultOperator"
                    :key="item.id"
                    :value="item.id"
                >
                    {{ item?.label }}
                </a-select-option>
            </a-select>
            <a-button size="small">
                <AtlanIcon
                    icon="Trash"
                    class="h-3 text-gray-500"
                    @click="handleRemove"
                ></AtlanIcon
            ></a-button>
        </div>

        <div v-if="!['isNull', 'isNotNull'].includes(localCondition.operator)">
            <DynamicInput
                v-model="localCondition.value"
                :data-type="property.typeName"
                @change="handleValueChange"
            ></DynamicInput>
        </div>
    </div>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import { defineComponent, PropType, toRefs, ref } from 'vue'

    import DynamicInput from '~/components/common/input/dynamicInput.vue'
    import { operators } from '~/constant/filters/operators'

    export default defineComponent({
        name: 'TermPopover',
        components: { DynamicInput },
        props: {
            property: {
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
            index: {
                required: false,
            },
        },
        emits: ['clear', 'update:Condition', 'change'],
        setup(props, { emit }) {
            const { condition } = useVModels(props)

            const localCondition = ref(condition.value)

            const { property } = toRefs(props)

            const defaultOperator = ref(operators[property.value?.typeName])
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
                condition.value.operand = property.value.name
                condition.value.operator = localCondition.value.operator
                emit('change')
            }

            const handleValueChange = () => {
                if (property.value.typeName === 'boolean') {
                    condition.value.operator = 'boolean'
                }

                condition.value.operand = property.value.name
                condition.value.value = localCondition.value.value
                emit('change')
            }

            return {
                localCondition,
                handleRemove,
                localOperator,
                defaultOperator,
                handleOperatorChange,
                handleValueChange,
            }
        },
    })
</script>

<style lang="less" module></style>
