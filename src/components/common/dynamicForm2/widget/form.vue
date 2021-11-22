<template>
    <DynamicForm
        :config="property"
        layout="vertical"
        v-model="localValue"
    ></DynamicForm>
</template>

<script>
    import {
        defineComponent,
        toRefs,
        computed,
        ref,
        defineAsyncComponent,
    } from 'vue'
    import { useVModels } from '@vueuse/core'

    export default defineComponent({
        name: 'ObjectInput',
        components: {
            DynamicForm: defineAsyncComponent(() =>
                import('@/common/dynamicForm2/index.vue')
            ),
        },
        props: {
            property: {
                required: false,
                type: Object,
                default() {
                    return {}
                },
            },
            modelValue: {
                required: false,
                type: Object,
                default() {
                    return {}
                },
            },
        },
        setup(props, { emit }) {
            const { property } = toRefs(props)
            const componentProps = computed(() => property.value.ui)
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

            return { property, componentProps, localValue }
        },
    })
</script>

<style lang="scss" scoped></style>
