<template>
    <div class="px-5 pt-4">
        <div class="flex items-center justify-between">
            <div
                v-if="assetData.guid !== '-1'"
                class="flex items-center w-full ml-10 gap-x-2"
            >
                <!-- asset logo -->
                <AssetLogo :asset="assetData" variant="" />
                <HierarchyBar :selected-asset="assetData" />
            </div>
            <div
                v-else
                class="flex items-center w-full ml-10 text-gray-500 gap-x-2"
            >
                {{ assetData?.typeName }}
            </div>

            <!-- CTAs -->
            <div v-if="assetData.guid !== '-1'" class="flex">
                <div class="flex text-gray-500">
                    <a-button
                        v-if="
                            ['table', 'view'].includes(
                                assetType(assetData)?.toLowerCase()
                            )
                        "
                        class="text-gray-500 border-transparent shadow-none  hover:border-gray-300 hover:shadow-sm"
                    >
                        <div class="flex">
                            <AtlanIcon icon="External" class="mt-0.5 mr-2" />
                            Query
                        </div></a-button
                    >
                    <a-button
                        v-if="assetType(assetData)?.includes('Tableau')"
                        class="text-gray-500 border-transparent shadow-none  hover:border-gray-300 hover:shadow-sm"
                    >
                        <div class="flex">
                            <AtlanIcon icon="External" class="mt-0.5 mr-2" />
                            Open in Tableau
                        </div></a-button
                    >
                    <a-button
                        class="text-gray-500 border-transparent shadow-none  hover:border-gray-300 hover:shadow-sm"
                        ><div class="flex">
                            <AtlanIcon icon="Share" class="mt-0.5 mr-2" /> Share
                        </div></a-button
                    >

                    <AssetMenu
                        :asset="assetData"
                        :userPermission="userPermission"
                    />
                </div>
            </div>
        </div>
        <div class="flex items-center w-full">
            <div class="mr-2">
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
            <div v-if="assetData.guid !== '-1'" class="flex items-center">
                <span
                    class="mb-0 text-lg font-semibold text-gray-700 truncate"
                    >{{ title(assetData) }}</span
                >

                <StatusBadge
                    :key="assetData?.guid"
                    :show-no-status="false"
                    :status-id="assetData?.attributes?.certificateStatus"
                    class="ml-1.5"
                ></StatusBadge>
            </div>
            <div
                v-else
                class="flex mb-0 text-lg font-semibold text-gray-700 truncate"
            >
                {{ assetData?.displayText }}
                <AtlanIcon icon="Lock" class="mt-1 ml-1" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    // Vue
    import { defineComponent, computed, inject } from 'vue'
    // Components
    import HierarchyBar from '@common/badge/hierarchy.vue'
    import StatusBadge from '@common/badge/status/index.vue'
    import AssetLogo from '@/common/icon/assetIcon.vue'
    import AssetMenu from './assetMenu.vue'
    import useCheckAccess from '~/services/access/useCheckAccess'

    // Composables
    import useAssetInfo from '~/composables/asset/useAssetInfo'

    export default defineComponent({
        components: {
            AssetLogo,
            HierarchyBar,
            StatusBadge,
            AssetMenu,
        },

        setup(props) {
            /** INJECTIONS */
            const assetDataInjection = inject('assetData')

            /** COMPUTED */
            const assetData = computed(() => assetDataInjection?.asset)

            /** METHODS */
            // useAssetInfo
            const { status, title, assetType } = useAssetInfo()
            const { evaluatePermissions } = useCheckAccess()

            const { data: userPermission } = evaluatePermissions(
                assetData.value,
                'ENTITY_UPDATE'
            )

            return {
                assetData,
                status,
                title,
                assetType,
                userPermission,
            }
        },
    })
</script>
