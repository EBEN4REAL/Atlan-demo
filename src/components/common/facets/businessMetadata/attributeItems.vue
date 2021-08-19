<template>
    <div>
        <a-popover
            v-model:visible="isVisible"
            title=""
            class="mb-2"
            placement="right"
            trigger="click"
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
                    >
                        <span class="mb-0 ml-1 text-gray-500 truncated">
                            {{ o.label }}
                        </span>
                    </a-checkbox>
                    <div class="w-100">
                        <DynamicComponents
                            v-if="o.checked"
                            :type="getDatatypeOfAttribute(a.typeName)"
                            :operator="o.value"
                            :default-value="applied[o.value] || ''"
                            @handleChange="handleInput"
                            @removeFilter="removeFilter"
                        />
                    </div>
                </template>
            </template>
            <div
                class="relative flex items-center h-8 pl-2 cursor-pointer  hover:text-primary"
                :class="
                    isVisible
                        ? 'border rounded  border-primary bg-primary-light  text-primary'
                        : ''
                "
            >
                <div
                    v-if="Object.keys(applied).length"
                    class="absolute w-2 h-2 mr-2 rounded-full  -left-2 bg-primary"
                ></div>
                <span> {{ a.options.displayName }}</span>
            </div>
        </a-popover>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, onMounted, toRefs, watch } from 'vue'
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
            applied: {
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

            const removeFilter = (operator: string) => {
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
            onMounted(() => {
                // ? set check applied checkbox
                if (props.applied.value)
                    Object.keys(props.applied.value).forEach((k) => {
                        operatorsMap.value[
                            getDatatypeOfAttribute(props.a.typeName)
                            // eslint-disable-next-line no-return-assign
                        ].find(
                            (o: { value: string }) => o.value === k
                        ).checked = true
                    })
            })

            watch(
                () => props.applied.value,
                (n, o) => {
                    // Object.keys(operatorsMap.value[
                    //         getDatatypeOfAttribute(props.a.typeName)
                    //     ]).forEach(k => {
                    //         if(!applied.value[k]) {
                    //             operatorsMap.value[
                    //         getDatatypeOfAttribute(props.a.typeName)
                    //     ]
                    //         }
                    //     })
                    // if (o && JSON.stringify(props.applied.value) === '{}') {
                    //     Object.keys(
                    //         operatorsMap.value[
                    //             getDatatypeOfAttribute(props.a.typeName)
                    //         ]
                    //     ).forEach((o) => {
                    //         operatorsMap.value[
                    //             getDatatypeOfAttribute(props.a.typeName)
                    //         ][o].checked = false
                    //     })
                    // }
                },
                {
                    deep: true,
                    immediate: true,
                }
            )
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
