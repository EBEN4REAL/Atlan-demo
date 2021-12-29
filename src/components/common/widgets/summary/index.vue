<template>
    <div class="p-6 bg-white border border-gray-200 rounded">
        <!-- <div class="flex items-center mb-4">
            <AtlanIcon icon="TableSummary" class="w-auto h-8 mr-3" /><span
                class="text-base font-bold text-gray"
                >{{ getSummaryVariants(asset)?.label }} Summary</span
            >
        </div> -->
        <slot name="announcement"></slot>
        <div class="flex flex-col gap-y-3">
            <div class="grid grid-cols-2">
                <div class="flex flex-col">
                    <p class="text-gray-500">Name</p>
                    <div class="flex items-center mb-0 overflow-hidden">
                        <div
                            v-if="
                                ['column'].includes(
                                    asset.typeName?.toLowerCase()
                                )
                            "
                            class="flex mr-1"
                        >
                            <component
                                :is="dataTypeCategoryImage(asset)"
                                class="h-4 text-gray-500 mb-0.5"
                            />
                        </div>
                        <div
                            class="flex-shrink mb-0 overflow-hidden text-base font-bold text-gray-700 truncate cursor-pointer text-mdoverflow-ellipsis whitespace-nowrap"
                        >
                            {{ title(asset) }}
                        </div>

                        <CertificateBadge
                            v-if="certificateStatus(asset)"
                            :status="certificateStatus(asset)"
                            :username="certificateUpdatedBy(asset)"
                            :timestamp="certificateUpdatedAt(asset)"
                            class="mb-1 ml-1"
                        ></CertificateBadge>
                        <a-tooltip placement="right"
                            ><template #title>Limited Access</template>
                            <AtlanIcon
                                v-if="isScrubbed(asset)"
                                icon="Lock"
                                class="h-4 mb-1 ml-1"
                            ></AtlanIcon
                        ></a-tooltip>
                    </div>
                </div>

                <div class="flex flex-col gap-y-3">
                    <div
                        v-if="
                            !isGTC(asset) &&
                            !['Connection', 'Process'].includes(asset.typeName)
                        "
                        class="flex flex-col text-sm"
                    >
                        <span class="mb-1 text-gray-500">Connection</span>
                        <div class="flex items-center">
                            <img
                                :src="getConnectorImage(asset)"
                                class="h-4 mr-1"
                            />
                            <span>{{
                                `${connectorName(asset)}/${connectionName(
                                    asset
                                )}`
                            }}</span>
                        </div>
                    </div>
                    <!-- <div class="flex flex-col">
                    <p class="text-gray-500">Asset Type</p>
                    {{ asset.typeName }}
                </div> -->
                </div>
            </div>
            <div class="flex flex-col">
                <p class="text-gray-500">Description</p>
                <Description
                    ref="descriptionRef"
                    v-model="localDescription"
                    :selected-asset="asset"
                    :edit-permission="false"
                    :in-profile="true"
                    class="-ml-1"
                    @change="handleChangeDescription"
                />
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script lang="ts">
    import {
        defineComponent,
        PropType,
        toRefs,
        defineAsyncComponent,
    } from 'vue'

    // Components
    import Description from '@/common/input/description/index.vue'
    import Owners from '@/common/input/owner/index.vue'
    import Certificate from '@/common/input/certificate/index.vue'

    // Composables
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import updateAssetAttributes from '~/composables/discovery/updateAssetAttributes'
    import CertificateBadge from '@/common/badge/certificate/index.vue'

    // Types
    import { assetInterface } from '~/types/assets/asset.interface'

    export default defineComponent({
        components: {
            CertificateBadge,
            Description,
            Certificate,
            Owners,
            Rows: defineAsyncComponent(() => import('./types/rows.vue')),
            Columns: defineAsyncComponent(() => import('./types/columns.vue')),
            Definition: defineAsyncComponent(
                () => import('./types/definition.vue')
            ),
            TermsCount: defineAsyncComponent(
                () => import('./types/termsCount.vue')
            ),
            CategoriesCount: defineAsyncComponent(
                () => import('./types/categoriesCount.vue')
            ),
            ParentGlossary: defineAsyncComponent(
                () => import('./types/parentGlossary.vue')
            ),
        },

        props: {
            asset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            editPermission: {
                type: Boolean,
                required: false,
                default: false,
            },
        },
        setup(props) {
            const { asset } = toRefs(props)

            const {
                getSummaryVariants,
                title,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                dataTypeCategoryImage,
                isScrubbed,
                isGTC,
                connectorName,
                connectionName,
                getConnectorImage,
            } = useAssetInfo()

            const {
                isLoading,
                localDescription,
                localCertificate,
                localOwners,
                handleChangeDescription,
                handleOwnersChange,
                handleChangeCertificate,
                descriptionRef,
                animationPoint,
            } = updateAssetAttributes(asset)

            return {
                isLoading,
                localDescription,
                handleChangeDescription,
                localOwners,
                handleOwnersChange,
                localCertificate,
                handleChangeCertificate,
                getSummaryVariants,
                descriptionRef,
                animationPoint,
                title,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                dataTypeCategoryImage,
                isScrubbed,
                isGTC,
                connectorName,
                connectionName,
                getConnectorImage,
            }
        },
    })
</script>
