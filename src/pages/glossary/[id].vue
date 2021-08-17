<template>
    <div v-if="isLoading">
        <LoadingView />
    </div>
    <div v-else class="flex flex-row">
        <div class="px-12 pr-0">
            <div class="flex flex-row justify-between mt-6 mb-5">
                <div class="flex flex-row">
                    <div class="mr-5">
                        <img :src="GlossarySvg" />
                    </div>
                    <div class="flex flex-col">
                        <span class="text-xl leading-6 font-bold">{{
                            title
                        }}</span>
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
                <a-tabs default-active-key="1" class="border-0">
                    <a-tab-pane key="1" tab="Overview">
                        <div class="flex flex-row m-0 p-0">
                            <GlossaryProfileOverview :entity="glossary" />
                        </div>
                        <hr />
                        <GlossaryContinueSettingUp
                            v-if="!isLoading"
                            :terms="glossaryTerms"
                            :categories="glossaryCategories"
                            @updateDescription="refreshCategoryTermList"
                            @fetchNextCategoryOrTermList="
                                fetchNextCategoryOrTermList
                            "
                        />
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="Terms & Categories">
                        <GlossaryTermsAndCategoriesTab
                            :qualified-name="qualifiedName"
                        />
                    </a-tab-pane>
                    <a-tab-pane key="3" tab="Activity"> Activity </a-tab-pane>
                    <a-tab-pane key="4" tab="Bots"> Bots </a-tab-pane>
                    <a-tab-pane key="5" tab="Permissions">
                        Permissions
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>
        <SidePanel :entity="glossary" :topTerms="glossaryTerms" />
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, onMounted, toRef } from 'vue'

import GlossaryTermsAndCategoriesTab from '@/glossary/glossaryTermsAndCategoriesTab.vue'
import LoadingView from '@common/loaders/page.vue'
import GlossaryProfileOverview from '@/glossary/common/glossaryProfileOverview.vue'
import GlossaryContinueSettingUp from '@/glossary/continueSettingUp/glossaryContinueSettingUp.vue'
import EntityHistory from '@/glossary/common/entityHistory.vue'
import SidePanel from '@/glossary/sidePanel/index.vue'

import useGTCEntity from '~/composables/glossary/useGtcEntity'
import useGlossaryTerms from '~/composables/glossary/useGlossaryTerms'
import useGlossaryCategories from '~/composables/glossary/useGlossaryCategories'

import { Glossary } from '~/types/glossary/glossary.interface'

import GlossarySvg from '~/assets/images/gtc/glossary/glossary.png'

export default defineComponent({
    components: {
        GlossaryProfileOverview,
        GlossaryContinueSettingUp,
        GlossaryTermsAndCategoriesTab,
        EntityHistory,
        LoadingView,
        SidePanel,
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

        const {
            entity: glossary,
            error,
            isLoading,
        } = useGTCEntity<Glossary>('glossary', guid)

        const {
            terms: glossaryTerms,
            error: termsError,
            isLoading: termsLoading,
            fetchGlossaryTermsPaginated,
        } = useGlossaryTerms()

        const {
            categories: glossaryCategories,
            error: categoriesError,
            isLoading: categoriesLoading,
            fetchGlossaryCategoriesPaginated,
        } = useGlossaryCategories()

        const title = computed(() => glossary.value?.attributes?.name)
        const shortDescription = computed(
            () => glossary.value?.attributes?.shortDescription
        )
        const qualifiedName = computed(
            () => glossary.value?.attributes?.qualifiedName ?? ''
        )

        onMounted(() => {
            fetchGlossaryTermsPaginated({ guid: guid.value, offset: 0 })
            fetchGlossaryCategoriesPaginated({ guid: guid.value, offset: 0 })
        })

        watch(guid, (newGuid) => {
            fetchGlossaryTermsPaginated({
                guid: newGuid,
                offset: 0,
            })
            fetchGlossaryCategoriesPaginated({
                guid: newGuid,
                offset: 0,
            })
        })

        const refreshCategoryTermList = (type: string) => {
            if (type === 'category') {
                fetchGlossaryCategoriesPaginated({
                    refreshSamePage: true,
                })
            } else if (type === 'term') {
                fetchGlossaryTermsPaginated({ refreshSamePage: true })
            }
        }

        const fetchNextCategoryOrTermList = (type: string) => {
            if (type === 'category') {
                fetchGlossaryCategoriesPaginated({
                    limit: 5,
                })
            } else if (type === 'term') {
                fetchGlossaryTermsPaginated({ limit: 5 })
            }
        }

        return {
            glossary,
            title,
            shortDescription,
            error,
            isLoading,
            termsLoading,
            GlossarySvg,
            guid,
            glossaryTerms,
            glossaryCategories,
            qualifiedName,
            refreshCategoryTermList,
            fetchNextCategoryOrTermList,
        }
    },
})
</script>
<style lang="less">
.secondaryHeading {
    @apply tracking-widest text-xs text-gray leading-5;
}
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
