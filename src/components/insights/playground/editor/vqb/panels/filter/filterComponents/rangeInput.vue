<template>
    <div class="flex items-center">
        <a-input
            v-if="type === 'text'"
            v-model:value="firstvalue"
            placeholder="Enter  value"
            class="flex-1 w-full border-gray-300 rounded box-shadow focus:border-primary-focus"
            style="height: 32px !important"
            @change="(event) => onChange(event, 'first', type)"
        >
            <template #suffix>
                <CustomVariableTrigger />
            </template>
        </a-input>
        <div v-else-if="type === 'date'" class="relative flex flex-1">
            <a-date-picker
                v-model:value="firstvalue"
                class="flex-1 w-full border-gray-300 rounded box-shadow focus:border-primary-focus"
                @change="(event) => onChange(event, 'first', type)"
                :show-time="{ format: 'HH:mm' }"
                style="height: 32px !important"
                place
            >
                <template #suffixIcon>
                    <CustomVariableTrigger />
                </template>
            </a-date-picker>
            <div class="absolute right-2.5 top-1">
                <CustomVariableTrigger />
            </div>
        </div>
        <a-input
            v-model:value="firstvalue"
            v-else-if="type === 'number'"
            placeholder="Enter numeric value"
            class="flex-1 w-full border-gray-300 rounded box-shadow focus:border-primary-focus"
            style="height: 32px !important"
            @change="(event) => onChange(event, 'first', type)"
            type="number"
            @keypress="isNumberKey(event)"
        >
            <template #suffix>
                <CustomVariableTrigger />
            </template>
        </a-input>
        <a-input
            v-if="type === 'text'"
            v-model:value="secondValue"
            placeholder="Enter value"
            class="flex-1 w-full ml-3 border-gray-300 rounded box-shadow focus:border-primary-focus"
            style="height: 32px !important"
            @change="(event) => onChange(event, 'second', type)"
        >
            <template #suffix>
                <CustomVariableTrigger />
            </template>
        </a-input>
        <div v-else-if="type === 'date'" class="relative flex flex-1">
            <a-date-picker
                v-model:value="secondValue"
                class="flex-1 w-full ml-3 border-gray-300 rounded box-shadow focus:border-primary-focus"
                style="height: 32px !important"
                :show-time="{ format: 'HH:mm' }"
                @change="(event) => onChange(event, 'second', type)"
            >
                <template #suffixIcon>
                    <CustomVariableTrigger />
                </template>
            </a-date-picker>
            <div class="absolute right-2.5 top-1">
                <CustomVariableTrigger />
            </div>
        </div>
        <a-input
            v-else-if="type === 'number'"
            v-model:value="secondValue"
            placeholder="Enter numeric value"
            class="flex-1 w-full ml-3 border-gray-300 rounded box-shadow focus:border-primary-focus"
            style="height: 32px !important"
            @change="(event) => onChange(event, 'second', type)"
            type="number"
            @keypress="isNumberKey(event)"
        >
            <template #suffix>
                <CustomVariableTrigger />
            </template>
        </a-input>
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref, watch, PropType, toRaw } from 'vue'
    import { useVModels } from '@vueuse/core'
    import dayjs, { Dayjs } from 'dayjs'
    import CustomVariableTrigger from './customVariableTrigger.vue'

    export default defineComponent({
        name: 'Sub panel',
        components: { CustomVariableTrigger },
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
            }
            function isNumberKey(evt) {
                const charCode = evt.which ? evt.which : evt.keyCode
                if (charCode > 31 && (charCode < 48 || charCode > 57))
                    return false
                return true
            }

            return {
                isNumberKey,
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
