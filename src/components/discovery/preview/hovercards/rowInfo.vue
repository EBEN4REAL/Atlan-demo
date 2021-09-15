<template>
    <a-popover placement="left">
        <template #content>
            <div class="flex flex-col w-56">
                <span class="mb-2 text-sm text-gray-500">ROWS</span>
                <span class="mb-1 text-sm font-bold text-gray">{{
                    displayCount
                }}</span>
                <span class="text-xs text-gray-500"
                    >Row count might be different from underlying store.</span
                >
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
        },
        setup(props) {
            const { rowCount } = toRefs(props)
            const displayCount = computed(() => getCountString(rowCount.value))
            return { displayCount }
        },
    })
</script>
