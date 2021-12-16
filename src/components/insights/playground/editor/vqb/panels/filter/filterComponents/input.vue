<template>
    <a-input
        v-if="type === 'text'"
        v-model:value="localeValue"
        placeholder="Enter Value"
        class="flex-1 w-full ml-6 border-gray-300 rounded box-shadow focus:border-primary-focus focus:border-2 focus:outline-none"
        style="height: 32px !important"
        @change="(event) => onChange(event, type)"
    />
    <a-input-number
        v-else-if="type === 'number'"
        v-model:value="localeValue"
        placeholder="Enter Numeric Value"
        class="flex-1 ml-6 border-gray-300 rounded box-shadow focus:border-primary-focus focus:border-2 focus:outline-none"
        style="height: 32px !important"
        @change="(event) => onChange(event, type)"
    />

    <a-date-picker
        v-else-if="type === 'date'"
        placeholder="Select Date"
        :show-time="{ format: 'HH:mm' }"
        v-model:value="localeValue"
        class="flex-1 ml-6 border-gray-300 rounded box-shadow focus:border-primary-focus focus:border-2 focus:outline-none"
        style="height: 32px !important"
        @change="(event) => onChange(event, type)"
    />
</template>

<script lang="ts">
    import {
        defineComponent,
        ref,
        watch,
        toRefs,
        Ref,
        PropType,
        computed,
        toRaw,
        onUnmounted,
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    import dayjs, { Dayjs } from 'dayjs'

    export default defineComponent({
        name: 'Sub panel',
        components: {},
        props: {
            type: {
                type: String,
                required: true,
                default: 'text',
            },
            inputValue: {
                type: String,
                required: true,
            },
            selectedFilter: {
                type: Object,
                required: true,
            },
        },

        setup(props, { emit }) {
            const { type, selectedFilter } = toRefs(props)
            const { inputValue } = useVModels(props)
            const dateFormat = 'YYYY-MM-DD HH:mm:ss'
            const localeValue: Ref<any> = ref(inputValue.value)

            watch(
                [selectedFilter],
                () => {
                    if (type.value === 'date') {
                        if (inputValue.value)
                            localeValue.value = dayjs(inputValue.value)
                        /* Else is IMP here otherwise it will break */ else
                            localeValue.value = ''
                    } else localeValue.value = inputValue.value
                },
                { immediate: true }
            )

            if (type.value === 'date' && inputValue.value)
                localeValue.value = dayjs(inputValue.value)

            const onChange = (event, type) => {
                if (type === 'text') {
                    inputValue.value = event.target.value
                } else if (type == 'date') {
                    // event -> date in YYYY-MM-DD HH:mm:ss format in string
                    inputValue.value = localeValue.value?.format(dateFormat)
                } else if (type == 'number') {
                    inputValue.value = event
                }
            }

            return {
                type,
                localeValue,
                onChange,
                inputValue,
            }
        },
    })
</script>
<style lang="less" scoped>
    .box-shadow {
        box-shadow: 0px 2px 5px 1px rgba(0, 0, 0, 0.05);
    }
</style>
