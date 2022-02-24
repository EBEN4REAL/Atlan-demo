<template>
    <div class="flex flex-col p-6 gap-y-4">
        <AnnouncementWidget
            :selected-asset="selectedAsset"
        ></AnnouncementWidget>
        <Summary
            v-if="
                getSummaryVariants(selectedAsset)?.label ===
                selectedAsset?.typeName
            "
            :asset="selectedAsset"
        />
        <slot name="readme"></slot>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    import Summary from '@common/widgets/summary/index.vue'
    import AnnouncementWidget from '@/common/widgets/announcement/index.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    export default defineComponent({
        name: 'GeneralOverview',
        components: { AnnouncementWidget, Summary },
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
        setup() {
            const { getSummaryVariants } = useAssetInfo()

            return { getSummaryVariants }
        },
    })
</script>
