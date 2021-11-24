<template>
    <DynamicForm
        :config="property"
        v-model="localValue"
        layout="horizontal"
        labelAlign="left"
        :labelCol="{ span: 6 }"
        :wrapperCol="{ span: 18 }"
    ></DynamicForm>
</template>

<script>
    import {
        defineComponent,
        toRefs,
        computed,
        reactive,
        watch,
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
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { property } = toRefs(props)
            const componentProps = computed(() => property.value.ui)
            const { modelValue } = useVModels(props, emit)
            const localValue = reactive(modelValue.value)

            watch(localValue, () => {
                modelValue.value = localValue
                emit('change')
            })

            return { property, componentProps, localValue }
        },
    })
</script>

<style lang="scss" scoped></style>
