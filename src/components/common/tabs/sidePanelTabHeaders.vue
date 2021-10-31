<template>
    <a-tooltip placement="left" :title="title" :mouse-enter-delay="0.5"
        ><div class="flex items-center justify-center w-full h-full">
            <AtlanIcon
                :icon="isActive && activeIcon ? activeIcon : icon"
                :class="isActive && !activeIcon ? 'text-primary' : ''"
                class="h-6"
            />
        </div>
    </a-tooltip>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'SidePanelTabHeaders',
        props: {
            title: {
                type: String,
                required: true,
            },
            icon: {
                type: String,
                required: true,
            },
            isActive: {
                type: Boolean,
                required: true,
            },
            activeIcon: {
                type: String,
                required: false,
                default: () => '',
            },
        },
        setup(props, { emit }) {
            return {}
        },
    })
</script>
<style lang="less" scoped>
    .icon-btn {
        @apply flex;
        @apply py-2 ml-2 px-3;
        @apply rounded;
        @apply text-gray;
        @apply border border-gray-300;
        @apply cursor-pointer;
        @apply hover:bg-gray-100;
    }
</style>
<style lang="less" module>
    .previewtab {
        :global(.ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child) {
            @apply ml-0 !important;
            @apply mt-4 !important;
        }

        :global(.ant-tabs-bar) {
            margin-bottom: 0px !important;
        }
        :global(.ant-tabs-nav-container) {
            width: 60px !important;
            @apply ml-0 !important;
        }
        :global(.ant-tabs-tab) {
            height: 48px !important;
            width: 60px !important;
            @apply p-0 !important;
        }
        :global(.ant-tabs-tab:first-child) {
            @apply mt-4 !important;
        }

        :global(.ant-tabs-content) {
            @apply px-0 !important;
        }
        :global(.ant-tabs-ink-bar) {
            @apply rounded-t-sm;
            margin-bottom: 1px;
        }
        :global(.ant-tabs-tabpane) {
            @apply px-0 !important;
            @apply pb-0 !important;
        }
    }
</style>
