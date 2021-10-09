<template>
    <div
        class="flex flex-col gap-y-10"
        style="padding: 2rem 1.25rem 2rem 3.75rem"
    >
        <div class="w-full">
            <div
                class="inline-block px-2 py-1 mb-4 font-bold rounded shadow  text-primary"
            >
                Column Preview
            </div>

            <overviewColumns />
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

    // Composables
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import overviewColumns from '~/components/asset/assetProfile/tabs/overview/nonBiAsset/overviewColumns.vue'

    export default defineComponent({
        components: {
            overviewColumns,
        },
        setup() {
            const activePreviewTabKey: Ref<'column-preview' | 'table-preview'> =
                ref('column-preview')

            function setActiveTab(tabName: 'column-preview' | 'table-preview') {
                activePreviewTabKey.value = tabName
            }

            /** INJECTIONS */
            const assetDataInjection = inject('assetData')

            /** COMPUTED */
            const assetData: ComputedRef<assetInterface> = computed(
                () => assetDataInjection?.asset
            )

            /** METHODS */
            // useAssetInfo
            const { assetType } = useAssetInfo()

            const showTablePreview = computed(
                () =>
                    !['TablePartition', 'MaterialisedView'].includes(
                        assetType(assetData.value)
                    )
            )

            return {
                assetData,
                showTablePreview,
                assetType,
                setActiveTab,
                activePreviewTabKey,
            }
        },
    })
</script>
