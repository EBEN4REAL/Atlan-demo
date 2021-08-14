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
                    <Status v-if="entity" :selected-asset="entity" />
                </div>
            </div>
            <div class="mr-8 flex flex-col">
                <div class="text-gray text-sm leading-5 tracking-widest">
                    OWNERS
                </div>
                <Owners v-if="entity" :selected-asset="entity" />
            </div>
            <div class="mr-8 flex flex-col">
                <div class="text-gray text-sm leading-5 tracking-widest">
                    EXPERTS
                </div>
                <Experts v-if="entity" :selected-asset="entity" />
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
import { defineComponent, computed, PropType } from 'vue'

import Readme from '@/common/readme/index.vue'
import Owners from '@/preview/asset/v2/tabs/info/assetDetails/owners.vue'
import Experts from '@/preview/asset/v2/tabs/info/assetDetails/experts.vue'
import Description from '@/preview/asset/v2/tabs/info/assetDetails/description.vue'
import Status from '@/preview/asset/v2/tabs/info/assetDetails/status.vue'

import { Glossary, Category, Term } from '~/types/glossary/glossary.interface'

export default defineComponent({
    components: { Readme, Owners, Description, Status, Experts },
    props: {
        entity: {
            type: Object as PropType<Glossary | Category | Term>,
            required: true,
            default: () => {},
        },
        showCategoryCount: {
            type: Boolean,
            required: true,
            default: false,
        },
        showTermCount: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    setup(props) {
        const shortDescription = computed(
            () => props.entity?.attributes?.shortDescription
        )
        const termCount = computed(() => {
            if (
                props.entity?.typeName === 'AtlasGlossary' ||
                props.entity.typeName === 'AtlasGlossaryCategory'
            ) {
                return props.entity?.attributes?.terms?.length
            }
            return 0;
        })
        const categoryCount = computed(() => {
            if (
                props.entity?.typeName === 'AtlasGlossary'
            ) {
                return props.entity?.attributes?.categories?.length
            }
            return 0;
        }
        )
        const guid = computed(() => props.entity?.guid)
        const showCategoryCountComputed = computed(
            () => props.entity?.typeName === 'AtlasGlossary'
        )
        const showTermCountComputed = computed(
            () => props.entity?.typeName !== 'AtlasGlossaryTerm' 
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