<template>
    <div class="flex flex-col w-full h-full px-5 pt-4 overflow-auto gap-y-5">
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
                    class="text-xs text-gray-700"
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
                    <UserPill
                        :username="sourceCreatedBy(selectedAsset)"
                    ></UserPill>
                </div>

                <span class="text-xs text-gray-700"
                    >{{ sourceCreatedAt(selectedAsset, true) }} ({{
                        sourceCreatedAt(selectedAsset, false)
                    }})</span
                >
            </div>
        </div>

        <div
            v-if="
                !isGTC(selectedAsset) &&
                !['Connection'].includes(selectedAsset.typeName)
            "
            class="flex flex-col text-sm"
        >
            <span class="mb-1 text-gray-500">Connection</span>
            <div class="flex items-center">
                <img :src="getConnectorImage(selectedAsset)" class="h-4 mr-1" />
                <span>{{
                    `${connectorName(selectedAsset)}/${connectionName(
                        selectedAsset
                    )}`
                }}</span>
            </div>
        </div>
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
            <span class="mb-1 text-gray-500">Last updated</span>
            <div class="flex flex-col">
                <div class="flex mb-2">
                    <UserPill :username="modifiedBy(selectedAsset)"></UserPill>
                </div>

                <span class="text-xs text-gray-700"
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
                <div class="flex mb-2">
                    <UserPill :username="createdBy(selectedAsset)"></UserPill>
                </div>
                <span class="text-xs text-gray-700"
                    >{{ createdAt(selectedAsset, true) }} ({{
                        createdAt(selectedAsset, false)
                    }})</span
                >
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'

    import Owners from '@/common/input/owner/index.vue'
    import useConnectionData from '~/composables/connection/useConnectionData'
    import UserPill from '@/common/pills/user.vue'

    import { capitalizeFirstLetter } from '~/utils/string'

    export default defineComponent({
        name: 'PropertiesWidget',
        components: {
            UserPill,
            Owners,
        },
        props: {
            selectedAsset: {
                type: Object,
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
            } = useAssetInfo()

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
                sourceUpdatedBy,
                sourceCreatedBy,
            }
        },
    })
</script>
