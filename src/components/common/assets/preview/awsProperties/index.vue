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
                <span class="ml-1 font-semibold text-gray-500"
                    >AWS Properties</span
                >
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
                                <div class="">API key</div>
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
                class="flex flex-col text-sm"
                v-if="lastSyncRunAt(selectedAsset, true)"
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
                                <div class="">API key</div>
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
    import { defineComponent, PropType, ref, watch, toRefs } from 'vue'
    import ConnectionInfo from '@common/widgets/summary/types/connection.vue'
    import { message } from 'ant-design-vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import map from '~/constant/accessControl/map'

    import { useAssetAttributes } from '~/composables/discovery/useCurrentUpdate'
    import UserPill from '@/common/pills/user.vue'
    import PopOverUser from '@/common/popover/user/user.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { capitalizeFirstLetter } from '~/utils/string'
    import { copyToClipboard } from '~/utils/clipboard'
    import whoami from '~/composables/user/whoami'
    import PreviewTabsIcon from '~/components/common/icon/previewTabsIcon.vue'

    export default defineComponent({
        name: 'AWSProperties',
        components: {
            UserPill,
            PopOverUser,
            ConnectionInfo,
            PreviewTabsIcon,
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
        setup(props) {
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
                awsArn,
                awsPartition,
                awsService,
                awsRegion,
                awsAccountId,
                awsResourceId,
                awsOwnerName,
                awsOwnerId,
                awsTags,
            } = useAssetInfo()

            const handleCopyValue = async (value, type) => {
                await copyToClipboard(value)
                message.success(`${type} copied!`)
            }

            const { selectedAsset } = toRefs(props)

            const guid = ref()
            const s3Attributes = ref([
                'awsArn',
                'awsPartition',
                'awsService',
                'awsRegion',
                'awsAccountId',
                'awsResourceId',
                'awsOwnerName',
                'awsOwnerId',
                'awsTags',
            ])

            const { asset, mutate, isReady, isLoading } = useAssetAttributes({
                id: guid,
                attributes: s3Attributes,
            })

            watch(
                () => selectedAsset.value.guid,
                () => {
                    guid.value = selectedAsset.value?.guid
                    mutate()
                },
                {
                    immediate: true,
                }
            )

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
                map,
                awsArn,
                awsPartition,
                awsService,
                awsRegion,
                awsAccountId,
                awsResourceId,
                awsOwnerName,
                awsOwnerId,
                awsTags,
                isReady,
                isLoading,
                asset,
            }
        },
    })
</script>
