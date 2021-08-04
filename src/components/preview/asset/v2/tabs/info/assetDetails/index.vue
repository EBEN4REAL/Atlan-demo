<template>
    <div class="flex items-center justify-between w-full">
        <div
            class="flex flex-col"
            v-for="(value, key, index) in details"
            :key="index"
        >
            <span class="text-xs text-gray-description">{{ key }}</span>
            <span>{{ value }}</span>
        </div>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        ref,
        Ref,
        watch,
        onMounted,
        toRefs,
    } from 'vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    import { getCountString } from '~/composables/asset/useFormat'

    export default defineComponent({
        name: 'AssetDetails',
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            const details: Ref = ref({})

            function init() {
                const { rowCount, columnCount, lastCrawled, updatedAt } =
                    useAssetInfo()

                details.value = {
                    Rows: getCountString(rowCount(selectedAsset.value)),
                    Columns: getCountString(columnCount(selectedAsset.value)),
                    'Last updated': updatedAt(selectedAsset.value),
                    'Last crawled': lastCrawled(selectedAsset.value),
                }
            }

            watch(selectedAsset, init)
            onMounted(init)
            return { details }
        },
    })
</script>
