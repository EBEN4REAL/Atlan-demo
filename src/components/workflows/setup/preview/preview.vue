<template>
    <div>{{ selectedWorkflow.name }}</div>
    <AtlanButton
        class="absolute bottom-0 m-2"
        size="sm"
        color="primary"
        padding="compact"
    >
        Setup
    </AtlanButton>
</template>

<script lang="ts">
    import {
        defineAsyncComponent,
        defineComponent,
        onMounted,
        PropType,
        ref,
        Ref,
        toRefs,
        watch,
        provide,
    } from 'vue'
    import AtlanButton from '@/UI/button.vue'

    export default defineComponent({
        name: 'SetupWorkflowPreview',
        components: {
            AtlanButton,
        },
        props: {
            selectedWorkflow: {
                type: Object,
                required: true,
            },

            showCrossIcon: {
                type: Boolean,
                required: false,
            },
        },
        emits: ['assetMutation', 'closeSidebar'],
        setup(props, { emit }) {
            const { selectedWorkflow } = toRefs(props)

            const isLoaded: Ref<boolean> = ref(true)

            // const tabHeights = {
            //     discovery: 'calc(100vh - 7.8rem)',
            //     profile: 'calc(100vh - 3rem)',
            // }

            function init() {
                isLoaded.value = false
            }

            watch(selectedWorkflow, init, { deep: true })

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
            width: 48px !important;
            @apply ml-0 !important;
        }
        :global(.ant-tabs-tab) {
            height: 48px !important;
            width: 48px !important;
            @apply p-0 !important;
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
