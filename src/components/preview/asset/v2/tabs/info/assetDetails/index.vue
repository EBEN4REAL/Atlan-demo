<template>
    <div class="w-full px-5">
        <div class="flex items-center justify-between w-full mb-4">
            <div
                class="flex flex-col text-sm"
                v-for="(value, key, index) in details"
                :key="index"
            >
                <span class="mb-2 text-sm text-gray-500">{{ key }}</span>
                <span class="text-gray-700">{{ value }}</span>
            </div>
        </div>
        <div class="flex w-full text-sm text-gray-500">
            <Owners v-if="selectedAsset.guid" :selectedAsset="selectedAsset" />
        </div>
        <div class="flex w-full text-sm text-gray-500">
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
