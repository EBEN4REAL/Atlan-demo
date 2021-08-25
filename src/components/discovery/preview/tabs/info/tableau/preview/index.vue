<template>
    <div class="px-5">
        <div class="w-full h-48 rounded bg-gray-light"></div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        name: 'TableauPreview',
        components: {},
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {
            return {}
        },
    })
</script>

<style lang="less" module></style>
