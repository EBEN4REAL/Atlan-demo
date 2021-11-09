<!-- TODO: remove hardcoded prop classes and make component generic -->
<template>
    <div class="flex flex-col p-4 bg-primary-light gap-y-4">
        <AnnouncementWidget :selectedAsset="selectedAsset"></AnnouncementWidget>
        <Readme :entity="selectedAsset" />
        <Resources :asset="selectedAsset" />
    </div>
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
                required: false,
            },
        },
        setup() {},
    })
</script>
