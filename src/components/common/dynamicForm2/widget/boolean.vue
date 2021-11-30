<template>
    <CustomRadioButton
        :list="list"
        v-model="localValue"
        @change="handleChange"
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

            const list = computed(() => {
                const temp = []
                temp.push({
                    id: 'true',
                    label: 'Yes',
                })
                temp.push({
                    id: 'false',
                    label: 'No',
                })
                return temp
            })

            const { property } = toRefs(props)
            const componentProps = computed(() => property.value.ui)

            const localValue = ref(modelValue.value)

            const handleChange = () => {
                console.log('change')
                modelValue.value = localValue.value
                emit('change', localValue.value)
            }
            return { property, componentProps, list, localValue, handleChange }
        },
    })
</script>

<style lang="scss" scoped></style>
