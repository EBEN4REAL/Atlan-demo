<template>
    <div class="px-12 pr-0 mb-12">
        <div class="flex flex-row mt-6 mb-5">
            <div class="mr-5">
                <img :src="TermSvg" />
            </div>
            <div class="flex flex-col">
                <span class="secondaryHeading">TERM</span>
                <h1 class="text-3xl leading-9 m-0 p-0 text-black font-normal">
                    {{ title }}
                </h1>
                <div class="text-sm leading-6 text-gray-400 font-normal">
                    <span class="mr-3">Cerated 2 weeks ago by @anshul</span>
                    <span>&bull;</span>
                    <span class="ml-3">Edited 1 week ago by @anshul</span>
                </div>
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
                            <TopAssets  :term-quallified-name="qualifiedName" />
                        </div>
                    </div>
                </a-tab-pane>
                <a-tab-pane key="2" tab="Linked Terms">
                    Linked Terms
                </a-tab-pane>
            </a-tabs>
        </div>
        <!-- {{ term }} -->

    </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, onMounted } from 'vue'

import GlossaryProfileOverview from '@/glossary/glossaryProfileOverview.vue'
import TopAssets from '@/glossary/termProfile/topAssets.vue'


import useGTCEntity from '~/composables/glossary/useGtcEntity'

import TermSvg from '~/assets/images/gtc/term/term.png'

interface PropsType {
    id: string
}

export default defineComponent({
  components: {GlossaryProfileOverview, TopAssets},
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
            linkedAssetsCount
        }
    },
})
</script>

<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
</route>
