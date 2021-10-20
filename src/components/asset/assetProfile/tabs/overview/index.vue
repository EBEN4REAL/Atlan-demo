<template>
    <!-- tableauAsset -->
    <tableauAsset v-if="assetType(assetData).includes('Tableau')" />

    <!-- nonBiAssets -->
    <nonBiAsset v-else :edit-permission="userHasEditPermission" />
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        inject,
        computed,
        PropType,
        ref,
        toRefs,
    } from 'vue'

    // Components
    import nonBiAsset from '~/components/asset/assetProfile/tabs/overview/nonBiAsset/index.vue'
    import tableauAsset from '~/components/asset/assetProfile/tabs/overview/tableauAsset/index.vue'

    // Composables
    import useAssetInfo from '~/composables/asset/useAssetInfo'

    export default defineComponent({
        components: { nonBiAsset, tableauAsset },
        props: {
            userHasEditPermission: {
                type: Boolean,
                required: true,
            },
        },
        setup(props) {
            /** INJECTIONS */
            const assetDataInjection = inject('assetData')

            /** COMPUTED */
            const assetData = computed(() => assetDataInjection?.asset)

            /** METHODS */
            const { assetType } = useAssetInfo()

            return {
                assetData,
                assetType,
            }
        },
    })
</script>
