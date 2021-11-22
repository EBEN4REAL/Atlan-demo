<template>
    <SQLSelect
        v-bind="componentProps"
        :list="list"
        v-model="localValue"
        @change="handleChange"
    ></SQLSelect>
</template>

<script>
    import { defineComponent, toRefs, computed, ref } from 'vue'

    import SQLSelect from '@common/select/sql.vue'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'FormBuilder',
        components: {
            SQLSelect,
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
