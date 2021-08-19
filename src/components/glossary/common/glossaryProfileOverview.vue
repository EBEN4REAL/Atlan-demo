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
            <div v-if="showTermCountComputed" class="flex flex-col mr-8">
                <span class="secondaryHeading"> TERMS </span>
                <span class="mt-2 text-xl leading-4 text-black">{{
                    termCount
                }}</span>
            </div>
            <!-- <div class="flex flex-col mr-8">
                <span v-if="shortDescription" class="secondaryHeading">
                    SHORT DESCRIPTION
                </span>
                <span class="mt-2 text-xs leading-4 text-gray-500">{{
                    shortDescription
                }}</span>
            </div> -->
        </div>
        <div class="mb-8 flex flex-row">
            <div class="mr-8 flex flex-col">
                <div class="text-gray text-sm leading-5 tracking-widest">
                    STATUS
                </div>
                <div class="mt-2">
                    <a-select
                        mode="multiple"
                        placeholder="No status"
                        style="width: 150px"
                    >
                        <a-select-option
                            v-for="i in 23"
                            :key="(i + 9).toString(36) + i"
                        >
                            {{ (i + 9).toString(36) + i }}
                        </a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="mr-8 flex flex-col">
                <div class="text-gray text-sm leading-5 tracking-widest">
                    OWNERS
                </div>
                <div class="bg-blue-50 w-6 text-blue-700 px-2 mr-2 my-2">+</div>
            </div>
            <div class="mr-8 flex flex-col">
                <div class="text-gray text-sm leading-5 tracking-widest">
                    EXPERTS
                </div>
                <div class="bg-blue-50 text-blue-700 w-6 px-2 mr-2 my-2">+</div>
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
    showTermCount: boolean
}

export default defineComponent({
    components: { Readme },
    props: ['entity', 'showCategoryCount', 'showTermCount'],
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
        const showTermCountComputed = computed(
            () => props.showTermCount ?? true
        )
        return {
            shortDescription,
            termCount,
            categoryCount,
            guid,
            showCategoryCountComputed,
            showTermCountComputed,
        }
    },
})
</script>