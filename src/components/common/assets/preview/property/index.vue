<template>
    <div class="flex flex-col w-full h-full px-5 py-4 overflow-auto gap-y-5">
        <div class="flex items-center justify-between">
            <span class="font-semibold text-gray-500">Properties</span>
        </div>
        <div
            class="flex flex-col text-sm"
            v-if="
                sourceUpdatedBy(selectedAsset) ||
                sourceUpdatedAt(selectedAsset, true)
            "
        >
            <span class="mb-1 text-gray-500">Source updated</span>
            <div class="flex flex-col">
                <div class="flex mb-2" v-if="sourceUpdatedBy(selectedAsset)">
                    {{ sourceUpdatedBy(selectedAsset) }}
                </div>

                <span
                    class="text-gray-700"
                    v-if="sourceUpdatedAt(selectedAsset, true)"
                    >{{ sourceUpdatedAt(selectedAsset, true) }} ({{
                        sourceUpdatedAt(selectedAsset, false)
                    }})</span
                >
            </div>
        </div>

        <div
            class="flex flex-col text-sm"
            v-if="
                sourceCreatedBy(selectedAsset) ||
                sourceCreatedAt(selectedAsset, true)
            "
        >
            <span class="mb-1 text-gray-500">Source created</span>
            <div class="flex flex-col">
                <div class="flex mb-2" v-if="sourceCreatedBy(selectedAsset)">
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
                ['LookerLook', 'LookerFolder'].includes(selectedAsset.typeName)
            "
            class="flex flex-col text-sm"
        >
            <span class="mb-1 text-gray-500">Source Content Metadata ID</span>

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
            <span class="mb-1 text-gray-500">Last updated by</span>
            <div class="flex flex-col">
                <div class="flex">
                    <PopOverUser :item="modifiedBy(selectedAsset)">
                        <UserPill
                            :username="modifiedBy(selectedAsset)"
                            @click="handleClickUser(modifiedBy(selectedAsset))"
                        ></UserPill
                    ></PopOverUser>
                </div>
            </div>
        </div>
        <div class="flex flex-col text-sm">
            <span class="mb-1 text-gray-500">Last updated at</span>
            <div class="flex flex-col">
                <span class="text-sm text-gray-700"
                    >{{ modifiedAt(selectedAsset, true) }} ({{
                        modifiedAt(selectedAsset, false)
                    }})</span
                >
            </div>
        </div>

        <div class="flex flex-col text-sm">
            <span class="mb-1 text-gray-500">Unique Identifier</span>
            <span class="text-gray-700">{{ selectedAsset?.guid }}</span>
        </div>

        <div v-if="!isGTC(selectedAsset)" class="flex flex-col text-sm">
            <span class="mb-1 text-gray-500">Qualified Name</span>
            <span class="text-gray-700 break-all">{{
                qualifiedName(selectedAsset)
            }}</span>
        </div>

        <div class="flex flex-col text-sm">
            <span class="mb-1 text-gray-500">Created</span>

            <div class="flex flex-col">
                <div class="flex">
                    <PopOverUser :item="createdBy(selectedAsset)">
                        <UserPill
                            :username="createdBy(selectedAsset)"
                            @click="handleClickUser(createdBy(selectedAsset))"
                        ></UserPill
                    ></PopOverUser>
                </div>
            </div>
        </div>
        <div class="flex flex-col text-sm">
            <span class="mb-1 text-gray-500">Created at</span>

            <div class="flex flex-col">
                <span class="text-sm text-gray-700"
                    >{{ createdAt(selectedAsset, true) }} ({{
                        createdAt(selectedAsset, false)
                    }})</span
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from 'vue'
    import ConnectionInfo from '@common/widgets/summary/types/connection.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    import { useUserPreview } from '~/composables/user/showUserPreview'
    import UserPill from '@/common/pills/user.vue'
    import PopOverUser from '@/common/popover/user/user.vue'
    import { assetInterface } from '~/types/assets/asset.interface'
    import { capitalizeFirstLetter } from '~/utils/string'

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
            } = useAssetInfo()

            const { showUserPreview, setUserUniqueAttribute } = useUserPreview()

            const handleClickUser = (username: string) => {
                setUserUniqueAttribute(username, 'username')
                showUserPreview({ allowed: ['about', 'assets', 'groups'] })
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
                sourceUpdatedBy,
                sourceCreatedBy,
                connectionGuid,
                resultMakerID,
                sourceMetadataId,
                sourceContentMetadataId,
            }
        },
    })
</script>
