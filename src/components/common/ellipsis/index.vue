<template>
    <a-tooltip
        :placement="placement"
        :destroy-tooltip-on-hide="true"
        :overlay-style="{ maxWidth: width }"
        :color="tooltipColor"
        :overlay-class-name="tooltipColor === 'white' ? 'tooltip-black' : ''"
        :mouse-leave-delay="mouseLeaveDelay"
        :mouse-enter-delay="mouseEnterDelay"
    >
        <template v-if="truncated && showTooltip" #title>
            <div v-linkified class="whitespace-pre-wrap">
                {{ tooltipText }}
            </div>
        </template>
        <div
            :class="classes"
            :style="{ maxWidth: clampPercentage }"
            class="break-words"
        >
            <template v-if="routeTo">
                <router-link
                    :to="routeTo"
                    :target="shouldOpenInNewTab ? '_blank' : 'self'"
                >
                    <a-typography-paragraph
                        :class="classes"
                        :ellipsis="{
                            rows: rows,
                            onEllipsis: () => (truncated = !truncated),
                        }"
                        :content="tooltipText"
                    />
                </router-link>
            </template>
            <template v-else>
                <a-typography-paragraph
                    :class="classes"
                    :ellipsis="{
                        rows: rows,
                        onEllipsis: () => (truncated = !truncated),
                    }"
                    :content="tooltipText"
                />
            </template>
        </div>
    </a-tooltip>
</template>

<script lang="ts">
    import { defineComponent, ref, toRefs, watch } from 'vue'

    export default defineComponent({
        name: 'Tooltip',
        props: {
            tooltipText: {
                type: String,
                default: '',
            },
            showTooltip: {
                type: Boolean,
                default: true,
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
            placement: {
                type: String,
                default: 'topRight',
            },
            routeTo: {
                type: String,
                required: false,
            },
            tooltipColor: {
                type: String,
                required: false,
                default: '#2A2F45',
            },
            shouldOpenInNewTab: {
                type: Boolean,
                required: false,
                default: false,
            },
            clampPercentage: {
                type: String,
                required: false,
                default: '95%',
            },
            mouseLeaveDelay: {
                type: Number,
                required: false,
                default: 0.1,
            },
            mouseEnterDelay: {
                type: Number,
                required: false,
                default: 0.1,
            },
        },
        setup(props) {
            const truncated = ref<boolean>(false)
            const { tooltipText } = toRefs(props)

            return {
                tooltipText,
                truncated,
            }
        },
    })
</script>

<style lang="less" scoped>
    :global(div.ant-typography, .ant-typography p) {
        margin-bottom: 0 !important;
    }
    :global(.tooltip-black .ant-tooltip-inner) {
        @apply p-3 text-gray-700 whitespace-pre-line;
    }
</style>
