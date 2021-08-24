<template>
    <div class="w-full px-5">
        <Description v-if="selectedAsset.guid" :selectedAsset="selectedAsset" />

        <Status v-if="selectedAsset.guid" :selectedAsset="selectedAsset" />
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, toRefs } from 'vue'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { assetInterface } from '~/types/assets/asset.interface'
    import Description from './description.vue'

    import Status from './status.vue'

    export default defineComponent({
        name: 'AssetDetails',
        components: {
            Description,
            Status,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },

        setup(props) {
            const { selectedAsset } = toRefs(props)

            return {
                selectedAsset,
            }
        },
    })
</script>
<style lang="less" scoped>
    ._bg-primary-light {
        background: rgba(34, 81, 204, 0.05);
    }
    .hover_bg-primary-light:hover {
        background: rgba(34, 81, 204, 0.05);
    }
    .owner-expert {
        // margin-top: 0.3rem;
        // margin-bottom: 0.3rem;
    }
</style>
