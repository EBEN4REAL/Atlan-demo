<template>
    <a-tabs v-model:activeKey="activeTabKey" class="w-full typeTabs">
        <a-tab-pane key="1" tab="Linked Assets" />
        <a-tab-pane key="2" tab="Linked Terms" />
    </a-tabs>
    <KeepAlive>
        <AssetsWrapper :dataMap="filterConfig" v-if="activeTabKey === '1'" />
    </KeepAlive>
    <!-- <LinkedTerms
            v-else-if="activeTabKey === '2'"
            :selected-classification="selectedClassification?.name"
        /> -->
</template>

<script lang="ts">
    import { defineComponent, computed, ref, PropType, toRefs } from 'vue'
    import AssetsWrapper from '@common/assets/index.vue'
    import LinkedTerms from './LinkedTerms.vue'
    import { classificationInterface } from '~/types/classifications/classification.interface'

    export default defineComponent({
        name: 'ClassificationBody',
        components: {
            AssetsWrapper,
            LinkedTerms,
        },
        props: {
            classification: {
                type: Object as PropType<classificationInterface>,
                required: true,
            },
        },
        setup(props) {
            const assetSearchText = ref('')
            const { classification: selectedClassification } = toRefs(props)
            const handleAssetSearch = (e: any) => {
                assetSearchText.value = e.target.value
            }
            const activeTabKey = ref('1')

            const filterConfig = computed(() => ({
                classifications: {
                    checked: [selectedClassification.value?.name],
                    operator: 'OR',
                    addedBy: 'all',
                },
            }))
            return {
                selectedClassification,
                filterConfig,
                activeTabKey,
                assetSearchText,
                handleAssetSearch,
            }
        },
    })
</script>

<style lang="less">
    .typeTabs {
        .ant-tabs-tab {
            padding-left: 2px !important;
            padding-right: 2px !important;
            padding-top: 8px !important;
            padding-bottom: 8px !important;
            @apply mr-4 !important;
            @apply text-gray-500;
            @apply text-sm !important;
            @apply tracking-wide;
        }
        .ant-tabs-tab:first-child {
            @apply ml-5 !important;
        }
        .ant-tabs-nav-container-scrolling .ant-tabs-tab:first-child {
            @apply ml-0;
        }
        .ant-tabs-tab-active {
            @apply text-gray !important;
            @apply font-bold !important;
            @apply tracking-normal;
        }
        .ant-tabs-bar {
            margin-bottom: 0px;
        }
        .ant-tabs-content {
            padding-right: 0px;
        }
        .ant-tabs-ink-bar {
            @apply rounded-t-sm;
            margin-bottom: 1px;
        }
    }
</style>
