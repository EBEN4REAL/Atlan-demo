<template>
    <div
        class="flex flex-col gap-y-10"
        style="padding: 2rem 1.25rem 2rem 3.75rem"
    >
        <div class="w-full">
            <div
                class="
                    inline-block
                    px-2
                    py-1
                    mb-4
                    font-bold
                    rounded
                    shadow
                    text-primary
                "
            >
                Column Preview
            </div>

            <ColumnWidget />
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        inject,
        computed,
        ref,
        defineAsyncComponent,
        Ref,
        ComputedRef,
    } from 'vue'
    import { storeToRefs } from 'pinia'

    // Composables
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    import ColumnWidget from './columnWidget.vue'
    import useAssetStore from '~/store/asset'

    export default defineComponent({
        components: {
            ColumnWidget,
        },
        setup() {
            const activePreviewTabKey: Ref<'column-preview' | 'table-preview'> =
                ref('column-preview')

            function setActiveTab(tabName: 'column-preview' | 'table-preview') {
                activePreviewTabKey.value = tabName
            }

            /** INJECTIONS */

            /** METHODS */
            // useAssetInfo
            const { assetType } = useAssetInfo()
            const discoveryStore = useAssetStore()
            const { selectedAsset } = storeToRefs(discoveryStore)

            const showTablePreview = computed(
                () =>
                    !['TablePartition', 'MaterialisedView'].includes(
                        assetType(selectedAsset.value)
                    )
            )

            return {
                showTablePreview,
                assetType,
                setActiveTab,
                activePreviewTabKey,
                selectedAsset,
            }
        },
    })
</script>
