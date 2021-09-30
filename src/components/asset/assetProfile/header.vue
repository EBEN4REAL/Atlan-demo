<template>
    <div class="flex items-center justify-between">
        <div class="flex items-center w-full">
            <!-- back button -->
            <div class="mr-3">
                <a-button class="px-1 py-1" @click="$router.back()">
                    <atlan-icon
                        icon="ChevronDown"
                        class="w-auto transform rotate-90"
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

            <a-button-group>
                <a-button
                    v-if="
                        ['table', 'view'].includes(
                            assetType(assetData).toLowerCase()
                        )
                    "
                >
                    Query</a-button
                >
                <a-button v-if="assetType(assetData).includes('Tableau')">
                    Open in Tableau</a-button
                >
                <a-button><AtlanIcon icon="Share" /></a-button>

                <a-button>
                    <AtlanIcon icon="Bookmark" />
                </a-button>
            </a-button-group>
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

    // Composables
    import useAssetInfo from '~/composables/asset/useAssetInfo'

    export default defineComponent({
        components: { AssetLogo, HierarchyBar, StatusBadge, AtlanBtn, Tooltip },

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
