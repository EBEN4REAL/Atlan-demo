<template>
    <div class="flex flex-col p-6 gap-y-4">
        <AnnouncementWidget :selectedAsset="selectedAsset"></AnnouncementWidget>
        <Readme :selectedAsset="selectedAsset" />

        <Resources :asset="selectedAsset" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    import AnnouncementWidget from '@/common/widgets/announcement/index.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Readme from '@/common/widgets/readme/index.vue'
    import Resources from '@common/resources/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import { toRefs } from 'vue'

    export default defineComponent({
        name: 'Overview',
        components: { AnnouncementWidget, Readme, Resources },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: false,
            },
        },
        setup(props) {
            const { readmeGuid } = useAssetInfo()

            const { selectedAsset } = toRefs(props)

            return { readmeGuid, selectedAsset }
        },
    })
</script>
