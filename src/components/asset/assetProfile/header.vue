<template>
    <div class="flex items-center justify-between">
        <div class="flex w-full">
            <!-- back button -->
            <div class="self-end mt-4 mr-2">
                <a-button
                    class="
                        px-1
                        border-transparent
                        shadow-none
                        hover:border-gray-300
                        py-0.5
                    "
                    @click="$router.back()"
                >
                    <atlan-icon
                        icon="ArrowRight"
                        class="w-5 h-5 text-gray-500 transform rotate-180"
                    />
                </a-button>
            </div>
            <div class="flex flex-col w-full">
                <div class="flex items-center w-full gap-x-2">
                    <!-- asset logo -->
                    <AssetLogo :asset="assetData" variant="" />
                    <HierarchyBar :selected-asset="assetData" />
                </div>
                <div class="flex items-center">
                    <Tooltip
                        :tooltip-text="title(assetData)"
                        classes="mb-0 text-gray-700 font-semibold text-lg"
                    />

                    <StatusBadge
                        :key="assetData.guid"
                        :show-no-status="false"
                        :status-id="assetData?.attributes?.assetStatus"
                        class="ml-1.5"
                    ></StatusBadge>
                </div>
            </div>
        </div>

        <!-- CTAs -->
        <div class="flex">
            <!-- <a-button
                v-if="assetType(assetData).includes('Tableau')"
                class="flex items-center mr-2"
            >
                <span class="mt-1 text-sm">Open in Tableau</span></a-button
            > -->

            <div class="flex text-gray-500">
                <a-button
                    v-if="
                        ['table', 'view'].includes(
                            assetType(assetData).toLowerCase()
                        )
                    "
                    class="text-gray-500 border-transparent shadow-none  hover:border-gray-300"
                >
                    <div class="flex">
                        <AtlanIcon icon="External" class="mt-0.5 mr-2" /> Query
                    </div></a-button
                >
                <a-button
                    v-if="assetType(assetData).includes('Tableau')"
                    class="text-gray-500 border-transparent shadow-none  hover:border-gray-300"
                >
                    <div class="flex">
                        <AtlanIcon icon="External" class="mt-0.5 mr-2" /> Open
                        in Tableau
                    </div></a-button
                >
                <a-button
                    class="text-gray-500 border-transparent shadow-none  hover:border-gray-300"
                    ><div class="flex">
                        <AtlanIcon icon="Share" class="mt-0.5 mr-2" /> Share
                    </div></a-button
                >

                <!-- <a-button
                    class="px-2 text-gray-500 border-transparent shadow-none hover:border-gray-300"
                >
                    <AtlanIcon icon="KebabMenu" />
                </a-button> -->
                <AssetMenu :asset="assetData" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Tooltip from '@common/ellipsis/index.vue'
    // Vue
    import { defineComponent, computed, inject } from 'vue'
    // Components
    import AssetLogo from '@/common/icon/assetIcon.vue'
    import HierarchyBar from '@common/badge/hierarchy.vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import AtlanBtn from '~/components/UI/button.vue'
    import AssetMenu from './assetMenu.vue'

    // Composables
    import useAssetInfo from '~/composables/asset/useAssetInfo'

    export default defineComponent({
        components: {
            AssetLogo,
            HierarchyBar,
            StatusBadge,
            AtlanBtn,
            Tooltip,
            AssetMenu,
        },

        setup() {
            /** INJECTIONS */
            const assetDataInjection = inject('assetData')

            /** COMPUTED */
            const assetData = computed(() => assetDataInjection?.asset)

            /** METHODS */
            // useAssetInfo
            const { status, title, assetType } = useAssetInfo()

            return {
                assetData,
                status,
                title,
                assetType,
            }
        },
    })
</script>
