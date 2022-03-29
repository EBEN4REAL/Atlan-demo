<template>
    <div
        v-if="cmList(assetType(selectedAsset), false, true).length > 0"
        class="flex flex-col"
    >
        <p class="flex items-center justify-between mb-1 text-sm text-gray-500">
            Custom Metadata
        </p>
        <!--  Checking for overview flag -->
        <div
            v-for="(tab, index) in cmList(
                assetType(selectedAsset),
                false,
                true
            )"
            :key="index"
        >
            <SingleTab
                :selected-asset="asset"
                :data="tab"
                :is-drawer="isDrawer"
                :loading="isCmLoading"
                :is-cm-ready="isCmReady"
                :tab="{
                    image: tab.options?.imageId || tab.options?.logoUrl,
                    emoji: tab.options?.emoji,
                    name: tab.label,
                    tooltip: tab.label,
                }"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        computed,
        toRefs,
        ref,
        watch,
    } from 'vue'

    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useCustomMetadataFacet from '~/composables/custommetadata/useCustomMetadataFacet'
    import SingleTab from './singleTab.vue'
    import { useTypedefStore } from '~/store/typedef'
    import { useAssetAttributes } from '~/composables/discovery/useCurrentUpdate'

    export default defineComponent({
        name: 'CustomMetadata',
        components: { SingleTab },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            isDrawer: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            const { assetType } = useAssetInfo()
            const guid = ref()

            const { getList: cmList } = useCustomMetadataFacet()

            const typedefStore = useTypedefStore()

            const tabList = computed(() =>
                cmList(assetType(selectedAsset.value), false, true)
            )

            const customMetadataListProjections = computed(() => {
                const projections = []

                tabList.value.map((tab) =>
                    projections.push(
                        ...typedefStore.getCustomMetadataListProjectionsByName(
                            tab?.id
                        )
                    )
                )

                return projections
            })

            const {
                asset,
                mutate: mutateCM,
                isReady: isCmReady,
                isLoading: isCmLoading,
            } = useAssetAttributes({
                id: guid,
                attributes: customMetadataListProjections,
            })

            watch(
                () => selectedAsset.value.guid,
                () => {
                    guid.value = selectedAsset.value?.guid
                    mutateCM()
                },
                {
                    immediate: true,
                }
            )

            return { cmList, assetType, isCmLoading, isCmReady, asset }
        },
    })
</script>
