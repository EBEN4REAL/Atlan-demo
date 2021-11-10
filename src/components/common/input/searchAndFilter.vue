<template>
    <div
        class="flex items-center w-full transition duration-300 searchbar h-7"
        :class="size"
    >
        <!-- <slot name="categoryFilter" /> -->

        <div class="flex items-center justify-between flex-grow pl-1">
            <AtlanIcon
                v-if="!$slots.categoryFilter"
                icon="Search"
                class="flex-none pr-1 text-gray-500"
            />
            <a-input
                ref="searchBar"
                v-model:value="localValue"
                :placeholder="placeholder"
                type="text"
                class="flex-1 w-2/3 text-sm bg-transparent border-0 outline-none  focus:border-0 focus:border-r-0 focus:shadow-none"
                @change="handleChange"
            />

            <div class="flex-none w-7 h-7">
                <button
                    v-if="localValue?.length"
                    class="text-gray-500 hover:text-gray"
                >
                    <AtlanIcon
                        icon="Cancel"
                        class="h-3 m-2"
                        @click="clearInput"
                        @keyup.enter="clearInput"
                    />
                </button>
            </div>

            <a-popover
                v-if="$slots.filter"
                trigger="click"
                placement="bottomRight"
            >
                <template #content>
                    <slot name="filter" />
                </template>

                <button
                    class="p-1 mr-2 transition-colors rounded  hover:bg-gray-light"
                >
                    <AtlanIcon
                        :icon="dot ? 'FilterDot' : 'Filter'"
                        class="w-4 h-4"
                    />
                    <slot name="buttonAggregation" />
                </button>
            </a-popover>
            <slot name="tabSelector" />
        </div>
    </div>
</template>

<script lang="ts">
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
    import { useVModels } from '@vueuse/core'

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
        emits: ['update:modelValue', 'change'],
        setup(props, { emit }) {
            const { autofocus } = toRefs(props)

            const { modelValue } = useVModels(props)
            const localValue = ref(modelValue.value)

            const searchBar: Ref<null | HTMLInputElement> = ref(null)

            onMounted(async () => {
                if (autofocus.value) {
                    await nextTick()
                    searchBar.value?.focus()
                }
            })

            const handleChange = () => {
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
<style lang="less" scoped>
    .searchbar {
        min-width: 100px;

        input {
            min-width: 100px;
        }
        .ant-input:focus {
            border: none;
            border-right: none;
        }

        .ant-input:hover {
            border: none;
            border-right: none;
        }

        &.default {
            @apply border border-gray-300 rounded shadow;
            &:hover {
                @apply shadow-md;
            }
            &:focus-within {
                @apply ring-2 border-primary shadow-none;
            }
        }

        &.minimal {
            @apply border-b border-gray-300;
            &:hover {
                @apply border-primary-focus;
            }
            &:focus-within {
                @apply border-primary;
            }
        }
    }
</style>
