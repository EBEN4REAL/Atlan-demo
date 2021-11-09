<!-- TODO: remove hardcoded prop classes and make component generic -->
<template>
    <AnnouncementWidget :selectedAsset="selectedAsset"></AnnouncementWidget>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    import AnnouncementWidget from '@/common/widgets/announcement/index.vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        name: 'Overview',
        components: { AnnouncementWidget },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {},
    })
</script>
