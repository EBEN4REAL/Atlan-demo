<template>
    <div v-if="isLoading" class="">
        <LoadingView />
    </div>
    <div v-else class="flex flex-row">
        <div :class="currentTab === '1' || (currentTab === '2' && previewEntity) ? 'w-2/3' : 'w-full'">
            <div class="flex flex-row justify-between px-8 mt-6 mb-5">
                <div class="flex flex-row">
                    <div class="mr-5">
                        <img :src="CategorySvg" />
                    </div>
                    <div class="flex flex-col">
                        <span v-if="parentGlossaryQualifiedName" class="text-gray">
                            {{ parentGlossaryQualifiedName }} /
                        </span>
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
                <a-tabs v-model:activeKey="currentTab" default-active-key="1" class="border-0">
                    <a-tab-pane key="1" tab="Overview">
                        <div class="flex flex-row m-0 px-8">
                            <GlossaryProfileOverview :entity="category" />
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="Terms & Categories">
                    <!-- <CategoryTermsAndCategoriesTab
                        :category-guid="guid"
                        :qualified-name="parentGlossaryQualifiedName"
                    /> -->
                                            <GlossaryTermsAndCategoriesTab
                            :qualified-name="parentGlossaryQualifiedName"
                            :guid="guid"
                            type="AtlasGlossaryCategory"
                            @entityPreview="handleCategoryOrTermPreview"
                        />
                    </a-tab-pane>
                    <a-tab-pane key="4" tab="Bots"> Bots </a-tab-pane>
                    <a-tab-pane key="5" tab="Permissions">
                        Permissions
                    </a-tab-pane>
                </a-tabs>
            </div>
        </div>
        <SidePanel v-if="currentTab === '1'" :entity="category" :topTerms="categoryTerms" />
        <CategoryTermPreview v-if="currentTab === '2' && previewEntity" :entity="previewEntity"  />
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, onMounted, toRef, ref } from 'vue'

import GlossaryProfileOverview from '@/glossary/common/glossaryProfileOverview.vue'
import LoadingView from '@common/loaders/page.vue'
import SidePanel from '@/glossary/sidePanel/index.vue'
import CategoryTermPreview from '@/glossary/common/categoryTermPreview/categoryTermPreview.vue'
import GlossaryTermsAndCategoriesTab from '@/glossary/glossaryTermsAndCategoriesTab.vue'

import useGTCEntity from '~/composables/glossary/useGtcEntity'
import useCategoryTerms from '~/composables/glossary/useCategoryTerms'

import { Glossary, Category, Term } from '~/types/glossary/glossary.interface'

import CategorySvg from '~/assets/images/gtc/category/category.png'

export default defineComponent({
    components: {
        GlossaryProfileOverview,
        GlossaryTermsAndCategoriesTab,
        LoadingView,
        SidePanel,
        CategoryTermPreview
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
        const previewEntity = ref<Category | Term | undefined>();

        const {
            entity: category,
            error,
            isLoading,
        } = useGTCEntity<Category>('category', guid)

        const {
            data: categoryTerms,
            error: termsError,
            isLoading: termsLoading,
            fetchCategoryTermsPaginated,
        } = useCategoryTerms()

        const title = computed(() => category.value?.attributes?.name)

        const shortDescription = computed(
            () => category.value?.attributes?.shortDescription
        )

        const termCount = computed(
            () => category.value?.attributes?.terms?.length ?? 0
        )

        const parentGlossaryQualifiedName = computed(
            () => category.value?.attributes?.qualifiedName?.split('@')[1] ?? ''
        )

        onMounted(() => {
            fetchCategoryTermsPaginated({ guid: guid.value, offset: 0 })
        })

        watch(guid, (newGuid) => {
            fetchCategoryTermsPaginated({
                guid: newGuid,
                refreshSamePage: true,
            })
        })

        const handleCategoryOrTermPreview = (entity: Category | Term) => {
            previewEntity.value = entity;
        }

        return {
            category,
            categoryTerms,
            currentTab,
            previewEntity,
            title,
            shortDescription,
            termCount,
            parentGlossaryQualifiedName,
            error,
            isLoading,
            termsLoading,
            CategorySvg,
            guid,
            handleCategoryOrTermPreview,
        }
    },
})
</script>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
