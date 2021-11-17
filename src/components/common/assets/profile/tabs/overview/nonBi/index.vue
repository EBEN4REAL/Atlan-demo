<template>
    <div class="flex flex-col p-6 gap-y-4 max-profile-width">
        <AnnouncementWidget
            :selected-asset="selectedAsset"
        ></AnnouncementWidget>
        <TableSumamry :asset="selectedAsset" />
        <Readme :guid="readmeGuid(selectedAsset)" />
        <Resources :asset="selectedAsset" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    import Resources from '@common/widgets/resources/index.vue'
    import AnnouncementWidget from '@/common/widgets/announcement/index.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Readme from '@/common/widgets/readme/index.vue'
    import TableSumamry from './tableSummary.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        name: 'NonBiOverview',
        components: { AnnouncementWidget, Readme, Resources, TableSumamry },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {
            const { readmeGuid } = useAssetInfo()

            return { readmeGuid }
        },
    })
</script>

<style lang="less" scoped>
    .max-profile-width {
        max-width: calc(100vw - 420px);
    }
</style>
