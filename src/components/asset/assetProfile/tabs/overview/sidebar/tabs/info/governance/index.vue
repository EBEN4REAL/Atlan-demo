<template>
    <div class="w-full px-5">
        <Classification :selected-asset="selectedAsset" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, toRefs, watch } from 'vue'
    import Classification from '@common/sidebar/classifications.vue'
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: { Classification },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            watch(
                selectedAsset,
                () => {
                    console.log('asset changed governance', selectedAsset)
                },
                {
                    immediate: true,
                }
            )
        },
    })
</script>
