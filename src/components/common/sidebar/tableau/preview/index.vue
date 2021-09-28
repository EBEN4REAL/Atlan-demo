<template>
    <div class="px-5">
        <overview-image-preview :selected-asset="selectedAsset" />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { assetInterface } from '~/types/assets/asset.interface'
import overviewImagePreview from '~/components/asset/assetProfile/tabs/overview/tableauAsset/overviewImagePreview.vue'

export default defineComponent({
    name: 'TableauPreview',
    components: { overviewImagePreview },
    props: {
        selectedAsset: {
            type: Object as PropType<assetInterface>,
            required: true,
        },
    },
})
</script>

<style lang="less" module></style>
