<template>
    <div
        class="w-full h-full placeholder"
        v-if="selectedAsset && !activeInlineTab?.queryId"
    >
        <div class="flex items-center justify-between w-full p-3">
            <span
                v-if="activeInlineTab && activeInlineTab?.assetSidebar"
                class="font-bold text-gray"
            >
                Unsaved Tab Screen
            </span>
            <span
                class="flex items-center justify-center"
                @click="() => closeAssetSidebar(activeInlineTab)"
            >
                <fa icon="fal times" class="mb-0 text-lg cursor-pointer" />
            </span>
        </div>
    </div>
    <div
        class="z-20 flex flex-col bg-white"
        v-else-if="selectedAsset && activeInlineTab?.queryId"
    >
        <AssetPreview
            :mutateTooltip="true"
            :selectedAsset="selectedAsset"
            @asset-mutation="() => {}"
            page="discovery"
        ></AssetPreview>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        Ref,
        inject,
        ComputedRef,
        computed,
        ref,
        watch,
    } from 'vue'
    import { activeInlineTabInterface } from '~/types/insights/activeInlineTab.interface'
    import { useAssetSidebar } from '~/components/insights/assetSidebar/composables/useAssetSidebar'
    import AssetPreview from '@/discovery/preview/assetPreview.vue'

    export default defineComponent({
        components: { AssetPreview },
        props: {},
        setup(props, { emit }) {
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
            const { closeAssetSidebar } = useAssetSidebar(tabs, activeInlineTab)
            const selectedAsset: Ref<any> = computed(
                () => activeInlineTab.value?.assetSidebar?.assetInfo
            )

            // watch(
            //     activeInlineTab,
            //     () => {
            //         selectedAsset.value = {
            //             ...activeInlineTab.value?.assetSidebar?.assetInfo,
            //         }
            //     },
            //     { immediate: true }
            // )

            return {
                selectedAsset,
                tabs,
                activeInlineTab,
                closeAssetSidebar,
            }
        },
    })
</script>
<style lang="less" scoped>
    .placeholder {
        background-color: #f4f4f4;
    }
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAuth: true
</route>
