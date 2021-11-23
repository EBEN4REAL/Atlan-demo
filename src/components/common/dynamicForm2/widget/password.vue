<template>
    <a-form-item :label="property.ui?.label" v-if="!property.ui?.hidden">
        <a-input-password
            v-bind="componentProps"
            v-model:value="localValue"
        ></a-input-password>
    </a-form-item>
</template>

<script>
    import { defineComponent, toRefs, computed, ref } from 'vue'
    import { useVModels, debouncedWatch } from '@vueuse/core'

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
            return { property, componentProps, localValue }
        },
    })
</script>

<style lang="scss" scoped></style>
