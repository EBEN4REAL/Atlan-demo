<template>
    <div class="px-12 pr-0 mb-12">
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
                        <div v-if="linkedAssetsCount" class="flex flex-column w-3/4 ml-9 border-l">
                            <TopAssets  :term-qualified-name="qualifiedName" />
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

import GlossaryProfileOverview from '@/glossary/glossaryProfileOverview.vue'
import TopAssets from '@/glossary/termProfile/topAssets.vue'
import LinkedAssetsTab from '@/glossary/termProfile/linkedAssetsTab.vue'
import EntityHistory from '@/glossary/entityHistory.vue'


import useGTCEntity from '~/composables/glossary/useGtcEntity'

import TermSvg from '~/assets/images/gtc/term/term.png'

interface PropsType {
    id: string
}

export default defineComponent({
  components: {GlossaryProfileOverview, TopAssets, LinkedAssetsTab, EntityHistory},
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

<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
</route>
