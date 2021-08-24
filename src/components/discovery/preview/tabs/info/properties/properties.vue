<template>
    <div class="flex flex-col space-y-3">
        <div class="px-2">
            <p class="mb-1 text-sm tracking-wide text-gray-500">
                Unique ID (GUID)
            </p>
            <p class="mb-0 text-gray-700">{{ selectedAsset?.guid }}</p>
        </div>
        <div class="px-2">
            <p class="mb-1 text-sm tracking-wide text-gray-500">Last updated</p>
            <p class="mb-0 text-gray-700">
                {{ updatedAt(selectedAsset) }}
                ago,
                {{ modifiedBy(selectedAsset) }}
            </p>
        </div>
        <div class="px-2">
            <p class="mb-1 text-sm tracking-wide text-gray-500">Created</p>
            <p class="mb-0 text-gray-700">
                {{ createdAt(selectedAsset) }}
                ago,
                {{ createdBy(selectedAsset) }}
            </p>
        </div>
        <div class="px-2">
            <p class="mb-1 text-sm tracking-wide text-gray-500">
                Popularity Score
            </p>
            <p class="mb-0 text-gray-700">
                {{ popularityScore(selectedAsset) }}
            </p>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/asset/useAssetInfo'

    export default defineComponent({
        components: {},
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const {
                createdAt,
                updatedAt,
                createdBy,
                modifiedBy,
                popularityScore,
            } = useAssetInfo()
            return {
                createdAt,
                updatedAt,
                createdBy,
                modifiedBy,
                popularityScore,
            }
        },
    })
</script>

<style lang="less" module></style>
