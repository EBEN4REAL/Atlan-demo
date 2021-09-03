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
        >
            <template #suffix>
                <AtlanIcon icon="Search" />
            </template>
        </a-input>
        <a-popover v-if="$slots.filter" trigger="click" placement="bottomRight">
            <template #content>
                <slot name="filter" />
            </template>
            <a-button class="flex items-center p-1 ml-2 rounded">
                <AtlanIcon :icon="dot ? 'FilterDot' : 'Filter'" class="h-6" />
                <slot name="buttonAggregation" />
            </a-button>
        </a-popover>
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
        @apply mr-2 rounded;
        @apply border border-gray-300 !important;
        @apply outline-none;
        :global(.ant-input) {
            @apply h-6;
            @apply bg-transparent;
            @apply text-gray-500;
        }
        &:hover {
            border-right-width: 2px !important;
            box-shadow: 0 0 0 2px rgb(82 119 215 / 20%);
        }
        ::placeholder {
            @apply text-gray-500 opacity-80 text-sm;
        }
    }
</style>
