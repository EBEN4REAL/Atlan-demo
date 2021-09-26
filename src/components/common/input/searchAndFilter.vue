<template>
    <div class="flex items-center justify-between">
        <a-input
            ref="searchBar"
            :value="value"
            :placeholder="placeholder"
            :size="size"
            :class="$style.searchbar"
            @change="$emit('change', $event)"
            @update:value="$emit('update:value', $event)"
            :allowClear="true"
        >
            <template #prefix>
                <AtlanIcon icon="Search" />
            </template>
            <template #suffix>
                <a-popover
                    v-if="$slots.filter"
                    trigger="click"
                    placement="bottomRight"
                >
                    <template #content>
                        <slot name="filter" />
                    </template>

                    <div class="px-3 py-1 border rounded">
                        <AtlanIcon
                            :icon="dot ? 'FilterDot' : 'Filter'"
                            class="w-4 h-4"
                        />
                        <slot name="buttonAggregation" />
                    </div>
                </a-popover>
            </template>
        </a-input>
    </div>
</template>

<script lang="ts">
    import { defineComponent, nextTick, onMounted, Ref, ref, toRefs } from 'vue'

    export default defineComponent({
        name: 'SearchAndFilter',
        props: {
            autofocus: { type: Boolean, default: () => false },
            dot: { type: Boolean, default: () => false },
            placeholder: { type: String, default: () => 'Search' },
            size: { type: String, default: () => 'default' },
            value: { type: String },
        },
        emits: ['update:value', 'change'],
        setup(props) {
            const { autofocus } = toRefs(props)
            const searchBar: Ref<null | HTMLInputElement> = ref(null)
            onMounted(async () => {
                if (autofocus.value) {
                    await nextTick()
                    searchBar.value?.focus()
                }
            })
            return {
                searchBar,
            }
        },
    })
</script>

<style lang="less" module>
    .searchbar {
        @apply bg-transparent border-t-0 border-l-0 border-r-0  border-b border-gray-300 rounded-sm !important;

        @apply outline-none;
        transition: border 500ms ease-out;

        :global(.ant-input) {
            @apply bg-transparent !important;
        }

        &:global(.ant-input-affix-wrapper-focused) {
            @apply border-primary border-b border-t-0 border-l-0 border-r-0 !important;
            box-shadow: none !important;
        }

        &:hover {
            @apply border-primary border-b border-t-0 border-l-0 border-r-0 !important;
        }
        &:focus {
            @apply border-primary border-b border-t-0 border-l-0 border-r-0 !important;
            box-shadow: none !important;
        }
        ::placeholder {
            @apply text-gray-500 opacity-80;
        }
    }
</style>
