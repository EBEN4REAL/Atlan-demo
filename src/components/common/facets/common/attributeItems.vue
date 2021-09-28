<template>
    <div class="">
        <a-popover
            v-model:visible="isVisible"
            title=""
            class="mb-2"
            placement="right"
            trigger="click"
        >
            <template #content>
                <template v-for="(o, y) in operatorsMap" :key="y">
                    <a-checkbox
                        v-model:checked="o.checked"
                        :value="o.value"
                        class="w-full"
                        :class="operatorsMap.length - 1 !== y ? 'mb-2' : ''"
                        style="min-width: 200px"
                        @change="handleCheckbox(o.value, o.checked)"
                    >
                        <span class="mb-0 ml-1 text-gray-500 truncated">
                            {{ o.label }}
                        </span>
                    </a-checkbox>
                    <div class="w-100">
                        <DynamicComponents
                            v-if="o.checked && operatorHasValue(o.value)"
                            :type="getDatatypeOfAttribute(a.typeName)"
                            :operator="o.value"
                            :default-value="applied[o.value] || ''"
                            @handleChange="handleInput"
                        />
                    </div>
                </template>
            </template>
            <div
                class="relative flex items-center h-8 pl-2 rounded cursor-pointer  hover:text-primary hover:bg-primary-light"
                :class="
                    isVisible
                        ? 'border rounded  border-primary bg-primary-light  text-primary'
                        : 'border rounded  border-transparent'
                "
            >
                <div
                    v-if="Object.keys(applied).length && !isVisible"
                    class="absolute w-2 h-2 rounded-full -left-1 bg-primary"
                    style="margin-bottom: 3px !important"
                ></div>
                <div class="flex items-center justify-between w-full">
                    <Tooltip
                        :tooltip-text="a?.options?.displayName || a.label"
                        classes="w-40"
                    />
                    <span class="mr-2"
                        ><AtlanIcon
                            class="pt-1 transform -rotate-90"
                            icon="ChevronDown"
                    /></span>
                </div>
            </div>
        </a-popover>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, onMounted, watch } from 'vue'
    import Tooltip from '@common/ellipsis/index.vue'
    import useBusinessMetadataHelper from '~/composables/businessMetadata/useBusinessMetadataHelper'
    import DynamicComponents from './dynamicComponents.vue'

    export default defineComponent({
        name: 'AttributeItems',
        components: { DynamicComponents, Tooltip },
        props: {
            a: {
                type: Object,
                required: true,
            },
            applied: {
                type: Object,
                required: true,
            },
            operators: {
                type: Array,
                required: true,
            },
        },
        emits: ['handleAttributeInput'],
        setup(props, { emit }) {
            const { getDatatypeOfAttribute, isEmptyObject } =
                useBusinessMetadataHelper()
            const isVisible = ref(false)
            const appliedValues = ref({})

            const operatorHasValue = (o: string) =>
                !['isNull', 'notNull'].includes(o)

            const operatorsMap = ref(
                JSON.parse(JSON.stringify(props.operators))
            )
            /**
             * @param {String} operator - operator of the checkbox
             * @desc - checks if filter is already applied & emit apply remove filter
             */
            const removeFilter = (operator: string) => {
                if (
                    appliedValues.value[operator]?.toString() ||
                    !operatorHasValue(operator)
                ) {
                    delete appliedValues.value[operator]
                    emit('handleAttributeInput', props.a, appliedValues.value)
                }
            }

            /**
             * @param {String} operator - operator of the checkbox
             * @param {String} inputValue - value of the dynamic input
             * @desc - if there is value  or operator needs no value then emit apply filter
             */
            const handleInput = (operator: string, inputValue: string = '') => {
                if (inputValue || !operatorHasValue(operator)) {
                    appliedValues.value[operator] = inputValue
                    emit('handleAttributeInput', props.a, appliedValues.value)
                } else removeFilter(operator)
            }

            /**
             * @param {String} operator - operator of the checkbox
             * @param {String} checked - checked || unchecked
             * @desc - if operator needs no value then apply filter directly,
             *         if operator has value and unchecking it then apply remove filter
             */
            const handleCheckbox = (operator: string, checked: boolean) => {
                if (!operatorHasValue(operator) && checked)
                    handleInput(operator)
                else if (!checked) removeFilter(operator)
            }

            const checkOperator = (operatorArray: string[]) => {
                operatorsMap.value.forEach(
                    (o: { value: string }, i: number) => {
                        operatorsMap.value[i].checked = operatorArray.includes(
                            o.value
                        )
                    }
                )
                appliedValues.value = { ...props.applied }
            }

            // check all applied attributes when mounted (using search and show less can unmount , loosing check state)
            onMounted(() => checkOperator(Object.keys(props.applied)))

            watch(
                () => props.applied,
                (n, _o) => {
                    // check all checkbox if not checked <> sync
                    //* trigger only when component is not triggering, i.e clear filter, or load default is triggering
                    if (isEmptyObject(n) && !isEmptyObject(_o))
                        checkOperator(Object.keys(n))
                },
                {
                    deep: true,
                }
            )

            return {
                operatorsMap,
                getDatatypeOfAttribute,
                DynamicComponents,
                handleInput,
                isVisible,
                removeFilter,
                handleCheckbox,
                operatorHasValue,
                appliedValues,
            }
        },
    })
</script>

<style scoped></style>
