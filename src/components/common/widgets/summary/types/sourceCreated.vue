<template>
    <div
        v-if="sourceCreatedBy(asset) || sourceCreatedAt(asset)"
        class="flex flex-col text-sm"
    >
        <span class="mb-1 text-sm text-gray-500">Source Created</span>
        <div class="flex items-center text-gray-700">
            <span class="border-b border-gray-500 border-dashed cursor-pointer">
                <a-tooltip placement="bottom">
                    <template #title>
                        {{ sourceCreatedAt(asset, true) }} </template
                    >{{ sourceCreatedAt(asset) }}</a-tooltip
                ></span
            >
            <span v-if="sourceCreatedBy(asset)" class="flex ml-2">
                by {{ sourceCreatedBy(asset) }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'

    // Composables
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup() {
            const { sourceCreatedAt, sourceCreatedBy } = useAssetInfo()

            return {
                sourceCreatedAt,
                sourceCreatedBy,
            }
        },
    })
</script>
