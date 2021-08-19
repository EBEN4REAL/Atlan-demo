<template>
    <div class="px-5">Tableau Properties</div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {},
        name: 'Tableau Properties',
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
