<template>
    <div class="sidePanel flex flex-col w-1/2 border-l min-h-full overflow-y-hide">
        <a-tabs default-active-key="1" class="border-0">
            <a-tab-pane key="info" tab="Info">
                <a-collapse :bordered="false">
                    <a-collapse-panel v-if="termCount" key="1" header="Details">
                        <div class="pl-6 flex flex-col">
                            <div class="flex flex-row space-x-16">
                                <div class="flex flex-col">
                                    <span class="mb-2 text-sm leading-5 text-gray-500"> Categories </span>
                                    <span
                                        class="p-0 m-0 text-sm leading-5 text-gray-700"
                                        >{{ categoryCount }}
                                    </span>
                                </div>
                                <div class="flex flex-col">
                                    <span class="mb-2 text-sm leading-5 text-gray-500"> Terms </span>
                                    <span
                                        class="p-0 m-0 text-sm leading-5 text-gray-700"
                                        >{{ termCount }}
                                    </span>
                                </div>
                            </div>
                            <div class="flex flex-col mt-4">
                                <Description v-if="entity.guid" :selectedAsset="entity" />
                            </div>
                            <div class="flex flex-col mt-4 min-w-full">
                                <Owners v-if="entity.guid" :selectedAsset="entity" />
                            </div>
                            <div class="flex flex-col mt-4">
                                <Experts v-if="entity.guid" :selectedAsset="entity" />
                            </div>
                            <div class="flex flex-col mt-4">
                                <Status v-if="entity.guid" :selectedAsset="entity" />
                            </div>
                        </div>
                    </a-collapse-panel>
                    <a-collapse-panel
                        v-if="termCount"
                        key="2"
                        header="Top Terms"
                    >
                        <div class="flex flex-column">
                            <GlossaryTopTerms
                                v-if="glossaryTerms?.length"
                                :terms="glossaryTerms"
                            />
                        </div>
                    </a-collapse-panel>
                </a-collapse>
            </a-tab-pane>
            <a-tab-pane key="activity" tab="Activity"> 
                <Activity :selectedAsset="entity" />
            </a-tab-pane>
            <a-tab-pane key="chat" tab="chat"> Chat </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, toRef } from 'vue'

import GlossaryTopTerms from '@/glossary/common/glossaryTopTerms.vue'
import Owners from '@/preview/asset/v2/tabs/info/assetDetails/owners.vue'
import Experts from '@/preview/asset/v2/tabs/info/assetDetails/experts.vue'
import Description from '@/preview/asset/v2/tabs/info/assetDetails/description.vue'
import Status from '@/preview/asset/v2/tabs/info/assetDetails/status.vue'
import Activity from '@/preview/asset/v2//tabs/activity/index.vue';

import { Glossary, Category, Term } from '~/types/glossary/glossary.interface'
import { Components } from '~/api/atlas/client'

export default defineComponent({
    components: {
        GlossaryTopTerms,
        Owners,
        Description,
        Status,
        Experts,
        Activity
    },
    props: {
        entity: {
            type: Object as PropType<Glossary | Category | Term>,
            required: true,
            default: () => ({}),
        },
        topTerms: {
            type: Object as PropType<Components.Schemas.AtlasGlossaryTerm[]>,
            required: false,
            default: () => ({}),
        },
    },
    setup(props) {
        const shortDescription = computed(
            () => props.entity?.attributes?.shortDescription
        )
        const termCount = computed(
            () => props.entity?.attributes?.terms?.length ?? 0
        )
        const categoryCount = computed(
            () => props.entity?.attributes?.categories?.length ?? 0
        )
        const glossaryTerms = computed(() => props.topTerms ?? [])
        return {
            shortDescription,
            termCount,
            categoryCount,
            glossaryTerms,
        }
    },
})
</script>
<style lang="less" module>
:global(.ant-collapse-content-box) {
    @apply bg-transparent !important;
}
:global(.ant-collapse-header) {
    @apply pl-8 font-bold text-sm text-gray-700 bg-white border-0 border-b-0 !important;
}
:global(.ant-collapse-borderless > .ant-collapse-item) {
    @apply border-b-0 mt-4 !important;
}

:global(.ant-collapse) {
    @apply bg-white !important;
}

:global(.ant-collapse-content) {
    @apply mt-4 bg-white !important;
}
:global(.ant-collapse-content-box) {
    @apply m-0 p-0 !important;
}
</style>
<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
</route>