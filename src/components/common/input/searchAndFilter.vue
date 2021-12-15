<template>
    <div
        class="flex items-center w-full transition duration-300 searchbar"
        :class="size"
    >
        <slot name="categoryFilter" />
        <div class="flex items-center justify-between flex-grow py-1">
            <AtlanIcon
                icon="Search"
                class="flex-none pl-2 pr-1 text-gray-500"
            />
            <input
                ref="searchBar"
                v-model="value"
                :placeholder="placeholder"
                data-test-id="search-input"
                type="text"
                class="flex-1 text-sm bg-transparent focus:outline-none"
                @keyup.esc="$event.target.blur()"
            />
            <div class="flex-none h-7 w-7">
                <button
                    v-if="value?.length"
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
                    class="p-1 mr-2 transition-colors rounded hover:bg-gray-light"
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

    export default defineComponent({
        name: 'SearchAndFilter',
        props: {
            autofocus: { type: Boolean, default: () => false },
            dot: { type: Boolean, default: () => false },
            placeholder: { type: String, default: () => 'Search' },
            size: {
                type: String as PropType<'default' | 'minimal' | 'bordered'>,
                default: () => 'default',
            },
            value: { type: String },
        },
        emits: ['update:value', 'change'],
        setup(props, { emit }) {
            const { autofocus, value: val } = toRefs(props)
            const searchBar: Ref<null | HTMLInputElement> = ref(null)
            const value = computed({
                get: () => val.value,
                set: (newVal) => {
                    emit('update:value', newVal)
                    emit('change', newVal)
                },
            })

            function clearInput() {
                emit('update:value', '')
                emit('change', '')
            }

            onMounted(async () => {
                if (autofocus.value) {
                    await nextTick()
                    searchBar.value?.focus()
                }
            })

            return {
                value,
                searchBar,
                clearInput,
            }
        },
    })
</script>
<style lang="less" scoped>
    .searchbar {
        min-width: 100px;
        min-height: 32px;

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
        .ant-input::placeholder {
            @apply text-gray-500;
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
        &.bordered {
            @apply border border-gray-300 rounded shadow-none;
            &:hover {
                @apply shadow-none;
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
