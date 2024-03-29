<template>
    <div class="flex flex-col w-full h-full pb-4">
        <div class="flex items-center justify-between px-5 py-4">
            <span class="flex items-center">
                <PreviewTabsIcon
                    :icon="tab.icon"
                    :image="tab.image"
                    :emoji="tab.emoji"
                    height="h-4"
                    class="mb-0.5"
                />
                <span class="ml-1 font-semibold text-gray-500">Properties</span>
            </span>
        </div>
        <div class="flex flex-col px-5 pt-0 overflow-auto gap-y-5">
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
                v-if="['S3Object', 'S3Bucket'].includes(selectedAsset.typeName)"
                class="flex flex-col w-full gap-y-5"
            >
                <div class="flex flex-col text-sm">
                    <span class="mb-1 text-gray-500">Partition</span>

                    <span class="text-gray-700">{{
                        awsPartition(selectedAsset)
                    }}</span>
                </div>

                <div class="flex flex-col text-sm">
                    <span class="mb-1 text-gray-500">Region</span>

                    <span class="text-gray-700">{{
                        awsRegion(selectedAsset)
                    }}</span>
                </div>

                <div class="flex flex-col text-sm">
                    <div class="flex items-center mb-1 text-gray-500">
                        <span>Account Id</span>
                        <a-tooltip title="Copy">
                            <div
                                @click="
                                    handleCopyValue(
                                        awsAccountId(selectedAsset),
                                        'Account Id'
                                    )
                                "
                            >
                                <AtlanIcon
                                    icon="CopyOutlined"
                                    class="w-auto ml-1 cursor-pointer mb-0.5"
                                /></div
                        ></a-tooltip>
                    </div>
                    <span class="text-gray-700">{{
                        awsAccountId(selectedAsset)
                    }}</span>
                </div>
                <div class="flex flex-col text-sm">
                    <div class="flex items-center mb-1 text-gray-500">
                        <span>Resource Id</span>
                        <a-tooltip title="Copy">
                            <div
                                @click="
                                    handleCopyValue(
                                        awsResourceId(selectedAsset),
                                        'Resource Id'
                                    )
                                "
                            >
                                <AtlanIcon
                                    icon="CopyOutlined"
                                    class="w-auto ml-1 cursor-pointer mb-0.5"
                                /></div
                        ></a-tooltip>
                    </div>
                    <span class="text-gray-700">{{
                        awsResourceId(selectedAsset)
                    }}</span>
                </div>
                <div class="flex flex-col text-sm">
                    <span class="mb-1 text-gray-500">Owner Name</span>

                    <span class="text-gray-700">{{
                        awsOwnerName(selectedAsset)
                    }}</span>
                </div>

                <div
                    v-if="
                        awsTags(selectedAsset) &&
                        awsTags(selectedAsset).length > 0
                    "
                    class="flex flex-col text-sm"
                >
                    <span class="mb-1 text-gray-500">Tags</span>

                    <DetailsContainer
                        :array="awsTags(selectedAsset)"
                        class="rounded-lg"
                    />
                </div>
            </div>

            <div
                v-if="['S3Bucket'].includes(selectedAsset.typeName)"
                class="flex flex-col text-sm"
            >
                <span class="mb-1 text-sm text-gray-500"
                    >Bucket Versioning Enabled</span
                >
                <span class="text-gray-700 capitalize">{{
                    s3BucketVersioningEnabled(selectedAsset)
                }}</span>
            </div>

            <div
                v-if="['S3Object'].includes(selectedAsset.typeName)"
                class="flex flex-col w-full gap-y-5"
            >
                <div class="flex flex-col text-sm">
                    <div class="flex items-center mb-1 text-gray-500">
                        <span>Object Key</span>
                        <a-tooltip title="Copy">
                            <div
                                @click="
                                    handleCopyValue(
                                        s3ObjectKey(selectedAsset),
                                        'Object Key'
                                    )
                                "
                            >
                                <AtlanIcon
                                    icon="CopyOutlined"
                                    class="w-auto ml-1 cursor-pointer mb-0.5"
                                /></div
                        ></a-tooltip>
                    </div>
                    <span class="text-gray-700">{{
                        s3ObjectKey(selectedAsset)
                    }}</span>
                </div>
                <div class="flex flex-col text-sm">
                    <span class="mb-1 text-gray-500">Storage Class</span>

                    <span class="text-gray-700">{{
                        s3ObjectStorageClass(selectedAsset)
                    }}</span>
                </div>

                <div class="flex flex-col text-sm">
                    <span class="mb-1 text-gray-500">Last Modified Time</span>

                    <span class="text-gray-700">{{
                        s3ObjectLastModifiedTime(selectedAsset)
                    }}</span>
                </div>
                <div class="flex flex-col text-sm">
                    <span class="mb-1 text-gray-500">Object Version Id</span>

                    <span class="text-gray-700">{{
                        s3ObjectVersionId(selectedAsset)
                    }}</span>
                </div>
            </div>

            <div
                v-if="['DataStudioAsset'].includes(selectedAsset.typeName)"
                class="flex flex-col w-full gap-y-5"
            >
                <div class="flex flex-col text-sm">
                    <span class="mb-1 text-gray-500"
                        >Trashed Data Studio Asset</span
                    >

                    <span class="text-gray-700">{{
                        isTrashedDataStudioAsset(selectedAsset) ? 'Yes' : 'No'
                    }}</span>
                </div>
                <div class="flex flex-col text-sm">
                    <span class="mb-1 text-gray-500">Google Service</span>

                    <span class="text-gray-700">{{
                        googleService(selectedAsset)
                    }}</span>
                </div>

                <div class="flex flex-col text-sm">
                    <span class="mb-1 text-gray-500">Google Project Name</span>

                    <span class="text-gray-700">{{
                        googleProjectName(selectedAsset)
                    }}</span>
                </div>
                <div class="flex flex-col text-sm">
                    <div class="flex items-center mb-1 text-gray-500">
                        <span>Google Project ID</span>
                        <a-tooltip title="Copy">
                            <div
                                @click="
                                    handleCopyValue(
                                        googleProjectId(selectedAsset),
                                        'Google Project ID'
                                    )
                                "
                            >
                                <AtlanIcon
                                    icon="CopyOutlined"
                                    class="w-auto ml-1 cursor-pointer mb-0.5"
                                /></div
                        ></a-tooltip>
                    </div>
                    <span class="text-gray-700">{{
                        googleProjectId(selectedAsset)
                    }}</span>
                </div>
                <div class="flex flex-col text-sm">
                    <span class="mb-1 text-gray-500"
                        >Google Project Number</span
                    >

                    <span class="text-gray-700">{{
                        googleProjectNumber(selectedAsset)
                    }}</span>
                </div>
            </div>

            <a-divider
                v-if="
                    ['S3Object', 'S3Bucket', 'DataStudioAsset'].includes(
                        selectedAsset.typeName
                    )
                "
                dashed
                class="my-0 border-gray-500"
            ></a-divider>

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
                        <template
                            v-if="
                                modifiedBy(selectedAsset)?.startsWith(
                                    'service-account-apikey-'
                                )
                            "
                        >
                            <div
                                class="flex items-center py-1 pl-2 pr-2 text-sm text-gray-700 bg-white border rounded-full gap-x-1"
                            >
                                <AtlanIcon icon="Key" class="h-3" />
                                <div class="">API Token</div>
                            </div>
                        </template>
                        <PopOverUser v-else :item="modifiedBy(selectedAsset)">
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
                v-if="lastSyncRunAt(selectedAsset, true)"
                class="flex flex-col text-sm"
            >
                <span class="mb-1 text-gray-500"
                    >Last synced at (on Atlan)</span
                >

                <div class="flex flex-col">
                    <router-link
                        v-if="role === 'Admin'"
                        :to="lastSyncRun(selectedAsset)?.url"
                        class="text-primary hover:underline"
                    >
                        {{ lastSyncRunAt(selectedAsset, true) }} ({{
                            lastSyncRunAt(selectedAsset, false)
                        }})
                    </router-link>
                    <span v-else class="text-sm text-gray-700"
                        >{{ lastSyncRunAt(selectedAsset, true) }} ({{
                            lastSyncRunAt(selectedAsset, false)
                        }})
                    </span>
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
                        <template
                            v-if="
                                createdBy(selectedAsset)?.startsWith(
                                    'service-account-apikey-'
                                )
                            "
                        >
                            <div
                                class="flex items-center py-1 pl-2 pr-2 text-sm text-gray-700 bg-white border rounded-full gap-x-1"
                            >
                                <AtlanIcon icon="Key" class="h-3" />
                                <div class="">API token</div>
                            </div>
                        </template>
                        <PopOverUser v-else :item="createdBy(selectedAsset)">
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
    import DetailsContainer from '@common/assets/misc/detailsOverflowContainer.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import map from '~/constant/accessControl/map'

    import { useUserPreview } from '~/composables/user/showUserPreview'
    import UserPill from '@/common/pills/user.vue'
    import PopOverUser from '@/common/popover/user/user.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { capitalizeFirstLetter } from '~/utils/string'
    import { copyToClipboard } from '~/utils/clipboard'
    import whoami from '~/composables/user/whoami'
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'

    export default defineComponent({
        name: 'PropertiesWidget',
        components: {
            UserPill,
            PopOverUser,
            ConnectionInfo,
            PreviewTabsIcon,
            DetailsContainer,
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
            tab: {
                type: Object,
                required: false,
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
                lastSyncRun,
                lastSyncRunAt,
                sourceId,
                s3ObjectLastModifiedTime,
                s3ObjectStorageClass,
                s3ObjectKey,
                s3ObjectVersionId,
                awsArn,
                awsPartition,
                awsRegion,
                awsAccountId,
                awsResourceId,
                awsOwnerName,
                awsTags,
                s3BucketVersioningEnabled,
                googleService,
                googleProjectName,
                googleProjectId,
                googleProjectNumber,
                isTrashedDataStudioAsset,
            } = useAssetInfo()

            const { role } = whoami()
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
                lastSyncRun,
                sourceId,
                s3ObjectLastModifiedTime,
                s3ObjectStorageClass,
                s3ObjectKey,
                s3ObjectVersionId,
                awsArn,
                awsPartition,
                awsRegion,
                awsAccountId,
                awsResourceId,
                awsOwnerName,
                awsTags,
                s3BucketVersioningEnabled,
                googleService,
                googleProjectName,
                googleProjectId,
                googleProjectNumber,
                isTrashedDataStudioAsset,
                map,
                role,
            }
        },
    })
</script>
