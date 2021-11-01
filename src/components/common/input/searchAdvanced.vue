<template>
    <a-input
        ref="searchBar"
        :placeholder="placeholder"
        v-model:value="localValue"
        type="text"
        :class="$style.transparent"
        @change="handleChange"
        class="px-0 text-sm text-gray-500 bg-transparent border-none  focus:outline-none"
    >
        <template #prefix>
            <AtlanIcon icon="Search" class="flex-none text-gray-500" />
        </template>

        <template #suffix>
            <slot name="tab" />
            <slot name="filter" />
            <a-popover
                v-if="$slots.postFilter"
                trigger="click"
                placement="bottomRight"
            >
                <template #content>
                    <slot name="postFilter" />
                </template>

                <button
                    class="p-1 transition-colors rounded hover:bg-gray-light"
                >
                    <AtlanIcon
                        :icon="dot ? 'FilterDot' : 'Filter'"
                        class="w-4 h-4"
                    />
                    <slot name="buttonAggregation" />
                </button>
            </a-popover>
        </template>
        -->
    </a-input>
</template>

<script lang="ts">
    import { useVModels } from '@vueuse/core'
    import {
        computed,
        defineComponent,
        nextTick,
        onMounted,
        Ref,
        ref,
        toRefs,
        PropType,
    } from 'vue'

    export default defineComponent({
        name: 'SearchAndFilter',
        props: {
            autofocus: { type: Boolean, default: () => false },
            dot: { type: Boolean, default: () => false },
            placeholder: { type: String, default: () => 'Search' },
            size: {
                type: String as PropType<'default' | 'minimal'>,
                default: () => 'default',
            },
            modelValue: { type: String, default: () => '' },
        },
        emits: ['change', 'update:modelValue'],

        setup(props, { emit }) {
            const { autofocus } = toRefs(props)

            const { modelValue } = useVModels(props, emit)

            const searchBar: Ref<null | HTMLInputElement> = ref(null)
            const localValue = ref(modelValue.value)

            // computed({
            //     get: () => modelValue.value,
            //     set: (newVal) => {
            //         console.log('dsd')
            //         modelValue.value = newVal
            //         emit('change')
            //     },
            // })

            onMounted(async () => {
                if (autofocus.value) {
                    await nextTick()
                    searchBar.value?.focus()
                }
            })

            const handleChange = () => {
                console.log('change', localValue.value)
                modelValue.value = localValue.value
                emit('change')
            }

            function clearInput() {
                localValue.value = ''
                handleChange()
            }

            return {
                localValue,
                searchBar,
                clearInput,
                handleChange,
            }
        },
    })
</script>
<style lang="less" module>
    .transparent {
        &:global(.ant-input:focus) {
            @apply border-0 shadow-none  !important;
            outline: 0 !important;
        }

        &:global(.ant-input-affix-wrapper-focused) {
            @apply border-0 shadow-none  !important;
        }

        :global(.ant-input) {
            @apply bg-transparent;
        }
    }
</style>
