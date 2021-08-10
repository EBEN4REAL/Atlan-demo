<template>
    <div class="py-6 w-full">
        <h2 class="text-gray-700 text-xl leading-7 ml-6">Top Assets</h2>
        <div
            v-if="isLoading"
            class="w-full mt-24 items-center min-h-full justify-center"
        >
            <LoadingView />
        </div>
        <div
            v-else-if="assetCount && !isLoading"
            class="max-h-80 overflow-y-scroll flex flex-col text-left"
        >
            <div v-for="(asset, index) in assets" :key="asset.qualifiedName">
                <Item
                    :item="asset"
                    :projection="['heirarchy', 'description']"
                />
            </div>
        </div>
        <div class="items-start">
            <a-button type="link">See all {{ assetCount }} assets -></a-button>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, computed, onMounted, watch } from 'vue'
import Item from '@/discovery/asset/list/item.vue'
import LoadingView from '@common/loaders/section.vue'

import useTermLinkedAssets from '~/composables/glossary/useTermLinkedAssets'

interface PropsType {
    termQualifiedName: string
    termCount: number
}

export default defineComponent({
    components: { Item, LoadingView },
    props: ['termQualifiedName', 'termCount'],
    setup(props: PropsType) {
        const termName = computed(() => props.termQualifiedName)

        const { linkedAssets, isLoading, error, fetchLinkedAssets } =
            useTermLinkedAssets()

        const assets = computed(() => linkedAssets.value?.entities)
        const assetCount = computed(() => assets.value?.length ?? 0)
        const numberOfTerms = computed(() => props.termCount ?? 5)

        onMounted(() => {
            if (termName.value) fetchLinkedAssets(termName.value)
        })

        watch(termName, (newTermName) => {
            if (newTermName) fetchLinkedAssets(newTermName)
        })

        return {
            termName,
            isLoading,
            assets,
            assetCount,
            numberOfTerms,
        }
    },
})
</script>