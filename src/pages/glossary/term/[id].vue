<template>
    <div v-if="isLoading" class="w-full min-h-full justify-center">
        <LoadingView />
    </div>
     <div v-else class="flex flex-row">
        <div :class="currentTab === '1' || (currentTab === '2') ? 'w-2/3' : 'w-full'">
            <div class="flex flex-row justify-between px-8 mt-6 mb-5">
                <div class="flex flex-row">
                    <div class="mr-5">
                        <img :src="TermSvg" />
                    </div>
                    <div class="flex flex-col">
                        <div class="flex">
                            <span v-if="parentGlossaryName" class="text-gray-400 mr-1">
                            {{ parentGlossaryName }} / 
                        </span>
                        <span class="text-xl leading-6 font-bold">{{
                            title
                        }}</span>
                        </div>
                        <!-- <EntityHistory
                    :created-at="glossary?.attributes.__timestamp"
                    :created-by="glossary?.createdBy"
                    :updated-at="glossary?.attributes.__modificationTimestamp"
                    :updated-by="glossary?.updatedBy"
                /> -->
                        <span class="mt-1 text-sm leading-5 text-gray-500">{{
                            shortDescription
                        }}</span>
                    </div>
                </div>
                <div class="flex flex-row space-x-2 mr-4">
                    <a-button >
                        <fa icon="fal bookmark" />
                    </a-button>
                    <a-button class="flex align-middle">
                        <fa icon="fal upload" class="h-3 mr-2" />
                        Share
                    </a-button>
                    <a-button >
                        <fa icon="fal ellipsis-v" class="h-4" />
                    </a-button>
                </div>
            </div>
            <div class="flex flex-row">
                <a-tabs v-model:activeKey="currentTab" default-active-key="1" class="border-0">
                    <a-tab-pane key="1" tab="Overview">
                        <div class="flex flex-row m-0 px-8">
                            <GlossaryProfileOverview :entity="term" />
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="Linked Terms">
                        <LinkedAssetsTab :term-qualified-name="qualifiedName" @preview="handlePreview"/>
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>
        <CategoryTermPreview v-if="currentTab === '1' && term" :entity="term" :preview="false" />
        <AssetPreview
            v-if="currentTab === '2' && previewEntity"
            :selectedAsset="previewEntity"
        ></AssetPreview>
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
            handlePreview
        }
    },
})
</script>
<style>
.sidebar {
    max-height: 70vh;
}
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
