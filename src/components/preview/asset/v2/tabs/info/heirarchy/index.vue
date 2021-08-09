<template>
    <div class="w-full">
        <Heirarchy :selectedAsset="selectedAsset" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import Heirarchy from './heirarchy.vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: { Heirarchy },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            return {}
        },
    })
</script>

<style lang="less" scoped></style>
