<template>
    <a-popover
        :overlayClassName="editPermission ? 'shortcutPopover' : ''"
        :mouseEnterDelay="delay"
        :destroyTooltipOnHide="true"
    >
        <template v-if="editPermission" #content>
            <div class="flex items-center text-gray-3]500 gap-x-2">
                <span class="text-sm capitalize">{{ action }}</span>

                <div
                    v-for="(key, index) in keys"
                    :key="index"
                    class="flex px-1 font-bold text-center text-white capitalize rounded key gap-x-1"
                >
                    {{ key }}
                </div>
            </div>
        </template>
        <slot></slot>
    </a-popover>
</template>

<script lang="ts">
    import { defineComponent, toRefs, computed } from 'vue'

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
            editPermission: {
                type: Boolean,
                required: false,
                default: false,
            },
            delay: {
                type: Number,
                default: 0,
            },
        },
        setup(props) {
            const { shortcutKey, action } = toRefs(props)
            const keys = computed(() => shortcutKey.value.split('+'))

            return {
                shortcutKey,
                action,
                keys,
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
    .key {
        background-color: #9ea6b1;
        height: 20px;
        min-width: 20px;
    }
</style>
