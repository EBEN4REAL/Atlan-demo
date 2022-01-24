<template>
    <div
        v-if="sourceUpdatedBy(asset) || sourceUpdatedAt(asset)"
        class="flex flex-col text-sm"
    >
        <span class="mb-1 text-sm text-gray-500">Source Updated</span>
        <div class="flex items-center text-gray-700">
            <span class="cursor-pointer dotted-underline">
                <a-tooltip placement="right">
                    <template #title>
                        {{ sourceUpdatedAt(asset, true) }} </template
                    >{{ sourceUpdatedAt(asset) }}</a-tooltip
                ></span
            >
            <span class="flex ml-2" v-if="sourceUpdatedBy(asset)">
                by {{ sourceUpdatedBy(asset) }}
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
            const { sourceUpdatedAt, sourceUpdatedBy } = useAssetInfo()

            return {
                sourceUpdatedAt,
                sourceUpdatedBy,
            }
        },
    })
</script>

<style lang="less" scoped>
    .dotted-underline {
        text-decoration: underline;
        text-decoration-style: dotted;
    }
</style>
