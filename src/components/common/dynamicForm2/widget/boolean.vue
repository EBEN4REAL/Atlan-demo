<template>
    <CustomRadioButton
        v-bind="componentProps"
        :list="list"
        v-model="localValue"
    ></CustomRadioButton>
</template>

<script>
    import { defineComponent, toRefs, computed, ref } from 'vue'

    import CustomRadioButton from '@common/radio/customRadioButtonSingle.vue'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'FormBuilder',
        components: {
            CustomRadioButton,
        },
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
            const { modelValue } = useVModels(props, emit)

            const list = ref([
                {
                    id: 'true',
                    label: 'Yes',
                },
                {
                    id: 'false',
                    label: 'No',
                },
            ])
            const { property } = toRefs(props)
            const componentProps = computed(() => property.value.ui)

            const localValue = ref(modelValue.value)

            return { property, componentProps, list, localValue }
        },
    })
</script>

<style lang="scss" scoped></style>
