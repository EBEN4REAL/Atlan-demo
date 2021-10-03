<template>
    <div class="w-full px-5">
        <Hierarchy :selected-asset="selectedAsset" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Hierarchy from '@common/sidebar/heirarchy.vue'

    export default defineComponent({
        components: { Hierarchy },
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

<style lang="less" scoped></style>
