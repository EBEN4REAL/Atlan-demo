<template>
    <a-tooltip
        :title="truncated ? tooltipText : undefined"
        placement="topRight"
        :overlay-style="{ maxWidth: width }"
        ><div :class="classes" :style="{ maxWidth: '95%' }">
            <a-typography-paragraph
                :ellipsis="{
                    rows: rows,
                    onEllipsis: () => (truncated = true),
                }"
                :content="tooltipText"
            />
        </div>
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
            classes: {
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

<style lang="less" scoped>
    :global(div.ant-typography, .ant-typography p) {
        margin-bottom: 0 !important;
    }
</style>
