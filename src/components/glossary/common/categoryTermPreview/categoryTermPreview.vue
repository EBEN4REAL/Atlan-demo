<template>
    <div class="sidePanel flex flex-col w-1/3 border-l min-h-full overflow-y-hide"
        :class="$style.gtcPreview"
    >
    <div class="flex flex-row justify-between align-middle px-5 py-8">
        <div class="flex flex-row align-middle space-x-2">
            <span>
                <img v-if="entity.typeName === 'AtlasGlossaryCategory'" :src="CategorySvg" :width="25" />
                <img v-else-if="entity.typeName === 'AtlasGlossaryTerm'" :src="TermSvg" />
            </span>
            <span v-if="type" class="text-sm text-gray-500 font-bold" >{{ type === 'AtlasGlossaryTerm' ? 'Term' : 'Category'}} </span>
        </div>
        <div class="flex flex-row space-x-2">
            <a-button size="small">
                <fa icon="fal bookmark" />
            </a-button>
            <a-button size="small" class="flex align-middle text-xs pt-1 text-primary bg-blue-100 border-0">
                Open {{type === 'AtlasGlossaryTerm' ? 'Term' : 'Category'}} Details
            </a-button>
        </div>
    </div>
    <span class=" px-5 text-xl leading-7 text-gray-700 font-bold">{{ entity.displayText }}</span>
        <a-tabs default-active-key="1" class="border-0">
            <a-tab-pane key="info" tab="Info">
                <a-collapse :bordered="false" expand-icon-position="right">
                    <template #expandIcon="{ isActive }">
                        <fa v-if="isActive" icon="fas angle-up" />
                        <fa v-else icon="fas angle-down" />
                    </template>

                    <a-collapse-panel key="details" header="Details" >
                        <div class="pl-6 flex flex-col">
                            <Description v-if="entity.guid" :selectedAsset="entity" />
                            <Owners v-if="entity.guid" :selectedAsset="entity" />
                            <Experts v-if="entity.guid" :selectedAsset="entity" />
                            <Status v-if="entity.guid" :selectedAsset="entity" />
                        </div>
                    </a-collapse-panel>

                    <a-collapse-panel
                        v-if="entity.typeName === 'AtlasGlossaryTerm'"
                        key="governance"
                        header="Governance"
                    >
                        <div class="px-6 py-0">
                            <Classifications :selectedAsset="entity" />
                        </div>
                    </a-collapse-panel>

                    <a-collapse-panel
                        v-if="entity.typeName === 'AtlasGlossaryTerm'"
                        key="related terms"
                        header="Related Terms"
                    >
                        <div class="px-6 py-0">
                            <RelatedTerms :entity="entity" />
                        </div>
                    </a-collapse-panel>
                </a-collapse>
            </a-tab-pane>
            <a-tab-pane v-if="entity.typeName === 'AtlasGlossaryTerm'" key="linkedAssets" tab="Linked Assets"> 
                <LinkedAssets :termQualifiedName="entity.attributes.qualifiedName" />
            </a-tab-pane>
            <a-tab-pane key="activity" tab="Activity"> 
                <Activity :selectedAsset="entity" />
            </a-tab-pane>
            <a-tab-pane key="requests" tab="Requests"> Requests </a-tab-pane>
            <a-tab-pane key="chat" tab="chat"> Chat </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, toRef } from 'vue'

import Owners from '@/preview/asset/v2/tabs/info/assetDetails/owners.vue'
import Experts from '@/preview/asset/v2/tabs/info/assetDetails/experts.vue'
import Description from '@/preview/asset/v2/tabs/info/assetDetails/description.vue'
import Status from '@/preview/asset/v2/tabs/info/assetDetails/status.vue'
import Activity from '@/preview/asset/v2//tabs/activity/index.vue';
import Classifications from '@/preview/asset/v2/tabs/info/governance/classifications.vue'
import RelatedTerms from '@/glossary/termProfile/relatedTerms.vue';
import LinkedAssets from './linkedAssets.vue';

import { Category, Term } from '~/types/glossary/glossary.interface'
import { Components } from '~/api/atlas/client'

import TermSvg from "~/assets/images/gtc/term/term.png";
import CategorySvg from "~/assets/images/gtc/category/category.png";

export default defineComponent({
    components: {
        Owners,
        Description,
        Status,
        Experts,
        Activity,
        Classifications,
        RelatedTerms,
        LinkedAssets,
    },
    props: {
        entity: {
            type: Object as PropType<Category | Term>,
            required: true,
            default: () => ({}),
        },
    },
    setup(props) {
        const shortDescription = computed(
            () => props.entity?.attributes?.shortDescription
        )
        const type = computed(() => props.entity?.typeName)
        return {
            TermSvg,
            CategorySvg,
            shortDescription,
            type
        }
    },
})
</script>
<style lang="less" module>
.gtcPreview {
    :global(.ant-collapse-header) {
        @apply pl-6 m-0 font-bold text-sm text-gray-700 bg-white !important;
    }
    :global(.ant-collapse-borderless > .ant-collapse-item) {
        @apply border-b border-gray-300 py-4  mt-0 !important;
    }

    :global(.ant-collapse) {
        @apply p-0 m-0 space-y-0 bg-white !important;
    }

    :global(.ant-collapse-content) {
        @apply mt-4 bg-white !important;
    }
    :global(.ant-collapse-content-box) {
        @apply m-0 p-0  bg-transparent !important;
    }
    :global(.ant-tabs-tabpane) {
        @apply m-0 p-0  !important;
    }
    :global(.ant-tabs-bar){
        @apply mb-0;
    }
}
</style>
<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
</route>