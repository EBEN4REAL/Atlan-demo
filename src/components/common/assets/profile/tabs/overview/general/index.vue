<template>
    <div class="flex flex-col p-6 gap-y-4">
        <AnnouncementWidget
            :selected-asset="selectedAsset"
        ></AnnouncementWidget>

        <Readme
            v-if="readmeContent(selectedAsset) || !readOnly"
            :asset="selectedAsset"
            :isEdit="!readOnly"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    import AnnouncementWidget from '@/common/widgets/announcement/index.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Readme from '@/common/widgets/readme/index.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        name: 'BiOverview',
        components: { AnnouncementWidget, Readme },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            readOnly: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup() {
            const { readmeContent } = useAssetInfo()

            return {
                readmeContent,
            }
        },
    })
</script>
