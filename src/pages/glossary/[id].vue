<template>
    <div v-if="isLoading">
        <LoadingView />
    </div>
    <div v-else class="px-12 pr-0 mb-12">
        <div class="flex flex-row mt-6 mb-5">
            <div class="mr-5">
                <img :src="GlossarySvg" />
            </div>
            <div class="flex flex-col">
                <span class="secondaryHeading">GLOSSARY</span>
                <h1 class="text-3xl leading-9 m-0 p-0 text-black font-normal">
                    {{ title }}
                </h1>
                <EntityHistory
                    :created-at="glossary?.createTime"
                    :created-by="glossary?.createdBy"
                    :updated-at="glossary?.updateTime"
                    :updated-by="glossary?.updatedBy"
                />
                <span class="mt-2 text-xs w-1/2 leading-4 text-gray-500">{{
                    shortDescription
                }}</span>
            </div>
        </div>
        <div>
            <a-tabs default-active-key="1" class="border-0">
                <a-tab-pane key="1" tab="Overview">
                    <div class="flex flex-row m-0 p-0">
                        <GlossaryProfileOverview :entity="glossary" typeName="AtlasGlossary" />
                        <div
                            v-if="termCount"
                            class="flex flex-column w-1/2 ml-9 border-l"
                        >
                            <GlossaryTopTerms
                                v-if="glossaryTerms?.length && !termsLoading"
                                :terms="glossaryTerms"
                            />
                        </div>
                    </div>
                    <hr />
                    <GlossaryContinueSettingUp
                        v-if="!isLoading"
                        :terms="glossaryTerms"
                        :categories="glossaryCategories"
                        @updateDescription="refreshCategoryTermList"
                        @fetchNextCategoryOrTermList="fetchNextCategoryOrTermList"
                    />
                </a-tab-pane>
                <a-tab-pane key="2" tab="Terms & Categories">
                    <GlossaryTermsAndCategoriesTab
                        :qualified-name="qualifiedName"
                    />
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
import { defineComponent, computed, watch, onMounted, toRef } from 'vue'

import GlossaryTermsAndCategoriesTab from '@/glossary/glossaryTermsAndCategoriesTab.vue'
import LoadingView from '@common/loaders/page.vue'
import GlossaryProfileOverview from '@/glossary/common/glossaryProfileOverview.vue'
import GlossaryTopTerms from '@/glossary/common/glossaryTopTerms.vue'
import GlossaryContinueSettingUp from '@/glossary/continueSettingUp/glossaryContinueSettingUp.vue'
import EntityHistory from '@/glossary/common/entityHistory.vue'

import useGTCEntity from '~/composables/glossary/useGtcEntity'
import useGlossaryTerms from '~/composables/glossary/useGlossaryTerms'
import useGlossaryCategories from '~/composables/glossary/useGlossaryCategories'

import GlossarySvg from '~/assets/images/gtc/glossary/glossary.png'

export default defineComponent({
    components: {
        GlossaryProfileOverview,
        GlossaryTopTerms,
        GlossaryContinueSettingUp,
        GlossaryTermsAndCategoriesTab,
        EntityHistory,
        LoadingView,
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
            data: glossary,
            error,
            isLoading,
        } = useGTCEntity('glossary', guid)
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

        const title = computed(() => glossary.value?.name)
        const shortDescription = computed(
            () => glossary.value?.shortDescription
        )
        const termCount = computed(() => glossary.value?.terms?.length ?? 0)
        const categoryCount = computed(
            () => glossary.value?.categories?.length ?? 0
        )
        const qualifiedName = computed(
            () => glossary.value?.qualifiedName ?? ''
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
            termCount,
            categoryCount,
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
