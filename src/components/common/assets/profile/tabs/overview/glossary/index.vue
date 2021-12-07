<template>
    <div class="flex flex-col p-6 gap-y-4">
        <AnnouncementWidget
            :selected-asset="selectedAsset"
        ></AnnouncementWidget>
        <Summary :asset="selectedAsset" />
        <Readme :asset="selectedAsset" />
        <!-- <Resources :asset="selectedAsset" /> -->
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import Resources from '@common/widgets/resources/index.vue'
import Summary from '@common/widgets/summary/index.vue'
import AnnouncementWidget from '@/common/widgets/announcement/index.vue'
import { assetInterface } from '~/types/assets/asset.interface'
import Readme from '@/common/widgets/readme/index.vue'

export default defineComponent({
    name: 'GlossaryOverview',
    components: { AnnouncementWidget, Readme, Resources, Summary },
    props: {
        selectedAsset: {
            type: Object as PropType<assetInterface>,
            required: true,
        },
    },
})
</script>
