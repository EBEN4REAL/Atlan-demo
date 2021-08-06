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
            <div class="w-7/12 mr-2">
                <p class="mb-0">Owners</p>
                <div class="" @click="toggleOwnersDropdown">
                    <a-dropdown
                        :trigger="['click']"
                        v-model:visible="showOwnersDropdown"
                    >
                        <div
                            class="grid grid-cols-2 p-2 rounded  hover:border auto-rows-auto gap-y-3"
                        >
                            <div class="flex items-center mr-2.5">
                                <img
                                    src="https://picsum.photos/id/237/50/50"
                                    alt="view"
                                    class="w-4 h-4 mr-1 rounded-full"
                                /><span class="text-gray truncate ..."
                                    >@sarbik</span
                                >
                            </div>
                            <div class="flex items-center mr-2.5">
                                <img
                                    src="https://picsum.photos/id/238/50/50"
                                    alt="view"
                                    class="w-4 h-4 mr-1 rounded-full"
                                /><span class="text-gray truncate ..."
                                    >@shreyas</span
                                >
                            </div>
                            <div class="flex items-center mr-2.5">
                                <img
                                    src="https://picsum.photos/id/239/50/50"
                                    alt="view"
                                    class="w-4 h-4 mr-1 rounded-full"
                                /><span class="text-gray truncate ..."
                                    >@shubankar</span
                                >
                            </div>
                            <div>
                                <span
                                    class="
                                        px-1
                                        py-0.5
                                        rounded
                                        text-primary
                                        _bg-primary-light
                                    "
                                >
                                    +3 Others
                                </span>
                            </div>
                        </div>
                        <template #overlay>
                            <div
                                class="
                                    p-2.5
                                    bg-white
                                    rounded
                                    shadow
                                    flex
                                    items-center
                                    flex-col
                                "
                            >
                                <a-input
                                    v-input-focus
                                    placeholder="Search Owners"
                                >
                                    <!-- <template #prefix>
                                        <fa icon="fal search" />
                                    </template> -->
                                </a-input>
                                <div
                                    class="flex items-center w-full px-1 py-1 mt-2 rounded cursor-pointer  hover_bg-primary-light"
                                >
                                    <img
                                        src="https://picsum.photos/id/237/50/50"
                                        alt="view"
                                        class="w-4 h-4 mr-1 rounded-full"
                                    /><span class="text-gray truncate ..."
                                        >Sarbik Betal</span
                                    >
                                </div>
                                <div
                                    class="flex items-center w-full px-1 py-1 mt-2 rounded cursor-pointer  hover_bg-primary-light"
                                >
                                    <img
                                        src="https://picsum.photos/id/239/50/50"
                                        alt="view"
                                        class="w-4 h-4 mr-1 rounded-full"
                                    /><span class="text-gray truncate ..."
                                        >Shubhankar Khare</span
                                    >
                                </div>
                            </div>
                        </template>
                    </a-dropdown>
                </div>
            </div>
            <div class="w-5/12">
                <p class="flex-1 mb-0">Experts</p>
                <div class="flex flex-wrap">
                    <div
                        class="
                            flex
                            items-center
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
                        <span class="text-gray truncate text-xs ..."
                            >Sale Team</span
                        >
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
        <Description :selectedAsset="selectedAsset" />
        <Status :selectedAsset="selectedAsset" />
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
    import Description from './description.vue'
    import Status from './status.vue'

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
        },
        setup(props) {
            const { selectedAsset } = toRefs(props)
            const details: Ref = ref({})
            const showOwnersDropdown: Ref<boolean> = ref(false)

            function init() {
                const { rowCount, columnCount, lastCrawled, updatedAt } =
                    useAssetInfo()
                console.log(selectedAsset.value, 'selectedAsset')
                details.value = {
                    Rows: getCountString(rowCount(selectedAsset.value)),
                    Columns: getCountString(columnCount(selectedAsset.value)),
                    'Last updated': updatedAt(selectedAsset.value),
                    'Last crawled': lastCrawled(selectedAsset.value),
                }
            }
            const toggleOwnersDropdown = () => {
                showOwnersDropdown.value = true
            }

            watch(selectedAsset, init)
            onMounted(init)
            return {
                details,
                showOwnersDropdown,
                toggleOwnersDropdown,
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
