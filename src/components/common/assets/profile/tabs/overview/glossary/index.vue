<template>
    <div class="flex flex-col p-6 gap-y-4">
        <!-- hidden for GA -->
        <!-- <BulkUploadProgress
            v-if="selectedAsset?.typeName === 'AtlasGlossary'"
            :entity="selectedAsset"
        /> -->

        <Summary :asset="selectedAsset">
            <template #announcement>
                <AnnouncementWidget
                    :selected-asset="selectedAsset"
                    class="mb-4"
                ></AnnouncementWidget>
            </template>
        </Summary>
        <Readme :asset="selectedAsset" :is-edit="readmeEditPermission" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    import Summary from '@common/widgets/summary/index.vue'
    import AnnouncementWidget from '@/common/widgets/announcement/index.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Readme from '@/common/widgets/readme/index.vue'
    import BulkUploadProgress from '~/components/common/widgets/bulkUploadProgress/progressWidget.vue'

    export default defineComponent({
        name: 'GlossaryOverview',
        components: { AnnouncementWidget, Readme, Summary, BulkUploadProgress },
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
