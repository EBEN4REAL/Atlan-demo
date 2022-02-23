<template>
    <SQL
        v-if="definition(asset) && definition(asset) !== '[]'"
        :sql="definition(asset)"
    >
        <div class="flex flex-col text-sm cursor-pointer">
            <span class="mb-1 text-sm text-gray-500">Definition</span>
            <span class="font-semibold text-primary">SQL</span>
        </div>
    </SQL>
    <div v-else class="flex flex-col text-sm">
        <span class="mb-1 text-sm text-gray-500">Definition</span>
        <span class="text-grey-700">~</span>
    </div>
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
