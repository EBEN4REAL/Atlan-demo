<template>
    <SQL :sql="definition(asset)">
        <div class="flex flex-col text-sm cursor-pointer">
            <span class="mb-1 text-sm text-gray-500">Definition</span>
            <span class="text-primary">SQL</span>
        </div>
    </SQL>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    // Components
    import SQL from '@/common/popover/sql.vue'

    // Composables
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {
            SQL,
        },

        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {
            const { definition } = useAssetInfo()

            return {
                definition,
            }
        },
    })
</script>
