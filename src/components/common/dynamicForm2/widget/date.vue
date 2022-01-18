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

    // import locale from 'dayjs/locale/en'

    dayjs.locale('en')

    dayjs.extend(advancedFormat)

    export default defineComponent({
        props: {
            property: {
                required: false,
                type: Object,
                default: () => {},
            },
            modelValue: {
                required: false,
            },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { property } = toRefs(props)
            const formState = inject('formState')
            const componentProps = computed(() => property.value.ui)
            const { modelValue } = useVModels(props, emit)
            const localValue = ref()

            const format = computed(() => {
                if (componentProps.value.format) {
                    return componentProps.value.format
                }
                return 'YYYY-MM-DD'
            })
            const disabledDate = (current) => {
                return (
                    current &&
                    (current < minDate.value || current >= maxDate.value)
                )
            }

            const minDate = computed(() => {
                if (componentProps.value.min) {
                    return dayjs()
                        .utc()
                        .startOf('day')
                        .add(componentProps.value.min, 'day')
                }
                return dayjs()
            })

            const maxDate = computed(() => {
                if (componentProps.value.max) {
                    return dayjs()
                        .utc()
                        .endOf('day')
                        .add(componentProps.value.max, 'day')
                }
                return dayjs()
            })

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change')
            }

            if (
                parseInt(modelValue.value, 10) === 0 &&
                componentProps.value.min
            ) {
                localValue.value = minDate.value.unix().toString()
                handleChange()
            } else {
                localValue.value = modelValue.value.toString()
            }

            // Can not select days before today and today
            return {
                modelValue,
                property,
                componentProps,
                formState,
                format,
                disabledDate,
                minDate,
                maxDate,
                localValue,
                handleChange,
                // showTime,
                // disabledDate,
            }
        },
    })
</script>

<style lang="scss" scoped></style>
