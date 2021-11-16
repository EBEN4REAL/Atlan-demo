<template>
    <div class="flex flex-col p-6 gap-y-4">
        <AnnouncementWidget
            :selected-asset="selectedAsset"
        ></AnnouncementWidget>
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
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        name: 'BiOverview',
        components: { AnnouncementWidget, Readme, Resources },
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
