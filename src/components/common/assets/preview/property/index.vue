<template>
    <div class="flex flex-col w-full h-full px-4 pt-4 overflow-auto gap-y-4">
        <div class="flex items-center">
            <img :src="getConnectorImage(selectedAsset)" class="h-4 mr-1" />
            <span
                >{{ capitalizeFirstLetter(connectorName(selectedAsset)) }}
            </span>
        </div>

        <div class="flex flex-col text-sm">
            <span class="mb-2 text-gray-500">Updated</span>
            <div class="flex flex-col">
                <div class="flex mb-2">
                    <UserPill
                        :username="sourceUpdatedBy(selectedAsset)"
                    ></UserPill>
                </div>

                <span class="text-xs text-gray-700"
                    >{{ sourceUpdatedAt(selectedAsset, true) }} ({{
                        sourceUpdatedAt(selectedAsset, false)
                    }})</span
                >
            </div>
        </div>

        <div class="flex flex-col text-sm">
            <span class="mb-2 text-gray-500">Created</span>
            <div class="flex flex-col">
                <div class="flex mb-2">
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

        <div class="mt-3">Atlan</div>

        <div class="flex flex-col text-sm">
            <span class="mb-2 text-gray-500">Connection</span>
            <div class="flex items-center">
                <img :src="getConnectorImage(selectedAsset)" class="h-4 mr-1" />
                <span>{{
                    `${connectorName(selectedAsset)}/${connectionName(
                        selectedAsset
                    )}`
                }}</span>
            </div>
        </div>

        <div class="flex flex-col text-sm">
            <span class="mb-2 text-gray-500">Connection Owners</span>
            <!-- {{ getConnection(connectionQualifiedName(selectedAsset)) }} -->

            <Owners
                :selected-asset="
                    getConnection(connectionQualifiedName(selectedAsset))
                "
                :include-label="false"
            />
        </div>

        <div class="flex flex-col text-sm">
            <span class="mb-2 text-gray-500">Updated</span>
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
            <span class="mb-2 text-gray-500">Unique ID (GUID)</span>
            <span class="text-gray-700">{{ selectedAsset?.guid }}</span>
        </div>

        <div class="flex flex-col text-sm">
            <span class="mb-2 text-gray-500">Qualified Name</span>
            <span class="text-gray-700">{{
                qualifiedName(selectedAsset)
            }}</span>
        </div>

        <div class="flex flex-col text-sm">
            <span class="mb-2 text-gray-500">Created</span>

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

        <p class="text-sm font-semibold text-gray-500 uppercase">Snowfalke</p>
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
            } = useAssetInfo()

            const { getConnection } = useConnectionData()

            return {
                connectorName,
                connectionName,
                sourceUpdatedAt,
                sourceCreatedAt,
                qualifiedName,
                createdAt,
                modifiedAt,
                modifiedBy,

                getConnectorImage,
                createdBy,
                getConnection,
                connectionQualifiedName,
                ownerUsers,
                capitalizeFirstLetter,
                sourceUpdatedBy,
                sourceCreatedBy,
            }
        },
    })
</script>
