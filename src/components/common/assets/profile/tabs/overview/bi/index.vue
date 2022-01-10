<template>
    <div class="flex flex-col p-6 gap-y-4">
        <Summary :asset="selectedAsset">
            <template #announcement>
                <AnnouncementWidget
                    :selected-asset="selectedAsset"
                    class="mb-3"
                ></AnnouncementWidget> </template
        ></Summary>
        <Readme :asset="selectedAsset" :isEdit="readmeEditPermission" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    import Summary from '@common/widgets/summary/index.vue'
    import AnnouncementWidget from '@/common/widgets/announcement/index.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Readme from '@/common/widgets/readme/index.vue'

    export default defineComponent({
        name: 'BiOverview',
        components: { AnnouncementWidget, Readme, Summary },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            readmeEditPermission: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
    })
</script>
