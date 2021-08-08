<template>
        <div v-if="isLoading" class="w-full  min-h-full justify-center" >
            <LoadingView/>
        </div>
    <div v-else class="px-12 pr-0 mb-0">

            <div class="flex flex-row mt-6 mb-5">
            <div class="mr-5">
                <img :src="TermSvg" />
            </div>
            <div class="flex flex-col">
                <span class="secondaryHeading">TERM</span>
                <h1 class="text-2xl leading-8 m-0 p-0 text-black font-normal">
                   <span v-if="parentGlossaryName" class="text-gray-400">{{ parentGlossaryName }} / </span>{{ title }}
                </h1>
                <EntityHistory :created-at="term?.createTime" :created-by="term?.createdBy" :updated-at="term?.updateTime" :updated-by="term?.updatedBy" />
                                <span class="mt-2 text-xs w-1/2 leading-4 text-gray-500">{{
                    shortDescription
                }}</span>
            </div>
        </div>
        <div>
            <a-tabs default-active-key="1" class="border-0">
                <a-tab-pane key="1" tab="Overview">
                    <div class="flex flex-row m-0 p-0">
                        <GlossaryProfileOverview
                            :entity="term"
                            :show-category-count="false"
                            :show-term-count="false"
                        />
                        <div v-if="linkedAssetsCount || term?.guid" class="w-3/4 sidebar overflow-y-scroll ml-9 border-l">
                            <TopAssets v-if="linkedAssetsCount" :term-qualified-name="qualifiedName" />
                            <RelatedTerms v-if="term?.guid" :term="term"/>
                        </div>
                    </div>
                </a-tab-pane>
                <a-tab-pane key="2" tab="Linked Terms">
                   <LinkedAssetsTab :term-qualified-name="qualifiedName" />
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, onMounted } from 'vue'

import GlossaryProfileOverview from '~/components/glossary/common/glossaryProfileOverview.vue'
import TopAssets from '@/glossary/termProfile/topAssets.vue'
import LinkedAssetsTab from '@/glossary/termProfile/linkedAssetsTab.vue'
import EntityHistory from '~/components/glossary/common/entityHistory.vue'
import LoadingView from "@common/loaders/section.vue";
import RelatedTerms from '@/glossary/termProfile/relatedTerms.vue'

import useGTCEntity from '~/composables/glossary/useGtcEntity'

import TermSvg from '~/assets/images/gtc/term/term.png'

interface PropsType {
    id: string
}

export default defineComponent({
  components: {GlossaryProfileOverview, TopAssets, RelatedTerms, LinkedAssetsTab, EntityHistory, LoadingView},
    props: {
        id: {
            type: String,
            required: true,
            default: '',
        },
    },
    setup(props: PropsType) {
        const guid = computed(() => props.id)

        const {
            data: term,
            error,
            isLoading,
            fetchEntity,
        } = useGTCEntity('term')

        const title = computed(() => term.value?.name)
        const shortDescription = computed(() => term.value?.shortDescription)
        const qualifiedName = computed(() => term.value?.qualifiedName)
        const parentGlossaryName = computed(() => term.value?.qualifiedName?.split('@')[1] ?? '')

        const linkedAssetsCount = computed(() => term.value?.assignedEntities?.length ?? 0)

        onMounted(() => {
            fetchEntity(guid.value)
        })

        watch(guid, (newGuid) => {
            fetchEntity(newGuid)
        })

        return {
            term,
            error,
            isLoading,
            guid,
            TermSvg,
            title,
            shortDescription,
            qualifiedName,
            linkedAssetsCount,
            parentGlossaryName
        }
    },
})
</script>
<style>
.sidebar{
     max-height: 70vh
}
</style>

<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
</route>
