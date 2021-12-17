<template>
    <a-popover :overlayClassName="readOnly ? '' : 'shortcutPopover'">
        <template v-if="!readOnly" #content>
            <div class="flex items-center text-gray-3]500 gap-x-2">
                <span class="text-sm capitalize">{{ action }}</span>

                <div
                    class="w-5 h-5 font-bold text-center text-white capitalize rounded key-color"
                >
                    {{ shortcutKey }}
                </div>
            </div>
        </template>
        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import { defineComponent, toRefs } from 'vue'

    export default defineComponent({
        components: {},
        props: {
            shortcutKey: {
                type: String,
                required: false,
                default: '',
            },
            action: {
                type: String,
                required: false,
                default: '',
            },
            readOnly: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup(props, { emit }) {
            const { shortcutKey, action } = toRefs(props)

            return {
                shortcutKey,
                action,
            }
        },
    })
</script>

<style lang="less">
    .shortcutPopover {
        .ant-popover-inner-content {
            @apply px-2 py-1 !important;
        }
    }
    .key-color {
        background-color: #9ea6b1;
    }
</style>
