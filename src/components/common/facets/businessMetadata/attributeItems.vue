<template>
    <div>
        <a-popover
            title=""
            class="mb-2"
            placement="right"
            trigger="click"
            v-model:visible="isVisible"
        >
            <template #content>
                <template
                    v-for="(o, y) in operatorsMap[
                        getDatatypeOfAttribute(a.typeName)
                    ]"
                    :key="y"
                >
                    <a-checkbox
                        v-model:checked="o.checked"
                        :value="o.value"
                        class="w-full mb-2"
                        style="min-width: 200px"
                        @change="removeUncheck"
                    >
                        <span class="mb-0 ml-1 text-gray-500 truncated">
                            {{ o.label }}
                        </span>
                    </a-checkbox>
                    <div class="w-100">
                        <DynamicComponents
                            @handleChange="handleInput"
                            @removeFilter="removeFilter"
                            v-if="o.checked"
                            :type="getDatatypeOfAttribute(a.typeName)"
                            :operator="o.value"
                        />
                    </div>
                </template>
            </template>
            <div
                class="flex items-center h-8 pl-2 cursor-pointer  hover:text-primary"
                :class="
                    isVisible
                        ? 'border rounded  border-primary bg-primary-light  text-primary'
                        : ''
                "
            >
                <span>{{ a.options.displayName }}</span>
            </div>
        </a-popover>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'
    import { operatorsMap as map } from './constants'
    import useBusinessMetadataHelper from '~/composables/businessMetadata/useBusinessMetadataHelper'
    import DynamicComponents from './dynamicComponents.vue'

    export default defineComponent({
        name: 'AttributeItems',
        components: { DynamicComponents },
        props: {
            a: {
                type: Object,
                required: true,
            },
        },
        emits: ['handleAttributeInput'],
        setup(props, { emit }) {
            const { getDatatypeOfAttribute } = useBusinessMetadataHelper()
            const operatorsMap = ref({})
            const isVisible = ref(false)
            operatorsMap.value = JSON.parse(JSON.stringify(map))
            const appliedValues = ref({})

            const removeFilter = (operator) => {
                // ? check appliedValues
                if (appliedValues.value[operator]) {
                    delete appliedValues.value[operator]
                    emit('handleAttributeInput', props.a, appliedValues.value)
                }
            }
            const handleInput = (
                type: string,
                operator: string,
                inputValue: string
            ) => {
                // if (
                //     operatorsMap.value[type].find((o) => o.value === operator)
                //         .checked
                // )
                if (inputValue) {
                    appliedValues.value[operator] = inputValue
                    emit('handleAttributeInput', props.a, appliedValues.value)
                } else {
                    removeFilter(operator)
                }
            }
            return {
                operatorsMap,
                getDatatypeOfAttribute,
                DynamicComponents,
                handleInput,
                isVisible,
                removeFilter,
            }
        },
    })
</script>

<style scoped></style>
