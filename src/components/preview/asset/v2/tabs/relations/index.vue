<template>
    <div class="w-full">Relations</div>
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
        setup(props) {
            console.log('relations -> ', { ...props.selectedAsset })
            return {}
        },
    })
</script>

<style lang="less" scoped></style>
