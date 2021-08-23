<template>
    <div class="w-full px-5">
        <Properties :selected-asset="selectedAsset" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Properties from './properties.vue'

    export default defineComponent({
        components: { Properties },
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
