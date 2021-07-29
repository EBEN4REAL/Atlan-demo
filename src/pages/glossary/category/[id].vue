<template>
    <div class="px-12 pr-0 mb-12">
        <div class="flex flex-row mt-6 mb-5">
            <div class="mr-5">
                <img :src="CategorySvg" />
            </div>
            <div class="flex flex-col">
                <span class="secondaryHeading">CATEGORY</span>
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
                            :entity="category"
                            :show-category-count="false"
                        />
                        <div v-if="termCount" class="flex flex-column w-1/2 ml-9 border-l">
                            <GlossaryTopTerms
                                v-if="categoryTerms?.length"
                                :terms="categoryTerms"
                            />
                        </div>
                    </div>
                </a-tab-pane>
                <a-tab-pane key="2" tab="Linked Terms">
                    Linked Terms
                </a-tab-pane>
            </a-tabs>
        </div>
        <!-- <hr /> -->
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, onMounted } from 'vue'

import GlossaryProfileOverview from '@/glossary/glossaryProfileOverview.vue'
import GlossaryTopTerms from '@/glossary/glossaryTopTerms.vue'

import useGTCEntity from '~/composables/glossary/useGtcEntity'
import useCategoryTerms from '~/composables/glossary/useCategoryTerms'

import CategorySvg from '~/assets/images/gtc/category/category.png'

interface Proptype {
    id: string
}

export default defineComponent({
    components: {
        GlossaryProfileOverview,
        GlossaryTopTerms,
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
            data: category,
            error,
            isLoading,
            fetchEntity,
        } = useGTCEntity('category')

        const {
            data: categoryTerms,
            error: termsError,
            isLoading: termsLoading,
            fetchCategoryTermsPaginated,
        } = useCategoryTerms()

        const title = computed(() => category.value?.name)
        const shortDescription = computed(
            () => category.value?.shortDescription
        )
        const termCount = computed(() => category.value?.terms?.length ?? 0)
        onMounted(() => {
            fetchEntity(guid.value)
            fetchCategoryTermsPaginated({ guid: guid.value, offset: 0 })
        })

        watch(guid, (newGuid) => {
            fetchEntity(newGuid)
            fetchCategoryTermsPaginated({
                guid: newGuid,
                refreshSamePage: true,
            })
        })

        return {
            category,
            categoryTerms,
            title,
            shortDescription,
            termCount,
            error,
            isLoading,
            CategorySvg,
            guid,
        }
    },
})
</script>

<route lang="yaml">
  meta:
    layout: default
    requiresAuth: true
</route>
