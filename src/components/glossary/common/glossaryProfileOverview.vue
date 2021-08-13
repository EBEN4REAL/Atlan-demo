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
                    <Status
                        v-if="selectedAsset.guid"
                        :selectedAsset="selectedAsset"
                    />
                </div>
            </div>
            <div class="mr-8 flex flex-col">
                <div class="text-gray text-sm leading-5 tracking-widest">
                    OWNERS
                </div>
                <Owners
                    v-if="selectedAsset.guid"
                    :selectedAsset="selectedAsset"
                />
            </div>
            <div class="mr-8 flex flex-col">
                <div class="text-gray text-sm leading-5 tracking-widest">
                    EXPERTS
                </div>
                <Experts
                    v-if="selectedAsset.guid"
                    :selectedAsset="selectedAsset"
                />
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
import { defineComponent, computed, ref } from 'vue'

import Readme from '@/common/readme/index.vue'
import Owners from '@/preview/asset/v2/tabs/info/assetDetails/owners.vue'
import Experts from '@/preview/asset/v2/tabs/info/assetDetails/experts.vue'
import Description from '@/preview/asset/v2/tabs/info/assetDetails/description.vue'
import Status from '@/preview/asset/v2/tabs/info/assetDetails/status.vue'

import { Components } from '~/api/atlas/client'

interface PropsType {
    entity: Components.Schemas.AtlasGlossary
    showCategoryCount: boolean
    showTermCount: boolean
    typeName: 'AtlasGlossary' | 'AtlasGlossaryCategory' | 'AtlasGlossaryTerm'
}

export default defineComponent({
    components: { Readme, Owners, Description, Status, Experts },
    props: ['entity', 'showCategoryCount', 'showTermCount', 'typeName'],
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
        const selectedAsset = ref({
            attributes: {
                ownerUsers: props.entity.ownerUsers ?? '',
                ownerGroups: props.entity.ownerGroups ?? '',
                assetStatus: props.entity.assetStatus ?? '',
                qualifiedName: props.entity.qualifiedName ?? '',
                assetStatusUpdatedBy: props.entity.assetStatusUpdatedBy,
                assetStatusUpdatedAt:props.entity.assetStatusUpdatedAt,
                name: props.entity.name ?? '',
                tenantId: 'default',
            },
            anchor: props.entity.anchor,
            guid: props.entity.guid,
            typeName: props.typeName,
        })
        return {
            shortDescription,
            termCount,
            categoryCount,
            guid,
            showCategoryCountComputed,
            showTermCountComputed,
            selectedAsset,
        }
    },
})
</script>