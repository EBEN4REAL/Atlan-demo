<template>
    <div class="flex flex-col w-full h-full pb-4">
        <div
            class="flex items-center justify-between px-5 py-2 border-b border-gray-200 bg-gray-50"
        >
            <span class="font-semibold text-gray-500">Properties</span>
        </div>
        <div class="flex flex-col px-5 pt-3 overflow-auto gap-y-5">
            <div
                v-if="
                    sourceUpdatedBy(selectedAsset) ||
                    sourceUpdatedAt(selectedAsset, true)
                "
                class="flex flex-col text-sm"
            >
                <span class="mb-1 text-gray-500">Source updated</span>
                <div class="flex flex-col">
                    <div
                        v-if="sourceUpdatedBy(selectedAsset)"
                        class="flex mb-2"
                    >
                        {{ sourceUpdatedBy(selectedAsset) }}
                    </div>

                    <span
                        v-if="sourceUpdatedAt(selectedAsset, true)"
                        class="text-gray-700"
                        >{{ sourceUpdatedAt(selectedAsset, true) }} ({{
                            sourceUpdatedAt(selectedAsset, false)
                        }})</span
                    >
                </div>
            </div>

            <div
                v-if="
                    sourceCreatedBy(selectedAsset) ||
                    sourceCreatedAt(selectedAsset, true)
                "
                class="flex flex-col text-sm"
            >
                <span class="mb-1 text-gray-500">Source created</span>
                <div class="flex flex-col">
                    <div
                        v-if="sourceCreatedBy(selectedAsset)"
                        class="flex mb-2"
                    >
                        {{ sourceCreatedBy(selectedAsset) }}
                    </div>

                    <span class="text-gray-700"
                        >{{ sourceCreatedAt(selectedAsset, true) }} ({{
                            sourceCreatedAt(selectedAsset, false)
                        }})</span
                    >
                </div>
            </div>

            <div
                v-if="['LookerTile'].includes(selectedAsset.typeName)"
                class="flex flex-col text-sm"
            >
                <span class="mb-1 text-gray-500">Result Maker ID</span>

                <span class="text-gray-700">{{
                    resultMakerID(selectedAsset)
                }}</span>
            </div>
            <div
                v-if="['LookerDashboard'].includes(selectedAsset.typeName)"
                class="flex flex-col text-sm"
            >
                <span class="mb-1 text-gray-500">Source Metadata ID</span>

                <span class="text-gray-700">{{
                    sourceMetadataId(selectedAsset)
                }}</span>
            </div>
            <div
                v-if="
                    ['LookerLook', 'LookerFolder'].includes(
                        selectedAsset.typeName
                    )
                "
                class="flex flex-col text-sm"
            >
                <span class="mb-1 text-gray-500"
                    >Source Content Metadata ID</span
                >

                <span class="text-gray-700">{{
                    sourceContentMetadataId(selectedAsset)
                }}</span>
            </div>

            <ConnectionInfo
                v-if="
                    !isGTC(selectedAsset) &&
                    !['Connection', 'Process'].includes(selectedAsset.typeName)
                "
                :asset="selectedAsset"
            />

            <div
                v-if="
                    isGTC(selectedAsset) &&
                    getAnchorProfile(selectedAsset)?.length &&
                    getAnchorName(selectedAsset)?.length
                "
                class="flex flex-col text-sm"
            >
                <span class="mb-1 text-gray-500">Glossary</span>
                <div class="flex items-center">
                    <router-link
                        :to="getAnchorProfile(selectedAsset)"
                        class="text-primary hover:underline"
                        >{{ getAnchorName(selectedAsset) }}</router-link
                    >
                </div>
            </div>

            <div class="flex flex-col text-sm">
                <div class="flex items-center mb-1 text-gray-500">
                    <span>Unique Identifier</span>
                    <a-tooltip title="Copy">
                        <div
                            @click="
                                handleCopyValue(
                                    selectedAsset?.guid,
                                    'Identifier'
                                )
                            "
                        >
                            <AtlanIcon
                                icon="CopyOutlined"
                                class="w-auto ml-1 cursor-pointer mb-0.5"
                            /></div
                    ></a-tooltip>
                </div>
                <span class="text-gray-700">{{ selectedAsset?.guid }}</span>
            </div>

            <div v-if="!isGTC(selectedAsset)" class="flex flex-col text-sm">
                <div class="flex items-center mb-1 text-gray-500">
                    <span>Qualified Name</span>
                    <a-tooltip title="Copy">
                        <div
                            @click="
                                handleCopyValue(
                                    qualifiedName(selectedAsset),
                                    'Qualified Name'
                                )
                            "
                        >
                            <AtlanIcon
                                icon="CopyOutlined"
                                class="w-auto ml-1 cursor-pointer mb-0.5"
                            /></div
                    ></a-tooltip>
                </div>
                <span class="text-gray-700 break-all">{{
                    qualifiedName(selectedAsset)
                }}</span>
            </div>

            <a-divider dashed class="my-0 border-gray-500"></a-divider>

            <div class="flex flex-col text-sm">
                <span class="mb-1 text-gray-500"
                    >Last updated by (on Atlan)</span
                >
                <div class="flex flex-col">
                    <div class="flex">
                        <PopOverUser :item="modifiedBy(selectedAsset)">
                            <UserPill
                                :username="modifiedBy(selectedAsset)"
                                @click="
                                    handleClickUser(modifiedBy(selectedAsset))
                                "
                            ></UserPill
                        ></PopOverUser>
                    </div>
                </div>
            </div>
            <div class="flex flex-col text-sm">
                <span class="mb-1 text-gray-500"
                    >Last updated at (on Atlan)</span
                >
                <div class="flex flex-col">
                    <span class="text-sm text-gray-700"
                        >{{ modifiedAt(selectedAsset, true) }} ({{
                            modifiedAt(selectedAsset, false)
                        }})</span
                    >
                </div>
            </div>

            <div
                class="flex flex-col mt-3 mb-3 text-sm"
                v-if="lastSyncRunAt(selectedAsset, true)"
            >
                <span class="mb-1 text-gray-500"
                    >Last synced at (on Atlan)</span
                >

                <div class="flex flex-col">
                    <span class="text-sm text-gray-700"
                        >{{ lastSyncRunAt(selectedAsset, true) }} ({{
                            lastSyncRunAt(selectedAsset, false)
                        }})</span
                    >
                </div>
            </div>
            <div class="flex flex-col text-sm">
                <span class="mb-1 text-gray-500">Created at (on Atlan)</span>

                <div class="flex flex-col">
                    <span class="text-sm text-gray-700"
                        >{{ createdAt(selectedAsset, true) }} ({{
                            createdAt(selectedAsset, false)
                        }})</span
                    >
                </div>
            </div>

            <div class="flex flex-col text-sm">
                <span class="mb-1 text-gray-500">Created by (on Atlan)</span>

                <div class="flex flex-col">
                    <div class="flex">
                        <PopOverUser :item="createdBy(selectedAsset)">
                            <UserPill
                                :username="createdBy(selectedAsset)"
                                @click="
                                    handleClickUser(createdBy(selectedAsset))
                                "
                            ></UserPill
                        ></PopOverUser>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import ConnectionInfo from '@common/widgets/summary/types/connection.vue'
    import { message } from 'ant-design-vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import map from '~/constant/accessControl/map'

    import { useUserPreview } from '~/composables/user/showUserPreview'
    import UserPill from '@/common/pills/user.vue'
    import PopOverUser from '@/common/popover/user/user.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { capitalizeFirstLetter } from '~/utils/string'
    import { copyToClipboard } from '~/utils/clipboard'

    export default defineComponent({
        name: 'PropertiesWidget',
        components: {
            UserPill,
            PopOverUser,
            ConnectionInfo,
        },
        props: {
            selectedAsset: {
                type: Object as PropType<assetInterface>,
                required: true,
            },
            userHasEditPermission: {
                type: Boolean,
                required: true,
            },
            page: {
                type: String,
                required: true,
            },
        },
        setup() {
            const {
                connectorName,
                connectionName,
                sourceUpdatedAt,
                sourceCreatedAt,
                sourceUpdatedBy,
                sourceCreatedBy,
                qualifiedName,
                createdAt,
                createdBy,
                modifiedAt,
                modifiedBy,
                connectionQualifiedName,
                getConnectorImage,
                ownerUsers,
                isGTC,
                getAnchorProfile,
                getAnchorName,
                connectionGuid,
                resultMakerID,
                sourceMetadataId,
                sourceContentMetadataId,
                lastSyncRunAt,
                sourceId,
            } = useAssetInfo()

            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()

            const handleClickUser = (username: string) => {
                setUserUniqueAttribute(username, 'username')
                showUserPreview({ allowed: ['about', 'assets', 'groups'] })
            }

            const handleCopyValue = async (value, type) => {
                await copyToClipboard(value)
                message.success(`${type} copied!`)
            }

            return {
                connectorName,
                connectionName,
                sourceUpdatedAt,
                sourceCreatedAt,
                qualifiedName,
                createdAt,
                modifiedAt,
                modifiedBy,
                isGTC,
                getAnchorProfile,
                getAnchorName,
                getConnectorImage,
                createdBy,
                handleClickUser,
                connectionQualifiedName,
                ownerUsers,
                capitalizeFirstLetter,
                handleCopyValue,
                sourceUpdatedBy,
                sourceCreatedBy,
                connectionGuid,
                resultMakerID,
                sourceMetadataId,
                sourceContentMetadataId,
                lastSyncRunAt,
                sourceId,
                map,
            }
        },
    })
</script>
