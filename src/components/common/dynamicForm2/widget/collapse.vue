<template>
    <a-collapse
        ghost
        v-model:activeKey="activeKey"
        :class="$style.formCollapse"
    >
        <a-collapse-panel key="1" :show-arrow="false">
            <template #header>
                <div class="flex items-center hover:text-primary">
                    <AtlanIcon
                        icon="ChevronDown"
                        class="mr-2 text-gray-500 transition-transform duration-300 transform  hover:text-primary"
                        :class="
                            activeKey.includes('1') ? 'rotate-0' : '-rotate-90'
                        "
                    />
                    <div class="text-gray-500 hover:text-primary">
                        {{ property.ui?.header }}
                    </div>
                </div>
            </template>
            <DynamicForm
                :config="property"
                layout="vertical"
                v-model="localValue"
            ></DynamicForm>
        </a-collapse-panel>
    </a-collapse>
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
            const activeKey = ref(['1'])
            const { property } = toRefs(props)
            const componentProps = computed(() => property.value.ui)
            const { modelValue } = useVModels(props, emit)
            const localValue = ref(modelValue.value)

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
