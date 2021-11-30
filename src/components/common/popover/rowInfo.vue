<template>
    <a-popover placement="left">
        <template #content>
            <div class="p-3">
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
                    <div class="flex items-center mb-1 text-sm text-gray-500">
                        <img :src="image" class="h-4 mr-1 mb-0.5" />Updated
                    </div>
                    <div class="leading-none">
                        <span class="mb-1 text-sm font-bold">
                            {{ sourceUpdatedAt }}</span
                        >
                    </div>
                    <span class="text-xs">{{ sourceUpdatedAtRaw }}</span>
                </div>
                <div v-if="sourceCreatedAt" class="mt-2">
                    <div class="flex items-center mb-1 text-sm text-gray-500">
                        <img :src="image" class="h-4 mr-1 mb-0.5" />Created
                    </div>
                    <div class="leading-none">
                        <span class="mb-1 text-sm font-bold">
                            {{ sourceCreatedAt }}</span
                        >
                    </div>
                    <span class="text-xs">{{ sourceCreatedAtRaw }}</span>
                </div>
            </div>
        </template>
        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'
    import { getCountString } from '~/utils/number'

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
            image: {
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
