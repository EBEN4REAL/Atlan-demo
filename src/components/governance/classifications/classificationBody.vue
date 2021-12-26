<template>
    <!-- <KeepAlive> -->
    <div class="overflow-y-scroll wrapper-height">
        <ClassificationOverview
            class="p-5"
            :classification="selectedClassification"
        />
    </div>
    <!-- </KeepAlive> -->
</template>

<script lang="ts">
    import { defineComponent, computed, ref, PropType, toRefs } from 'vue'
    import AssetsWrapper from '@/assets/index.vue'
    import MinimalTab from '@/UI/minimalTab.vue'
    import ClassificationOverview from '@/governance/classifications/overview.vue'

    import { ClassificationInterface } from '~/types/classifications/classification.interface'

    export default defineComponent({
        name: 'ClassificationBody',
        components: {
            AssetsWrapper,
            MinimalTab,
            ClassificationOverview,
        },
        props: {
            classification: {
                type: Object as PropType<ClassificationInterface>,
                required: true,
            },
        },
        setup(props) {
            const { classification: selectedClassification } = toRefs(props)

            // const activeTabKey = ref('1')
            // const tabConfig = [
            //     { key: '1', label: 'Overview' },
            //     { key: '2', label: 'Assets' },
            // ]

            return {
                selectedClassification,
            }
        },
    })
</script>

<style lang="less" scoped>
    .typeTabs {
        .ant-tabs-tab {
            padding-left: 2px !important;
            padding-right: 2px !important;
            padding-top: 8px !important;
            padding-bottom: 16px !important;
            @apply mr-4 !important;
            @apply text-gray-500;
            @apply text-sm !important;
            @apply tracking-wide;
        }
        .ant-tabs-tab:first-child {
            margin-left: 18px !important;
        }
        .ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child {
            @apply ml-0;
        }
        .ant-tabs-tab-active {
            @apply text-gray !important;
            @apply font-bold !important;
            @apply tracking-normal;
        }
        .ant-tabs-content {
            padding-right: 0px;
        }
        .ant-tabs-ink-bar {
            @apply rounded-t-sm;
            margin-bottom: 1px;
        }
    }
    .wrapper-height {
        height: calc(100vh - 4rem);
        overflow: auto;
    }
</style>
