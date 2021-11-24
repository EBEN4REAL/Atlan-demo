<template>
    <FormItem :properties="list"></FormItem>
</template>

<script>
    import {
        defineComponent,
        toRefs,
        computed,
        reactive,
        watch,
        defineAsyncComponent,
        ref,
    } from 'vue'
    import { useVModels } from '@vueuse/core'
    // import DynamicForm from '@/common/dynamicForm2/index.vue'

    export default defineComponent({
        name: 'CredentialInput',
        components: {
            FormItem: defineAsyncComponent(() =>
                import('@/common/dynamicForm2/formItem.vue')
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
            const { property, configMap } = toRefs(props)
            const componentProps = computed(() => property.value.ui)
            const { modelValue } = useVModels(props, emit)
            const localValue = reactive(modelValue.value)

            watch(localValue, () => {
                modelValue.value = localValue
                emit('change')
            })

            const list = computed(() => {
                const temp = []
                console.log(property.value.properties)
                Object.keys(property.value?.properties).forEach((key) => {
                    temp.push({
                        id: `${key}`,
                        ...property.value?.properties[key],
                    })
                })
                return temp
            })

            return {
                property,
                componentProps,
                localValue,
                configMap,
                modelValue,
                list,
            }
        },
    })
</script>

<style lang="scss" scoped></style>
