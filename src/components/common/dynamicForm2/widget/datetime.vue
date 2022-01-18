<template>
    <a-date-picker
        :showToday="false"
        v-model:value="localValue"
        mode="date"
        :showTime="false"
        :disabledDate="disabledDate"
        valueFormat="X"
        @change="handleChange"
    />
</template>

<script>
    import {
        defineComponent,
        toRefs,
        computed,
        ref,
        reactive,
        watch,
        inject,
    } from 'vue'
    import { useVModels, debouncedWatch } from '@vueuse/core'
    // import { Form } from 'ant-design-vue'
    // const { useForm } = Form

    import dayjs, { Dayjs } from 'dayjs'
    import utc from 'dayjs/plugin/utc'
    dayjs.extend(utc)

    import advancedFormat from 'dayjs/plugin/advancedFormat'
    dayjs.extend(advancedFormat)

    export default defineComponent({
        props: {
            property: {
                required: false,
                type: Object,
                default: () => {},
            },
            prefixImage: {
                required: false,
                type: String,
                default: () => '',
            },
            prefixText: {
                required: false,
                type: String,
                default: () => '',
            },
            modelValue: {
                required: false,
            },
        },
        setup(props, { emit }) {
            const { property } = toRefs(props)
            const formState = inject('formState')
            const componentProps = computed(() => property.value.ui)
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(null)
            if (modelValue.value) {
                if (
                    parseInt(modelValue.value, 10) === 0 &&
                    componentProps.value.minLastDay
                ) {
                    localValue.value = dayjs()
                        .subtract(componentProps.value.minLastDay, 'day')
                        .unix()
                }
            }
            const format = computed(() => {
                if (componentProps.value.format) {
                    return componentProps.value.format
                }
                return 'YYYY-MM-DD'
            })
            const disabledDate = (current) => {
                return current && current > dayjs.unix(1642377600)
                if (componentProps.value.min && componentProps.value.max) {
                    return (
                        current &&
                        current < dayjs.unix(componentProps.value.min) &&
                        current > dayjs.unix(componentProps.value.max)
                    )
                }
                if (componentProps.value.min) {
                    return (
                        current &&
                        current > dayjs.unix(componentProps.value.min)
                    )
                }
                if (componentProps.value.max) {
                    return current && current > componentProps.value.max
                }
                return false
            }

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change', localValue.value)
            }
            // Can not select days before today and today
            return {
                modelValue,
                property,
                componentProps,
                formState,
                format,
                disabledDate,
                // showTime,
                // disabledDate,
            }
        },
    })
</script>

<style lang="scss" scoped></style>
