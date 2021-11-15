<template>
    <div>
        <p class="mb-1 text-sm text-gray-500">Asset Details</p>
        <div class="flex flex-col pl-3 border-l-2 border-gray-300">
            <AssetLogo :asset="asset" />
            <span class="text-base font-bold overflow-ellipsis text-gray"
                >{{ title(asset) }}
            </span>
            <span class="text-sm text-gray-500 overflow-ellipsis"
                >{{ description(asset) }}
            </span>
            <span class="text-sm text-gray overflow-ellipsis"
                >{{ databaseName(asset) }}/{{ schemaName(asset) }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import AssetLogo from '@/common/icon/assetIcon.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    export default defineComponent({
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        components: { AssetLogo },
        setup(props) {
            const { description, title, schemaName, databaseName } =
                useAssetInfo()

            return { description, title, schemaName, databaseName }
        },
    })
</script>
