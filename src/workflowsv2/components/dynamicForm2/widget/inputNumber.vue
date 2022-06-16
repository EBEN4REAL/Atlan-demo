<template>
    <a-input-number
        v-bind="componentProps"
        v-model:value="localValue"
        class="w-full"
    ></a-input-number>
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
            return { property, componentProps, localValue, modelValue }
        },
    })
</script>

<style lang="scss" scoped></style>
