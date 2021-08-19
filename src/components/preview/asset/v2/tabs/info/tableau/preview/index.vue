<template>
    <div class="px-5">
        <div class="w-full h-48 rounded bg-gray-light"></div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {},
        name: 'Tableau Preview',
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

<style lang="less" module></style>
