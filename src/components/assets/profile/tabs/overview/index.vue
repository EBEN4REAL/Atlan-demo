<!-- TODO: remove hardcoded prop classes and make component generic -->
<template>
    <!-- <AnnouncementWidget :selectedAsset="selectedAsset"></AnnouncementWidget> -->
    <Readme :entity="selectedAsset" />
    <Resources :asset="selectedAsset" />
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    import AnnouncementWidget from '@/common/widgets/announcement/index.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Readme from '@common/readme/index.vue'
    import Resources from '@common/resources/index.vue'

    export default defineComponent({
        name: 'Overview',
        components: { AnnouncementWidget, Readme, Resources },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {},
    })
</script>
