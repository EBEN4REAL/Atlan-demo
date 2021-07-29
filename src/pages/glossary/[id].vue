<template>
    <div class="px-12 pr-0 mb-12">
        <div class="flex flex-row mt-6 mb-5">
            <div class="mr-5">
                <img :src="GlossarySvg" />
            </div>
            <div class="flex flex-col">
                <span class="secondaryHeading">GLOSSARY</span>
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
                        <GlossaryProfileOverview :entity="glossary" />
                        <div v-if="termCount" class="flex flex-column w-1/2 ml-9 border-l">
                            <GlossaryTopTerms
                                v-if="glossaryTerms?.length"
                                :terms="glossaryTerms"
                            />
                        </div>
                    </div>
                    <hr />
                    <GlossaryContinueSettingUp
                        :terms="glossaryTerms"
                        :categories="glossaryCategories"
                    />
                </a-tab-pane>
                <a-tab-pane key="2" tab="Terms & Categories">
                    Terms & Categories
                </a-tab-pane>
                <a-tab-pane key="3" tab="Activity"> Activity </a-tab-pane>
                <a-tab-pane key="4" tab="Bots"> Bots </a-tab-pane>
                <a-tab-pane key="5" tab="Permissions"> Permissions </a-tab-pane>
            </a-tabs>
        </div>
        <!-- <hr /> -->
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, onMounted } from 'vue'

import GlossaryProfileOverview from '@/glossary/glossaryProfileOverview.vue'
import GlossaryTopTerms from '@/glossary/glossaryTopTerms.vue'
import GlossaryContinueSettingUp from '@/glossary/glossaryContinueSettingUp.vue'

import useGTCEntity from '~/composables/glossary/useGtcEntity'
import useGlossaryTerms from '~/composables/glossary/useGlossaryTerms'
import useGlossaryCategories from '~/composables/glossary/useGlossaryCategories'

import GlossarySvg from '~/assets/images/gtc/glossary/glossary.png'

interface Proptype {
    id: string
}

export default defineComponent({
    components: {
        GlossaryProfileOverview,
        GlossaryTopTerms,
        GlossaryContinueSettingUp,
    },
    props: {
        id: {
            type: String,
            required: true,
            default: '',
        },
    },
    setup(props: Proptype) {
        const guid = computed(() => props.id)

        const {
            data: glossary,
            error,
            isLoading,
            fetchEntity,
        } = useGTCEntity('glossary')
        const {
            data: glossaryTerms,
            error: termsError,
            loading: termsLoading,
            fetchGlossaryTermsPaginated,
        } = useGlossaryTerms()
        const {
            categories: glossaryCategories,
            error: categoriesError,
            loading: categoriesLoading,
            fetchGlossaryCategoriesPaginated,
        } = useGlossaryCategories()

        const title = computed(() => glossary.value?.name)
        const shortDescription = computed(
            () => glossary.value?.shortDescription
        )
        const termCount = computed(() => glossary.value?.terms?.length ?? 0)
        const categoryCount = computed(() => glossary.value?.categories?.length ?? 0)
        onMounted(() => {
            fetchEntity(guid.value)
            fetchGlossaryTermsPaginated({ guid: guid.value, offset: 0 })
            fetchGlossaryCategoriesPaginated({ guid: guid.value, offset: 0 })
        })

        watch(guid, (newGuid) => {
            fetchEntity(newGuid)
            fetchGlossaryTermsPaginated({
                guid: newGuid,
                refreshSamePage: true,
            })
            fetchGlossaryCategoriesPaginated({
                guid: newGuid,
                refreshSamePage: true,
            })
        })

        return {
            glossary,
            title,
            shortDescription,
            termCount,
            categoryCount,
            error,
            isLoading,
            GlossarySvg,
            guid,
            glossaryTerms,
            glossaryCategories,
        }
    },
})
</script>
<style lang="less">
.secondaryHeading {
    @apply tracking-widest text-xs text-gray-400 leading-5;
}
</style>

<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
</route>