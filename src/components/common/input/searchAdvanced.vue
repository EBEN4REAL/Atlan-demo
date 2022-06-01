<template>
    <a-input
        ref="searchBar"
        :placeholder="placeholderDynamic"
        v-model:value="localValue"
        :size="size"
        data-test-id="input-text"
        type="text"
        :class="{
            [$style.transparent]: !noBorder,
            [allowTabShortcut]: true,
            [$style.inputBox]: true,
            [$style.no_border]: noBorder,
            [customClass]: true,
        }"
        class="px-0 text-sm text-gray-500 bg-transparent rounded-none focus:outline-none"
        @change="handleChange"
    >
        <!-- <template #suffix>X</template> -->
        <template #prefix>
            <slot name="connector"></slot>
            <!-- <a-tooltip
                :title="capitalizeFirstLetter(connectorName)"
                placement="left"
            >
                <img
                    v-if="connectorName"
                    :src="getConnectorImageMap[connectorName.toLowerCase()]"
                    class="w-auto h-4 pr-2 mr-2 border-r"
                />
            </a-tooltip> -->

            <AtlanLoader v-if="isLoading" class="mb-0.5 h-4" />
            <AtlanIcon
                v-else
                icon="Search"
                class="flex-none h-4 text-gray-700 focusIcon"
            />
        </template>

        <template #suffix>
            <template v-if="clearable && localValue">
                <div class="cursor-pointer" @click="clear">
                    <AtlanIcon icon="Cancel" class="text-gray-500" />
                </div>
            </template>
            <slot name="tab" />
            <slot name="filter" />
            <a-popover
                v-if="$slots.postFilter"
                trigger="click"
                placement="bottomRight"
                :overlay-class-name="$style.search"
            >
                <template #content>
                    <slot name="postFilter" />
                </template>

                <button class="transition-colors rounded hover:bg-gray-100">
                    <AtlanIcon
                        :icon="dot ? 'FilterDot' : 'Filter'"
                        class="w-4 h-4 px-1"
                    />
                    <slot name="buttonAggregation" />
                </button>
            </a-popover>
            <slot name="sort" />
            <slot name="display" />
        </template>
    </a-input>
</template>

<script lang="ts">
    import { useMagicKeys, useTimeoutFn, useVModels } from '@vueuse/core'
    import {
        computed,
        defineComponent,
        nextTick,
        onMounted,
        Ref,
        ref,
        toRefs,
        PropType,
        watch,
    } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { capitalizeFirstLetter } from '~/utils/string'
    import { allowTabShortcut } from '~/composables/shortcuts/useShortcuts'

    export default defineComponent({
        name: 'SearchAndFilter',
        props: {
            autofocus: { type: Boolean, default: () => false },
            dot: { type: Boolean, default: () => false },
            clearable: { type: Boolean, default: () => false },
            placeholder: { type: String, default: () => 'Search' },
            size: {
                type: String as PropType<
                    'default' | 'minimal' | 'large' | 'small'
                >,
                default: () => 'default',
            },
            modelValue: {
                type: String,
                required: false,
                default: () => '',
            },
            connectorName: { type: String, default: () => '' },
            customClass: { type: String, default: '' },
            noBorder: { type: Boolean, default: false },
            isLoading: { type: Boolean, default: false },
        },
        emits: ['change', 'update:modelValue'],
        setup(props, { emit }) {
            const { autofocus, connectorName, size, placeholder, isLoading } =
                toRefs(props)

            const { modelValue } = useVModels(props, emit)

            const { getConnectorImageMap, getConnectorLabelByName } =
                useAssetInfo()

            const searchBar: Ref<null | HTMLInputElement> = ref(null)
            const localValue = ref(modelValue.value)

            const { start } = useTimeoutFn(() => {
                searchBar.value?.focus()
            }, 100)

            const forceFocus = () => {
                start()
            }

            const placeholderDynamic = computed(() => {
                if (getConnectorLabelByName(connectorName.value)) {
                    return `Search ${getConnectorLabelByName(
                        connectorName.value
                    )} assets`
                }
                return placeholder.value
            })

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
                modelValue.value = localValue.value
                emit('change')
            }

            function clearInput() {
                localValue.value = ''
                handleChange()
            }

            function focusInput() {
                searchBar.value?.focus()
            }

            const { Escape /* keys you want to monitor */ } = useMagicKeys()
            watch(Escape, (v) => {
                if (v) {
                    if (searchBar.value?.isFocused && localValue.value) {
                        clearInput()
                    }
                }
            })

            const clear = () => {
                localValue.value = ''
                handleChange()
            }

            return {
                clear,
                localValue,
                searchBar,
                clearInput,
                handleChange,
                forceFocus,
                connectorName,
                size,
                getConnectorImageMap,
                capitalizeFirstLetter,
                focusInput,
                getConnectorLabelByName,
                allowTabShortcut,
                placeholderDynamic,
                isLoading,
            }
        },
    })
</script>
<style lang="less" module>
    .inputBox {
        :global(.ant-input) {
            @apply text-gray-700 !important;
            &::placeholder {
                @apply text-gray-500 !important;
            }
        }
    }
    .search {
        :global(.ant-popover-inner-content) {
            @apply p-3 !important;
        }
    }
    .transparent {
        -webkit-transition: border 500ms ease-out;
        -moz-transition: border 500ms ease-out;
        -o-transition: border 500ms ease-out;
        transition: border 500ms ease-out;

        &:global(.ant-input:focus) {
            @apply border-0 shadow-none  !important;
            outline: 0 !important;
        }

        &:global(.ant-input-affix-wrapper) {
            @apply border-gray-200 border-b-0 shadow-none border-solid border-t-0 border-l-0 border-r-0 !important;

            &:global(.ant-input-affix-wrapper-focused) {
                :global(.focusIcon h-5) {
                    @apply text-primary !important;
                }
            }
        }

        &:global(.ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover) {
            border-right-width: 0px !important;
        }

        :global(.ant-input) {
            @apply bg-transparent;
        }
    }

    .no_border {
        -webkit-transition: border 500ms ease-out;
        -moz-transition: border 500ms ease-out;
        -o-transition: border 500ms ease-out;
        transition: border 500ms ease-out;
        &:global(.ant-input:focus) {
            @apply border-0 shadow-none  !important;
            outline: 0 !important;
        }

        &:global(.ant-input-affix-wrapper) {
            @apply border-gray-300 border-b shadow-none border-solid border-t-0 border-l-0 border-r-0 !important;

            &:global(.ant-input-affix-wrapper-focused) {
                @apply border-b-0  border-solid border-t-0 border-l-0 border-r-0  !important;

                :global(.focusIcon h-5) {
                    @apply text-primary !important;
                }
            }
        }

        &:global(.ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover) {
            border-right-width: 0px !important;
        }

        :global(.ant-input) {
            @apply bg-transparent;
        }
    }
</style>
