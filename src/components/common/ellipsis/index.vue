<template>
    <a-tooltip
        :title="truncated ? tooltipText : undefined"
        placement="topRight"
        :overlay-style="{ maxWidth: width }"
    >
        <a-typography-paragraph
            :style="{ width: '85%' }"
            :ellipsis="{
                rows: rows,
                onEllipsis: () => (truncated = true),
            }"
            :content="tooltipText"
        />
    </a-tooltip>
</template>

<script lang="ts">
    import { defineComponent, ref } from 'vue'

    export default defineComponent({
        props: {
            tooltipText: {
                type: String,
                default: '',
            },
            rows: {
                type: Number,
                default: 1,
            },
            width: {
                type: String,
                default: 'intial',
            },
        },
        setup() {
            const truncated = ref<boolean>(false)

            return {
                truncated,
            }
        },
    })
</script>
