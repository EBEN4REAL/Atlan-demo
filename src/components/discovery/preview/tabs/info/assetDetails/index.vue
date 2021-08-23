<template>
    <div class="w-full px-5">
        <div
            class="flex items-center w-full gap-16 mb-4"
            v-if="isSelectedAssetHaveRowsAndColumns(selectedAsset)"
        >
            <RowInfoHoverCard :rowCount="rows">
                <div class="flex flex-col text-sm cursor-pointer">
                    <span class="mb-2 text-sm text-gray-500">Rows</span>
                    <span class="text-gray-700">{{ rows }}</span>
                </div>
            </RowInfoHoverCard>
            <div class="flex flex-col text-sm">
                <span class="mb-2 text-sm text-gray-500">Cols</span>
                <span class="text-gray-700">{{ cols }}</span>
            </div>
        </div>
        <Description v-if="selectedAsset.guid" :selectedAsset="selectedAsset" />
        <div class="flex w-full text-sm text-gray-500">
            <Owners v-if="selectedAsset.guid" :selectedAsset="selectedAsset" />
        </div>
        <div class="flex w-full text-sm text-gray-500">
            <Experts v-if="selectedAsset.guid" :selectedAsset="selectedAsset" />
        </div>
        <Status v-if="selectedAsset.guid" :selectedAsset="selectedAsset" />
    </div>
</template>

<script lang="ts">
    import RowInfoHoverCard from '@/discovery/preview/hovercards/rowInfo.vue'
    import { computed, defineComponent, PropType, toRefs } from 'vue'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Description from './description.vue'
    import Experts from './experts.vue'
    import Owners from './owners.vue'
    import Status from './status.vue'

    export default defineComponent({
        name: 'AssetDetails',
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        components: {
            Experts,
            Description,
            Status,
            Owners,
            RowInfoHoverCard,
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)

            const { rowCount, columnCount } = useAssetInfo()

            const rows = computed(() =>
                selectedAsset.value ? rowCount(selectedAsset.value, true) : '~'
            )
            const cols = computed(() =>
                selectedAsset.value
                    ? columnCount(selectedAsset.value, true)
                    : '~'
            )
            function isSelectedAssetHaveRowsAndColumns(
                selectedAsset: assetInterface
            ) {
                if (selectedAsset.typeName == 'View') return true
                else if (selectedAsset.typeName == 'Table') return true
                else return false
            }

            return {
                rows,
                cols,
                selectedAsset,
                isSelectedAssetHaveRowsAndColumns,
            }
        },
    })
</script>
<style lang="less" scoped>
    ._bg-primary-light {
        background: rgba(34, 81, 204, 0.05);
    }
    .hover_bg-primary-light:hover {
        background: rgba(34, 81, 204, 0.05);
    }
    .owner-expert {
        // margin-top: 0.3rem;
        // margin-bottom: 0.3rem;
    }
</style>
