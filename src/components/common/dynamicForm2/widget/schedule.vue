<template>
    <Timezone v-model="localValue" @change="handleChange"></Timezone>
</template>

<script>
    import { defineComponent, toRefs, computed, ref } from 'vue'

    import Timezone from '@common/select/timezone.vue'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'FormBuilder',
        components: {
            Timezone,
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
            const handleChange = () => {
                modelValue.value = localValue.value
                emit('change', localValue.value)
            }
            return { localValue, handleChange }
        },
    })
</script>

<style lang="scss" scoped></style>
