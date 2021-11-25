<template>
    <a-input v-bind="componentProps" v-model:value="localValue"></a-input>
</template>

<script>
    import { defineComponent, toRefs, computed, ref, reactive } from 'vue'
    import { useVModels, debouncedWatch } from '@vueuse/core'
    // import { Form } from 'ant-design-vue'
    // const { useForm } = Form

    export default defineComponent({
        name: 'FormBuilder',
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
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { property } = toRefs(props)
            const componentProps = computed(() => property.value.ui)
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            debouncedWatch(
                localValue,
                () => {
                    modelValue.value = localValue.value
                    emit('change')
                },
                { debounce: 500 }
            )

            // watch(property.ui.hidden, () => {
            //     emit('change')
            // })

            return { property, componentProps, localValue }
        },
    })
</script>

<style lang="scss" scoped></style>
