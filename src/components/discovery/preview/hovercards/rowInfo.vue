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

            <span class="text-xs text-gray-500"
                >Row count might be different from underlying store.</span
            >
        </template>
        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import { computed, defineComponent, toRefs } from 'vue'
    import {
        getCountString,
        getSizeString,
    } from '~/composables/asset/useFormat'

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
        },
        setup(props) {
            const { rowCount, sizeBytes } = toRefs(props)
            const displayCount = computed(() => getCountString(rowCount.value))

            return { displayCount, sizeBytes }
        },
    })
</script>
