<template>
    <div class="w-full">Actions</div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {},
        props: {
            id: String,
            componentData: {
                type: Object as PropType<any>,
            },
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

<style lang="less" scoped>
    .view {
        border: 3px solid white;
        margin-left: -8px;
    }
</style>
