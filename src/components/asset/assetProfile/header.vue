<template>
    <div class="flex items-start justify-between">
        <div class="flex">
            <!-- back button -->
            <div>
                <button class="px-1 py-0.5 mx-1" @click="$router.back()">
                    <atlan-icon
                        icon="ChevronDown"
                        class="w-auto transform rotate-90 h-7"
                    />
                </button>
            </div>
            <div>
                <div class="flex items-center">
                    <!-- asset logo -->
                    <AssetLogo :asset="assetData" variant="lg" />

                    <span class="text-xl font-bold">{{
                        assetData.attributes.name
                    }}</span>
                    <atlan-icon icon="Verified" class="w-auto h-4 ml-2" />
                </div>
                <!-- asset source hierarchy -->
                <HierarchyBar class="py-1 mt-1" :selected-asset="assetData" />
            </div>
        </div>
        <!-- CTAs -->
        <div class="flex">
            <a-button
                v-if="assetType(assetData).includes('Tableau')"
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
    import { defineComponent, computed, inject } from 'vue'
    // Components
    import AssetLogo from '@/common/icon/assetIcon.vue'
    import HierarchyBar from '@common/badge/hierarchy.vue'
    import StatusBadge from '@common/badge/status/index.vue'
    // Composables
    import useAssetInfo from '~/composables/asset/useAssetInfo'

    export default defineComponent({
        components: { AssetLogo, HierarchyBar, StatusBadge },
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
