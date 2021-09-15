<template>
    <div class="w-full px-5">
        <Description
            :selected-asset="selectedAsset"
            @update:selected-asset="mutateSelectedAsset"
        />
        <Owners
            v-if="page === 'BiOverview'"
            :selected-asset="selectedAsset"
            @update:selected-asset="mutateSelectedAsset"
        />

        <Status
            v-if="page === 'BiOverview'"
            :selected-asset="selectedAsset"
            @update:selected-asset="mutateSelectedAsset"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, inject } from 'vue'
    import Description from '@common/sidebar/description.vue'
    import Owners from '@common/sidebar/owners.vue'
    import Experts from '@common/sidebar/experts.vue'
    import Status from '@common/sidebar/status.vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        name: 'AssetDetails',
        components: {
            Experts,
            Description,
            Status,
            Owners,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            page: {
                type: String,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            const mutateSelectedAsset: (updatedAsset: assetInterface) => void =
                inject('mutateSelectedAsset', () => {})

            return {
                mutateSelectedAsset,
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
</style>
