<template>
    <div v-if="selectedAsset?.guid" class="z-20 flex flex-col bg-white">
        <AssetPreview
            :mutate-tooltip="true"
            :selected-asset="selectedAsset"
            page="discovery"
            @asset-mutation="() => {}"
        ></AssetPreview>
    </div>
    <div></div>
    <!-- <div
        class="w-full h-full placeholder"
        v-if="selectedAsset.openingPos === 'editor' && activeInlineTab?.queryId"
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
        class="w-full h-full placeholder"
        v-if="
            !selectedAsset.openingPos === 'not_editor' &&
            !activeInlineTab?.queryId
        "
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
    </div> -->
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
    import AssetPreview from '~/components/common/assets/preview/index.vue'
    import useAssetStore from '~/store/asset'

    export default defineComponent({
        components: { AssetPreview },
        props: {},
        setup(props, { emit }) {
            const storeDiscovery = useAssetStore()
            const activeInlineTab = inject(
                'activeInlineTab'
            ) as ComputedRef<activeInlineTabInterface>
            const tabs = inject('inlineTabs') as Ref<activeInlineTabInterface[]>
            const { closeAssetSidebar } = useAssetSidebar(tabs, activeInlineTab)
            const selectedAsset: Ref<any> = computed(() => {
                /* Setting in store */
                storeDiscovery.setSelectedAsset(
                    activeInlineTab.value?.assetSidebar?.assetInfo
                )
                return activeInlineTab.value?.assetSidebar?.assetInfo
            })

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
