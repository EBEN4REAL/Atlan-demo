<template>
    <div class="flex flex-col w-full h-full pt-4 overflow-auto gap-y-4">
        <div class="flex items-center justify-between px-5">
            <span class="font-semibold text-gray-500">Overview</span>
            <span v-if="isLoading" class="flex items-center">
                <a-spin
                    size="small"
                    icon="Loader"
                    class="w-auto h-4 mr-1 animate-spin"
                ></a-spin>
                Saving</span
            >
        </div>
        <AnnouncementWidget
            class="mx-5"
            :selected-asset="selectedAsset"
        ></AnnouncementWidget>

        <div class="px-5" v-if="webURL(selectedAsset)">
            <a-button
                block
                @click="handlePreviewClick"
                class="flex items-center justify-between"
                ><div class="flex items-center">
                    <img
                        :src="getConnectorImage(selectedAsset)"
                        class="h-5 mr-1"
                    />
                    {{
                        assetTypeLabel(selectedAsset) || selectedAsset.typeName
                    }}
                </div>
                <AtlanIcon icon="External" />
            </a-button>
        </div>
        <div
            v-if="isSelectedAssetHaveRowsAndColumns(selectedAsset)"
            class="flex items-center w-full gap-16 px-5"
        >
            <SQL
                v-if="
                    selectedAsset.typeName == 'View' ||
                    selectedAsset.typeName == 'MaterialisedView'
                "
                :sql="definition(selectedAsset)"
            >
                <div class="flex flex-col text-sm cursor-pointer">
                    <span class="mb-2 text-sm text-gray-500">Definition</span>
                    <span class="text-primary">SQL</span>
                </div>
            </SQL>
            <!-- <RowInfoHoverCard
                v-if="
                    selectedAsset.typeName == 'Table' ||
                    selectedAsset.typeName == 'TablePartition'
                "
                :image="getConnectorImage(selectedAsset)"
                :row-count="rowCount(selectedAsset)"
                :size-bytes="sizeBytes(selectedAsset)"
                :source-updated-at="sourceUpdatedAt(selectedAsset)"
                :source-updated-at-raw="sourceUpdatedAt(selectedAsset, true)"
                :source-created-at="sourceCreatedAt(selectedAsset)"
                :source-created-at-raw="sourceCreatedAt(selectedAsset, true)"
            > -->
            <div
                v-if="rowCount(selectedAsset) > 0"
                class="flex flex-col text-sm cursor-pointer"
            >
                <span class="mb-2 text-sm text-gray-500">Rows</span>
                <span class="text-gray-700">{{ rowCount(selectedAsset) }}</span>
            </div>
            <!-- </RowInfoHoverCard> -->
            <div
                class="flex flex-col text-sm cursor-pointer"
                @click="switchTab(selectedAsset, 'Columns')"
            >
                <span class="mb-2 text-sm text-gray-500">Columns</span>
                <span class="font-semibold text-primary">{{
                    columnCount(selectedAsset)
                }}</span>
            </div>
            <div
                class="flex flex-col text-sm cursor-pointer"
                v-if="sizeBytes(selectedAsset) > 0"
            >
                <span class="mb-2 text-sm text-gray-500">Size</span>
                <span class="text-gray-700">{{
                    sizeBytes(selectedAsset)
                }}</span>
            </div>
        </div>

        <div
            v-if="selectedAsset.typeName?.toLowerCase() === 'column'"
            class="flex flex-col px-5 text-sm"
        >
            <span class="mb-2 text-sm text-gray-500">Data Type</span>

            <div class="flex items-center text-gray-700 gap-x-1">
                <div class="flex">
                    <component
                        :is="dataTypeCategoryImage(selectedAsset)"
                        class="h-4 text-gray-500"
                    />
                    <span class="ml-1 text-sm text-gray-700">{{
                        dataType(selectedAsset)
                    }}</span>
                </div>

                <div
                    class="flex"
                    v-if="
                        isPrimary(selectedAsset) ||
                        isDist(selectedAsset) ||
                        isPartition(selectedAsset)
                    "
                >
                    <AtlanIcon
                        icon="PrimaryKey"
                        class="mb-0.5 text-yellow-500"
                    ></AtlanIcon>

                    <span
                        class="ml-1 text-sm text-gray-700"
                        v-if="isPrimary(selectedAsset)"
                        >Primary Key</span
                    >
                    <span
                        class="ml-1 text-sm text-gray-700"
                        v-if="isDist(selectedAsset)"
                        >Dist Key</span
                    >
                    <span
                        class="ml-1 text-sm text-gray-700"
                        v-if="isPartition(selectedAsset)"
                        >Partition Key</span
                    >
                </div>
            </div>
        </div>
        <div class="flex flex-col">
            <div
                class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500 "
            >
                <span> Description</span>
            </div>

            <Description v-model="localDescription" class="mx-4" />
        </div>
        <div
            class="flex flex-col"
            v-if="selectedAsset.guid && selectedAsset.typeName !== 'Column'"
        >
            <p
                class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500 "
            >
                Owners
            </p>
            <Owners
                v-model="localOwners"
                :guid="selectedAsset.guid"
                @change="handleOwnersChange"
                class="px-5"
            />
        </div>

        <div class="flex flex-col">
            <p
                class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500 "
            >
                Classification
            </p>
            <Classification
                :guid="selectedAsset.guid"
                v-model="localClassifications"
                @change="handleClassificationChange"
                class="px-5"
            >
            </Classification>
        </div>

        <div class="flex flex-col">
            <p
                class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500 "
            >
                Terms
            </p>
            <Terms :selected-asset="selectedAsset" class="px-5"></Terms>
        </div>

        <CertificationPopover :selected-asset="selectedAsset" placement="left">
            <Certificate :selected-asset="selectedAsset" />
        </CertificationPopover>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        PropType,
        toRefs,
        inject,
        ref,
        watch,
        Ref,
    } from 'vue'
    import { whenever } from '@vueuse/core'
    import AnnouncementWidget from '@/common/widgets/announcement/index.vue'
    import SQL from '@/assets/preview/popover/sql.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import RowInfoHoverCard from '@/assets/preview/popover/rowInfo.vue'
    import Description from '@/common/input/description/index.vue'
    import Owners from '@/common/input/owner/index.vue'
    import Certificate from '@/common/input/certificate/index.vue'
    import Classification from '@/common/input/classification/index.vue'
    import Terms from '@/common/input/terms/index.vue'
    import CertificationPopover from '@/assets/preview/popover/certification.vue'
    import updateAsset from '~/composables/discovery/updateAsset'
    import useSetClassifications from '~/composables/discovery/useSetClassifications'
    import { message, Modal } from 'ant-design-vue'

    // import useAssetInfo from '~/composables/asset/useAssetInfo'
    // import { assetInterface } from '~/types/assets/asset.interface'
    // import Description from '@common/sidebar/description.vue'

    // import Experts from '@common/sidebar/experts.vue'
    // import Status from '@common/sidebar/status.vue'
    // import Query from '@common/sidebar/query.vue'
    // import { format } from 'sql-formatter'

    export default defineComponent({
        name: 'AssetDetails',
        components: {
            // Experts,
            Description,
            AnnouncementWidget,
            // Status,
            Owners,
            Classification,
            // Query,
            Certificate,
            RowInfoHoverCard,
            SQL,
            Terms,
            CertificationPopover,
        },
        setup(props) {
            const actions = inject('actions')
            const selectedAsset = inject('selectedAsset')
            const switchTab = inject('switchTab')

            const {
                title,
                getConnectorImage,
                assetType,
                rowCount,
                sizeBytes,
                dataType,
                columnCount,
                databaseName,
                schemaName,
                connectorName,
                connectionName,
                dataTypeCategoryLabel,
                dataTypeCategoryImage,
                isDist,
                isPartition,
                description,
                isPrimary,
                sourceUpdatedAt,
                ownerGroups,
                ownerUsers,
                sourceCreatedAt,
                classifications,
                definition,
                webURL,
                assetTypeLabel,
            } = useAssetInfo()

            const entity = ref({
                guid: selectedAsset.value.guid,
                typeName: selectedAsset.value.typeName,
                attributes: {
                    name: selectedAsset.value.attributes?.name,
                    qualifiedName:
                        selectedAsset.value.attributes?.qualifiedName,
                    tenantId: 'default',
                },
            })
            const body = ref({
                entities: [],
            })

            const { mutate, isLoading, isReady, error } = updateAsset(body)

            const localDescription = ref(description(selectedAsset?.value))

            const currentMessage = ref('')

            watch(localDescription, (newVal, prevVal) => {
                if (newVal !== prevVal) {
                    entity.value.attributes.userDescription =
                        localDescription.value
                    body.value.entities = [entity.value]
                    currentMessage.value = 'Description has been updated'
                    mutate()
                }
            })

            whenever(isReady, () => {
                message.success(currentMessage.value)
            })

            whenever(error, () => {
                message.error('Something went wrong. Please try again')
            })

            const localOwners = ref({
                ownerUsers: ownerUsers(selectedAsset.value),
                ownerGroups: ownerGroups(selectedAsset.value),
            })

            watch(localOwners.value.ownerUsers, (newVal, prevVal) => {})

            const handleOwnersChange = () => {
                let isChanged = false
                if (
                    entity.value.attributes.ownerUsers?.sort().toString() !==
                    localOwners.value?.ownerUsers.sort().toString()
                ) {
                    entity.value.attributes.ownerUsers =
                        localOwners.value?.ownerUsers
                    isChanged = true
                }
                if (
                    entity.value.attributes.ownerGroups?.sort().toString() !==
                    localOwners.value?.ownerGroups.sort().toString()
                ) {
                    entity.value.attributes.ownerGroups =
                        localOwners.value?.ownerGroups
                    isChanged = true
                }

                if (isChanged) {
                    body.value.entities = [entity.value]
                    currentMessage.value = 'Owners has been updated'

                    mutate()
                }
            }

            const localClassifications = ref(
                classifications(selectedAsset.value)
            )

            const classificationBody = ref({
                guidHeaderMap: {
                    [selectedAsset.value.guid]: {
                        classifications: localClassifications.value,
                    },
                },
            })

            const { mutate: mutateClassification } =
                useSetClassifications(classificationBody)

            const handleClassificationChange = () => {
                console.log('handle change')
                classificationBody.value = {
                    guidHeaderMap: {
                        [selectedAsset.value.guid]: {
                            ...entity.value,
                            classifications: localClassifications.value,
                        },
                    },
                }

                mutateClassification()
            }

            const isSelectedAssetHaveRowsAndColumns = (selectedAsset) => {
                if (
                    selectedAsset.typeName === 'View' ||
                    selectedAsset.typeName === 'Table' ||
                    selectedAsset.typeName === 'TablePartition' ||
                    selectedAsset.typeName === 'MaterialisedView'
                ) {
                    return true
                }

                return false
            }

            const handleEditClick = () => {
                console.log('edit click')
            }

            const handlePreviewClick = () => {
                window.open(webURL(selectedAsset.value), '_blank').focus()
            }

            return {
                localDescription,
                selectedAsset,
                body,

                localClassifications,
                handleClassificationChange,
                currentMessage,
                isSelectedAssetHaveRowsAndColumns,
                title,
                getConnectorImage,
                assetType,
                rowCount,
                sizeBytes,
                dataType,
                columnCount,
                databaseName,
                schemaName,
                localOwners,
                connectorName,
                connectionName,
                dataTypeCategoryLabel,
                dataTypeCategoryImage,
                isDist,
                isPartition,
                isPrimary,
                ownerGroups,
                ownerUsers,
                definition,
                sourceUpdatedAt,
                sourceCreatedAt,
                entity,
                isLoading,
                classificationBody,
                actions,
                switchTab,
                webURL,
                handlePreviewClick,
                assetTypeLabel,
                error,
                handleOwnersChange,
            }
        },
    })
</script>
