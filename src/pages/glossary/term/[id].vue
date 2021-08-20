<template>
    <div v-if="isLoading">
        <LoadingView />
    </div>
     <div v-else class="flex flex-row h-full" :class="$style.tabClasses">
        <div class="h-full overflow-auto"  :class="currentTab === '1' || (currentTab === '2') ? 'w-2/3' : 'w-full'">
            <div class="flex flex-row justify-between pl-8 pr-4 mt-6 mb-5">
                <div class="flex flex-row">
                    <div class="mr-5">
                        <img :src="TermSvg" />
                    </div>
                    <div class="flex flex-col w-3/4">
                        <div class="flex">
                        <span class="text-xl leading-6 font-bold mr-3">{{
                            title
                        }}</span>
                        <component
                            :is="statusObject?.icon"
                            v-if="statusObject"
                            class="inline-flex self-center w-auto h-4 mb-1"
                        /> 
                    </div>

                        <span class="mt-1 text-sm leading-5 text-gray-500">{{
                            shortDescription
                        }}</span>
                    </div>
                </div>
                <div class="flex flex-row space-x-2">
                    <a-button class="px-2.5">
                        <fa icon="fal bookmark" />
                    </a-button>
                    <a-button class="px-2.5 flex align-middle">
                        <fa icon="fal upload" class="h-3 mr-2" />
                        <span>Share</span>
                    </a-button>
                    <a-button class="px-2.5" >
                        <fa icon="fal ellipsis-v" class="h-4" />
                    </a-button>
                </div>
            </div>
            <div class="m-0" >
                <a-tabs v-model:activeKey="currentTab" default-active-key="1" class="border-0">
                    <a-tab-pane key="1" tab="Overview">
                        <div class="px-8 mt-4">
                            <GlossaryProfileOverview :entity="term" />
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="Linked Terms">
                        <div :class="$style.tabClasses">
                            <LinkedAssetsTab :term-qualified-name="qualifiedName" @preview="handlePreview"/>
                        </div>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>
        <CategoryTermPreview v-if="currentTab === '1' && term" :entity="term" :preview="false" />
        <div class="border-l" :class="$style.tabClasses">
            <AssetPreview
                v-if="currentTab === '2' && previewEntity"
                page="discovery"
                :selectedAsset="previewEntity"
            ></AssetPreview>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, toRef, ref } from 'vue'

import GlossaryProfileOverview from '@/glossary/common/glossaryProfileOverview.vue'
import TopAssets from '@/glossary/termProfile/topAssets.vue'
import LinkedAssetsTab from '@/glossary/termProfile/linkedAssetsTab.vue'
import EntityHistory from '@/glossary/common/entityHistory.vue'
import LoadingView from '@common/loaders/page.vue'
import RelatedTerms from '@/glossary/termProfile/relatedTerms.vue'
import CategoryTermPreview from '@/glossary/common/categoryTermPreview/categoryTermPreview.vue'
import AssetPreview from '@/preview/asset/v2/index.vue'

import useGTCEntity from '~/composables/glossary/useGtcEntity'

import { Term } from '~/types/glossary/glossary.interface'

import TermSvg from '~/assets/images/gtc/term/term.png'
import { List as StatusList } from '~/constant/status'

export default defineComponent({
    components: {
        GlossaryProfileOverview,
        TopAssets,
        RelatedTerms,
        LinkedAssetsTab,
        EntityHistory,
        LoadingView,
        CategoryTermPreview,
        AssetPreview,
    },
    props: {
        id: {
            type: String,
            required: true,
            default: '',
        },
    },
    setup(props) {
        const guid = toRef(props, 'id')
        const currentTab = ref('1');
        const previewEntity = ref();

        const { entity: term, error, isLoading } = useGTCEntity<Term>('term', guid)

        const title = computed(() => term.value?.attributes?.name)
        const shortDescription = computed(() => term.value?.attributes?.shortDescription)
        const qualifiedName = computed(() => term.value?.attributes?.qualifiedName)
        const parentGlossaryName = computed(
            () => term.value?.attributes?.qualifiedName?.split('@')[1] ?? ''
        )

        const linkedAssetsCount = computed(
            () => term.value?.attributes?.assignedEntities?.length ?? 0
        )
        const statusObject = computed(() => StatusList.find((status) => status.id === term.value?.attributes?.assetStatus))

        const handlePreview = (entity: any) => {
            previewEntity.value = entity;
        }
        return {
            term,
            currentTab,
            error,
            isLoading,
            guid,
            TermSvg,
            title,
            shortDescription,
            qualifiedName,
            linkedAssetsCount,
            parentGlossaryName,
            previewEntity,
            statusObject,
            handlePreview
        }
    },
})
</script>
<style lang="less" module>
.termHome {
    :global(.ant-tabs-bar) {
        @apply mb-0;
    }
    :global(.ant-tabs-nav) {
        @apply ml-8;
    }
}
.overviewTab {
    :global(.ant-tabs-nav) {
        @apply ml-0;
    }
}
.tabClasses {
    :global(.ant-tabs-tab) {
        margin: 0px 32px 0px 0px !important;
        padding: 0px 0px 18px 0px !important;
    }
    :global(.ant-tabs-nav) {
        margin: 0px !important;
    }
    :global(.ant-tabs-tab-active) {
        @apply text-gray-700 font-bold !important;
    }
    :global(.ant-tabs-bar) {
        @apply px-5 !important;
    }
}
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
