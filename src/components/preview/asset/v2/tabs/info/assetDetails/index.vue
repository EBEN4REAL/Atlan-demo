<template>
    <div class="w-full">
        <div class="flex items-center justify-between w-full pb-4 border-b">
            <div
                class="flex flex-col"
                v-for="(value, key, index) in details"
                :key="index"
            >
                <span class="text-xs text-gray-description">{{ key }}</span>
                <span class="text-gray">{{ value }}</span>
            </div>
        </div>
        <div class="flex w-full pt-4 text-xs text-gray-description">
            <Owners v-if="selectedAsset.guid" :selectedAsset="selectedAsset" />
            <Experts v-if="selectedAsset.guid" :selectedAsset="selectedAsset" />
        </div>
        <Description v-if="selectedAsset.guid" :selectedAsset="selectedAsset" />
        <Status v-if="selectedAsset.guid" :selectedAsset="selectedAsset" />
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

    import Description from './description.vue'
    import Status from './status.vue'
    import Owners from './owners.vue'
    import Experts from './experts.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import useAssetInfo from '~/composables/asset/useAssetInfo'

    export default defineComponent({
        name: 'AssetDetails',
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
        },
        components: {
            Experts,
            Description,
            Status,
            Owners,
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            const details: Ref = ref({})
            function init() {
                const { rowCount, columnCount, lastCrawled, updatedAt } =
                    useAssetInfo()
                console.log(selectedAsset.value, 'selectedAsset')
                details.value = {
                    Rows: rowCount(selectedAsset.value),
                    Columns: columnCount(selectedAsset.value),
                    'Last updated': updatedAt(selectedAsset.value),
                    'Last crawled': lastCrawled(selectedAsset.value),
                }
            }

            watch(selectedAsset, init)
            onMounted(init)
            return {
                details,
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
