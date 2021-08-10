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
            <div class="w-5/12">
                <p class="flex-1 mb-0">Experts</p>
                <div class="flex flex-wrap">
                    <div
                        class="
                            flex
                            items-center
                            text-sm
                            mb-2.5
                            mr-2.5
                            p-2
                            hover:border
                            rounded
                        "
                    >
                        <div
                            class="flex items-center px-1 py-1 mr-1 rounded-full  _bg-primary-light"
                        >
                            <fa icon="fal users" class="text-primary" />
                        </div>
                        <span class="text-gray truncate ...">Sale Team</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="w-full pt-2 text-xs text-gray-description">
            <p class="mb-1">Description</p>
            <p class="mb-0 text-sm text-gray">
                Transaction table stores all the information required for a trip
                before an actual trip is created, such as client requirements,
                vendor and truck details a...<span
                    class="ml-2 font-semibold text-primary"
                    >show more</span
                >
            </p>
        </div> -->
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
    import Owners from './_owners.vue'
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
        components: {
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
</style>
