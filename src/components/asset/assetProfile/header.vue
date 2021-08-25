<template>
    <div class="flex items-start justify-between">
        <div class="flex">
            <!-- back button -->
            <div>
                <a-button
                    :ghost="true"
                    class="px-2 mr-1 border-0 outline-none"
                    @click="$router.back()"
                    ><atlan-icon
                        icon="ChevronDown"
                        class="w-auto transform rotate-90 h-7"
                /></a-button>
            </div>
            <div>
                <!-- asset logo -->
                <div class="flex">
                    <AssetLogo class="self-start pt-2" :asset="assetData" />
                    <div
                        class="flex items-center mt-1 mb-2 text-xl font-bold lowercase "
                    >
                        <span>{{ assetData.attributes.name }}</span>
                        <atlan-icon icon="Verified" class="w-auto h-4 ml-2" />
                    </div>
                </div>
                <!-- asset source hierarchy -->
                <div class="flex items-center">
                    <div
                        v-for="(item, index) in hierarchyInfo"
                        :key="index"
                        class="flex items-center"
                    >
                        <div>
                            <span class="text-gray-500"
                                >{{ item.label }} :</span
                            >
                            <span class="ml-1">{{ item.text }}</span>
                        </div>
                        <div
                            v-if="index !== hierarchyInfo.length - 1"
                            class="mx-3"
                        >
                            &bull;
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- CTAs -->
        <div class="flex">
            <a-button
                v-if="assetType.includes('Tableau')"
                class="flex items-center mr-2"
            >
                <span class="mt-1 text-sm">Open in Tableau</span></a-button
            >
            <a-button class="px-2 mr-2"
                ><atlan-icon icon="BookmarkOutlined" class="w-auto h-4"
            /></a-button>
            <a-button class="flex items-center"
                ><atlan-icon icon="Share" class="w-auto h-4 mr-2" />
                <span class="mt-1 text-sm">Share</span></a-button
            >
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, computed, inject, ref } from 'vue'
    // Components
    import AssetLogo from '@/common/icon/assetIcon.vue'

    // Util
    import useAssetInfo from '~/composables/asset/useAssetInfo'
    // import { SourceList } from '~/constant/source'

    export default defineComponent({
        components: { AssetLogo },
        setup() {
            /** DATA */
            const assetType = ref('')

            /** INJECTIONS */
            const assetDataInjection = inject('assetData')

            /** COMPUTED */
            const assetData = computed(() => assetDataInjection?.asset)
            assetType.value = assetData.value.typeName

            // const integrationIcon = computed(() => {
            //     const item = SourceList.find(
            //         (src: { id: string }) =>
            //             src.id === assetData.value.attributes.integrationName
            //     )
            //     return item?.image
            // })

            /** METHODS */
            // hierarchyInfo
            const { logo, getHierarchy } = useAssetInfo()
            const hierarchyInfo = getHierarchy(assetData.value)
                .filter((data) => data.value)
                .map((data) => ({
                    label: data.label,
                    text: data.value,
                }))

            return {
                hierarchyInfo,
                logo,
                assetType,
                assetData,
                // integrationIcon,
            }
        },
    })
</script>
