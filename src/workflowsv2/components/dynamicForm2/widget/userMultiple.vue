<template>
    <UserMultiple
        v-bind="componentProps"
        v-model="localValue"
        @change="handleChange"
    ></UserMultiple>
</template>

<script>
    import { defineComponent, toRefs, computed, ref } from 'vue'

    import UserMultiple from '@common/select/userMultiple.vue'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'FormBuilder',
        components: {
            UserMultiple,
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
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { property } = toRefs(props)
            const { modelValue } = useVModels(props, emit)

            const localValue = ref(modelValue.value)

            const list = computed(() => {
                const temp = []

                property.value.enum.forEach((item, index) => {
                    temp.push({
                        id: item,
                        label: property.value.enumNames[index] || item,
                    })
                })
                return temp
            })

            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change', localValue.value)
            }

            const componentProps = computed(() => property.value.ui)
            return { property, componentProps, list, localValue, handleChange }
        },
    })
</script>

<style lang="scss" scoped></style>
