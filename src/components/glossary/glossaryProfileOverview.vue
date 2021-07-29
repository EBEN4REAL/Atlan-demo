<template>
    <div class="mb-6 p-0 w-11/12">
        <h2 class="text-gray-500 text-xl leading-7 mt-5 p-0">About</h2>
        <div class="mt-2 flex flex-row mb-10">
            <div v-if="showCategoryCountComputed" class="flex flex-col mr-8">
                <span class="secondaryHeading"> CATEGORIES </span>
                <span class="mt-2 text-xl leading-4 text-black">{{
                    categoryCount
                }}</span>
            </div>
            <div class="flex flex-col mr-8">
                <span class="secondaryHeading"> TERMS </span>
                <span class="mt-2 text-xl leading-4 text-black">{{
                    termCount
                }}</span>
            </div>
            <div class="flex flex-col mr-8">
                <span v-if="shortDescription" class="secondaryHeading">
                    SHORT DESCRIPTION
                </span>
                <span class="mt-2 text-xs leading-4 text-gray-500">{{
                    shortDescription
                }}</span>
            </div>
        </div>
        <Readme
            class="min-w-full"
            placeholder="Add some details here..."
            :parent-asset-id="guid"
        />
    </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'

import Readme from '@/common/readme/index.vue'

import { Components } from '~/api/atlas/client'

interface PropsType {
    entity: Components.Schemas.AtlasGlossary
    showCategoryCount: boolean
}

export default defineComponent({
    components: { Readme },
    props: ['entity', 'showCategoryCount'],
    setup(props: PropsType) {
        const shortDescription = computed(() => props.entity?.shortDescription)
        const termCount = computed(() => props.entity?.terms?.length ?? 0)
        const categoryCount = computed(
            () => props.entity?.categories?.length ?? 0
        )
        const guid = computed(() => props.entity?.guid)
        const showCategoryCountComputed = computed(
            () => props.showCategoryCount ?? true
        )
        return {
            shortDescription,
            termCount,
            categoryCount,
            guid,
            showCategoryCountComputed,
        }
    },
})
</script>