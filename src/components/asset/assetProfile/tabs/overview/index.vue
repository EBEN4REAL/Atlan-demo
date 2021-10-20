<template>
    <!-- tableauAsset -->
    <tableauAsset v-if="assetType(selectedAsset).includes('Tableau')" />

    <!-- nonBiAssets -->
    <nonBiAsset v-else :edit-permission="userHasEditPermission" />
</template>

<script lang="ts">
    // Vue
    import {
        defineComponent,
        // inject,
        // computed,
        PropType,
        ref,
        toRefs,
    } from 'vue'
    import { storeToRefs } from 'pinia'

    // Components
    import nonBiAsset from '~/components/asset/assetProfile/tabs/overview/nonBiAsset/index.vue'
    import tableauAsset from '~/components/asset/assetProfile/tabs/overview/tableauAsset/index.vue'

    // Composables
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import useDiscoveryStore from '~/store/discovery'

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
            // const assetDataInjection = inject('assetData')

            /** COMPUTED */
            // const assetData = computed(() => assetDataInjection?.asset)
            // props
            const { userHasEditPermission } = toRefs(props)
            // store
            const storeDiscovery = useDiscoveryStore()
            const { selectedAsset } = storeToRefs(storeDiscovery)
            
            /** METHODS */
            const { assetType } = useAssetInfo()

            return {
                // assetData,
                assetType,
                userHasEditPermission,
                selectedAsset
            }
        },
    })
</script>
