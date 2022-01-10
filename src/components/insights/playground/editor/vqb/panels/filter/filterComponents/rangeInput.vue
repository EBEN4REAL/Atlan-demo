<template>
    <div class="flex items-center">
        <a-input
            v-if="type === 'text'"
            v-model:value="firstvalue"
            placeholder="Enter  value"
            class="flex-1 w-full border-gray-300 rounded box-shadow focus:border-primary-focus"
            style="height: 32px !important"
            @change="(event) => onChange(event, 'first', type)"
        />
        <a-date-picker
            v-else-if="type === 'date'"
            v-model:value="firstvalue"
            class="flex-1 w-full border-gray-300 rounded box-shadow focus:border-primary-focus"
            @change="(event) => onChange(event, 'first', type)"
            :show-time="{ format: 'HH:mm' }"
            style="height: 32px !important"
            place
        />
        <a-input-number
            v-model:value="firstvalue"
            v-else-if="type === 'number'"
            placeholder="Enter numeric value"
            class="flex-1 w-full border-gray-300 rounded box-shadow focus:border-primary-focus"
            style="height: 32px !important"
            @change="(event) => onChange(event, 'first', type)"
        />
        <a-input
            v-if="type === 'text'"
            v-model:value="secondValue"
            placeholder="Enter value"
            class="flex-1 w-full ml-3 border-gray-300 rounded box-shadow focus:border-primary-focus"
            style="height: 32px !important"
            @change="(event) => onChange(event, 'second', type)"
        />
        <a-date-picker
            v-else-if="type === 'date'"
            v-model:value="secondValue"
            class="flex-1 w-full ml-3 border-gray-300 rounded box-shadow focus:border-primary-focus"
            style="height: 32px !important"
            :show-time="{ format: 'HH:mm' }"
            @change="(event) => onChange(event, 'second', type)"
        />
        <a-input-number
            v-else-if="type === 'number'"
            v-model:value="secondValue"
            placeholder="Enter numeric value"
            class="flex-1 w-full ml-3 border-gray-300 rounded box-shadow focus:border-primary-focus"
            style="height: 32px !important"
            @change="(event) => onChange(event, 'second', type)"
        />
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        watch,
        PropType,
        toRaw,
        inject,
        ComputedRef,
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    import dayjs, { Dayjs } from 'dayjs'
    import { useVQB } from '~/components/insights/playground/editor/vqb/composables/useVQB'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'

    export default defineComponent({
        name: 'Sub panel',
        components: {},
        props: {
            inputValue: {
                type: Array,
                required: true,
            },
            type: {
                type: String,
                required: true,
                default: 'text',
            },
        },

        setup(props, { emit }) {
            const { inputValue, type } = useVModels(props)
            const dateFormat = 'YYYY-MM-DD HH:mm:ss'

            const activeInlineTabKey = inject(
                'activeInlineTabKey'
            ) as ComputedRef<activeInlineTabInterface>

            const inlineTabs = inject(
                'inlineTabs'
            ) as ComputedRef<activeInlineTabInterface>

            const { updateVQB } = useVQB()

            let firstvalue = ref(undefined)
            let secondValue = ref(undefined)
            if (inputValue.value?.length > 0) {
                firstvalue.value = inputValue.value[0]
            }
            if (inputValue.value?.length > 0 && inputValue.value?.length == 2) {
                secondValue.value = inputValue.value[1]
            }

            if (
                type.value === 'date' &&
                inputValue.value &&
                inputValue.value?.length > 0
            ) {
                firstvalue.value = inputValue.value
                    ? dayjs(inputValue.value[0])
                    : undefined
                secondValue.value = inputValue.value
                    ? dayjs(inputValue.value[1])
                    : undefined
            }

            const onChange = (event, _pos, type) => {
                if (type === 'text') {
                    if (_pos === 'first') {
                        inputValue.value = [
                            event.target.value,
                            secondValue.value,
                        ]
                    } else {
                        inputValue.value = [
                            firstvalue.value,
                            event.target.value,
                        ]
                    }
                } else if (type === 'number') {
                    if (_pos === 'first') {
                        inputValue.value = [event, secondValue.value]
                    } else {
                        inputValue.value = [firstvalue.value, event]
                    }
                } else if (type === 'date') {
                    // event -> date in YYYY-MM-DD HH:mm:ss format in string
                    inputValue.value = [
                        firstvalue.value?.format(dateFormat),
                        secondValue.value?.format(dateFormat),
                    ]
                }
                // updateVQB(activeInlineTabKey, inlineTabs)
            }

            return {
                firstvalue,
                secondValue,
                onChange,
            }
        },
    })
</script>
<style lang="less" scoped>
    .box-shadow {
        box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.05);
    }
</style>
