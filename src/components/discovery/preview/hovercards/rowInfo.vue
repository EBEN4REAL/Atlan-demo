<template>
    <a-popover placement="left">
        <template #content>
            <div class="flex space-x-4">
                <div>
                    <div class="mb-1 text-sm text-gray-500">Rows</div>
                    <div class="flex">
                        <span class="mb-1 text-sm font-bold text-gray">{{
                            displayCount
                        }}</span>
                    </div>
                </div>
                <div v-if="sizeBytes !== '0'">
                    <div class="mb-1 text-sm text-gray-500">Size</div>
                    <div class="flex">
                        <span class="mb-1 text-sm font-bold text-gray">
                            {{ sizeBytes }}</span
                        >
                    </div>
                </div>
            </div>
            <div v-if="sourceUpdatedAt" class="mt-2">
                <div class="mb-1 text-sm text-gray-500">Source updated</div>
                <div class="leading-none">
                    <span class="mb-1 text-sm font-bold">
                        {{ sourceUpdatedAt }}</span
                    >
                </div>
                <span class="text-xs">{{ sourceUpdatedAtRaw }}</span>
            </div>
            <div v-if="sourceCreatedAt" class="mt-2">
                <div class="mb-1 text-sm text-gray-500">Source created</div>
                <div class="leading-none">
                    <span class="mb-1 text-sm font-bold">
                        {{ sourceCreatedAt }}</span
                    >
                </div>
                <span class="text-xs">{{ sourceCreatedAtRaw }}</span>
            </div>
        </template>
        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'
    import { getCountString } from '~/composables/asset/useFormat'

    export default defineComponent({
        name: 'RowInfoHoverCard',
        props: {
            rowCount: {
                type: String,
                required: true,
                default: () => '~',
            },
            sizeBytes: {
                type: String,
                required: true,
                default: () => '',
            },
            sourceUpdatedAt: {
                required: false,
            },
            sourceUpdatedAtRaw: {
                required: false,
            },
            sourceCreatedAt: {
                required: false,
            },
            sourceCreatedAtRaw: {
                required: false,
            },
        },
        setup(props) {
            const {
                rowCount,
                sizeBytes,
                sourceUpdatedAt,
                sourceCreatedAt,
                sourceUpdatedAtRaw,
                sourceCreatedAtRaw,
            } = toRefs(props)
            const displayCount = computed(() => getCountString(rowCount.value))

            return {
                displayCount,
                sizeBytes,
                sourceUpdatedAt,
                sourceCreatedAt,
                sourceUpdatedAtRaw,
                sourceCreatedAtRaw,
            }
        },
    })
</script>
