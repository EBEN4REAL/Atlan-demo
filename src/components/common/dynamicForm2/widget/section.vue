<template>
    <a-form-item :label="property.ui?.label" v-if="!property.ui?.hidden">
        <DynamicForm
            :config="property"
            v-model="localValue"
            class="p-4 border rounded"
            layout="vertical"
        ></DynamicForm>
    </a-form-item>
</template>

<script>
    import {
        defineComponent,
        toRefs,
        computed,
        ref,
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
        setup(props, { emit }) {
            const activeKey = ref(['1'])
            const { property } = toRefs(props)
            const componentProps = computed(() => property.value.ui)
            const { modelValue } = useVModels(props, emit)
            const localValue = reactive(modelValue.value)

            watch(localValue, () => {
                modelValue.value = localValue
                emit('change')
            })

            return { property, componentProps, localValue, activeKey }
        },
    })
</script>

<style lang="less" module>
    .formCollapse {
        :global(.ant-collapse-header) {
            @apply px-0 py-1 !important;
        }

        :global(.ant-collapse-content-box) {
            @apply px-0 py-1 !important;
        }
    }
</style>
