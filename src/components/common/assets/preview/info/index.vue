<template>
    <div class="flex flex-col w-full h-full pt-4 overflow-auto gap-y-4">
        <div class="flex items-center justify-between px-5">
            <span class="font-semibold text-gray-500">Overview</span>
            <span
                v-if="isLoading || isLoadingClassification"
                class="flex items-center"
            >
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

        <div
            class="flex flex-col"
            v-if="
                isGTC(selectedAsset) || selectedAsset.typeName === 'Connection'
            "
        >
            <Shortcut shortcutKey="n" action="set description" placement="left">
                <div
                    class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500 "
                >
                    <span> Name</span>
                </div>
            </Shortcut>

            <Name
                v-model="localName"
                class="mx-4"
                @change="handleChangeName"
                ref="nameRef"
            />
        </div>

        <Connection v-if="selectedAsset.typeName === 'Connection'"></Connection>

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
                @click="showSampleDataModal"
            >
                <span class="mb-2 text-sm text-gray-500">Rows</span>
                <span class="font-semibold text-primary">{{
                    rowCount(selectedAsset)
                }}</span>
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
                        class="h-4 text-gray-500 mr-0.5 mb-0.5"
                    />
                    <span class="text-sm tracking-wider text-gray-700">{{
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
            <Shortcut shortcutKey="d" action="set description" placement="left">
                <div
                    class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500 "
                >
                    <span> Description</span>
                </div>
            </Shortcut>

            <Description
                ref="descriptionRef"
                v-model="localDescription"
                class="mx-4"
                @change="handleChangeDescription"
            />
        </div>
        <div v-if="selectedAsset.guid && selectedAsset.typeName === 'Query'">
            <SavedQuery :selected-asset="selectedAsset" class="mx-4" />
        </div>
        <div
            class="flex flex-col"
            v-if="selectedAsset.guid && selectedAsset.typeName !== 'Column'"
        >
            <Shortcut shortcutKey="o" action="set owners" placement="left">
                <div
                    class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500 "
                >
                    <span> Owners</span>
                </div>
            </Shortcut>

            <Owners
                v-model="localOwners"
                :guid="selectedAsset.guid"
                @change="handleOwnersChange"
                class="px-5"
            />
        </div>

        <div
            v-if="
                ![
                    'AtlasGlossary',
                    'AtlasGlossaryCategory',
                    'Connection',
                ].includes(selectedAsset.typeName)
            "
            class="flex flex-col"
        >
            <Shortcut
                shortcutKey="t"
                action="set classification"
                placement="left"
            >
                <div
                    class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500 "
                >
                    <span> Classification</span>
                </div>
            </Shortcut>

            <Classification
                :guid="selectedAsset.guid"
                v-model="localClassifications"
                @change="handleClassificationChange"
                class="px-5"
            >
            </Classification>
        </div>

        <div
            v-if="
                ![
                    'AtlasGlossary',
                    'AtlasGlossaryTerm',
                    'AtlasGlossaryCategory',
                    'Connection',
                ].includes(selectedAsset.typeName)
            "
            class="flex flex-col"
        >
            <p
                class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500 "
            >
                Terms
            </p>
            <Terms :selected-asset="selectedAsset" class="px-5"></Terms>
        </div>

        <div
            v-if="
                !['AtlasGlossary', 'AtlasGlossaryCategory'].includes(
                    selectedAsset.typeName
                )
            "
            class="flex flex-col"
            ref="animationPoint"
        >
            <Shortcut shortcutKey="c" action="set certificate" placement="left">
                <div
                    class="flex items-center justify-between px-5 mb-1 text-sm text-gray-500 "
                >
                    <span> Certificate</span>
                </div>
            </Shortcut>

            <Certificate
                :selected-asset="selectedAsset"
                class="px-5"
                v-model="localCertificate"
                @change="handleChangeCertificate"
            />
        </div>
        <a-modal
            v-model:visible="sampleDataVisible"
            :footer="null"
            :closable="false"
            width="1000px"
            :class="$style.sampleDataModal"
        >
            <SampleDataTable :asset="selectedAsset" />
        </a-modal>
    </div>
</template>

<script lang="ts">
    import {
        computed,
        defineComponent,
        defineAsyncComponent,
        toRefs,
        inject,
        ref,
        watch,
        Ref,
        reactive,
    } from 'vue'
    import { whenever } from '@vueuse/core'
    import AnnouncementWidget from '@/common/widgets/announcement/index.vue'
    import SQL from '@/common/popover/sql.vue'
    import useAssetInfo from '~/composables/discovery/useAssetInfo'
    import RowInfoHoverCard from '@/common/popover/rowInfo.vue'
    import Description from '@/common/input/description/index.vue'
    import Name from '@/common/input/name/index.vue'
    import Owners from '@/common/input/owner/index.vue'
    import Certificate from '@/common/input/certificate/index.vue'
    import Classification from '@/common/input/classification/index.vue'
    import Terms from '@/common/input/terms/index.vue'
    import SavedQuery from '@common/hovercards/savedQuery.vue'
    import updateAsset from '~/composables/discovery/updateAsset'
    import useSetClassifications from '~/composables/discovery/useSetClassifications'
    import { message, Modal } from 'ant-design-vue'
    import { useCurrentUpdate } from '~/composables/discovery/useCurrentUpdate'
    import whoami from '~/composables/user/whoami'
    import confetti from '~/utils/confetti'
    import Shortcut from '@/common/popover/shortcut.vue'

    import Connection from './connection.vue'

    export default defineComponent({
        name: 'AssetDetails',
        components: {
            Connection,
            // Experts,
            Description,
            Name,
            AnnouncementWidget,
            // Status,
            Owners,
            Classification,
            SavedQuery,
            Certificate,
            RowInfoHoverCard,
            SQL,
            Terms,
            Shortcut,
            SampleDataTable: defineAsyncComponent(
                () =>
                    import(
                        '@common/assets/profile/tabs/overview/nonBi/sampleData.vue'
                    )
            ),
        },
        setup(props) {
            const actions = inject('actions')
            const selectedAsset = inject('selectedAsset')
            const switchTab = inject('switchTab')
            const isConfetti = ref(false)

            const sampleDataVisible = ref<boolean>(false)

            const showSampleDataModal = () => {
                sampleDataVisible.value = true
            }

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
                getAnchorGuid,
                certificateStatus,
                certificateUpdatedAt,
                certificateStatusMessage,
                certificateUpdatedBy,
                isGTC,
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

            const guid = ref()

            const {
                asset,
                mutate: mutateUpdate,
                isReady: isUpdateReady,
            } = useCurrentUpdate({
                id: guid,
            })

            if (
                [
                    'AtlasGlossary',
                    'AtlasGlossaryTerm',
                    'AtlasGlossaryCategory',
                ].includes(entity.value.typeName)
            ) {
                entity.value.relationshipAttributes = {
                    anchor: {
                        typeName: 'AtlasGlossary',
                        guid: getAnchorGuid(selectedAsset.value),
                    },
                }
            }

            const body = ref({
                entities: [],
            })

            const { mutate, isLoading, isReady, error } = updateAsset(body)

            const localName = ref(title(selectedAsset?.value))
            const localDescription = ref(description(selectedAsset?.value))
            const localCertificate = ref({
                certificateStatus: certificateStatus(selectedAsset.value),
                certificateUpdatedAt: certificateUpdatedAt(selectedAsset.value),
                certificateUpdatedBy: certificateUpdatedBy(selectedAsset.value),
                certificateStatusMessage: certificateStatusMessage(
                    selectedAsset.value
                ),
            })
            const localOwners = ref({
                ownerUsers: ownerUsers(selectedAsset.value),
                ownerGroups: ownerGroups(selectedAsset.value),
            })

            const localClassifications = ref(
                classifications(selectedAsset.value)
            )

            const currentMessage = ref('')

            const nameRef = ref(null)
            const descriptionRef = ref(null)

            // Name Change
            const handleChangeName = () => {
                if (title(selectedAsset?.value) !== localName.value) {
                    entity.value.attributes.name = localName.value
                    body.value.entities = [entity.value]
                    currentMessage.value = 'Name has been updated'
                    mutate()
                }
            }

            // Description Change
            const handleChangeDescription = () => {
                if (
                    description(selectedAsset?.value) !== localDescription.value
                ) {
                    entity.value.attributes.userDescription =
                        localDescription.value
                    body.value.entities = [entity.value]
                    currentMessage.value = 'Description has been updated'
                    mutate()
                }
            }

            // Owners Change
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

            // error handling
            whenever(error, () => {
                if (title(selectedAsset?.value) !== localName.value) {
                    localName.value = title(selectedAsset?.value)
                    nameRef.value?.handleReset(localName.value)
                }
                if (
                    description(selectedAsset?.value) !== localDescription.value
                ) {
                    localDescription.value = description(selectedAsset?.value)
                    descriptionRef.value?.handleReset(localDescription.value)
                }
                message.error('Something went wrong. Please try again')
            })

            whenever(isReady, () => {
                message.success(currentMessage.value)
                guid.value = selectedAsset.value.guid
                rainConfettis()
                mutateUpdate()
            })

            const updateList = inject('updateList')
            whenever(isUpdateReady, () => {
                if (
                    asset.value.typeName !== 'AtlasGlossary' &&
                    asset.value.typeName !== 'AtlasGlossaryCategory' &&
                    asset.value.typeName !== 'AtlasGlossaryTerm'
                ) {
                    updateList(asset.value)
                }
            })

            const classificationBody = ref({
                guidHeaderMap: {
                    [selectedAsset.value.guid]: {
                        classifications: localClassifications.value,
                    },
                },
            })

            const {
                mutate: mutateClassification,
                isLoading: isLoadingClassification,
                isReady: isReadyClassification,
                error: isErrorClassification,
            } = useSetClassifications(classificationBody)

            const handleClassificationChange = () => {
                classificationBody.value = {
                    guidHeaderMap: {
                        [selectedAsset.value.guid]: {
                            ...entity.value,
                            classifications: localClassifications.value,
                        },
                    },
                }
                currentMessage.value = 'Classifications have been updated'
                mutateClassification()
            }

            whenever(isReadyClassification, () => {
                message.success(currentMessage.value)
                guid.value = selectedAsset.value.guid
                mutateUpdate()
            })

            whenever(isErrorClassification, () => {
                message.error('Something went wrong. Please try again')
            })

            const { username } = whoami()
            const handleChangeCertificate = () => {
                if (
                    localCertificate.value.certificateStatus !==
                        certificateStatus(selectedAsset.value) ||
                    localCertificate.value.certificateStatusMessage !==
                        certificateStatusMessage(selectedAsset.value)
                ) {
                    if (
                        localCertificate.value.certificateStatus === 'VERIFIED'
                    ) {
                        isConfetti.value = true
                    } else {
                        isConfetti.value = false
                    }

                    entity.value.attributes.certificateStatus =
                        localCertificate.value.certificateStatus

                    entity.value.attributes.certificateStatusMessage =
                        localCertificate.value.certificateStatusMessage
                    body.value.entities = [entity.value]
                    currentMessage.value = 'Certificate has been updated'
                    mutate()
                }
            }

            const animationPoint = ref(null)
            const rainConfettis = () => {
                const config = {
                    angle: 45,
                    startVelocity: 10,
                    spread: 200,
                    elementCount: 100,
                    colors: [
                        '#2251cc',
                        '#2251cc',
                        '#82b54b',
                        '#e94a3f',
                        '#faa040',
                    ],
                    width: '0.3rem',
                    height: '0.3rem',
                }
                if (isConfetti.value) {
                    if (animationPoint) {
                        confetti(animationPoint.value, config)
                    }
                }
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

            const handlePreviewClick = () => {
                window.open(webURL(selectedAsset.value), '_blank').focus()
            }

            return {
                localDescription,
                selectedAsset,
                body,
                isLoadingClassification,
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
                getAnchorGuid,
                certificateStatus,
                certificateUpdatedAt,
                certificateUpdatedBy,
                localCertificate,
                handleChangeCertificate,
                certificateStatusMessage,
                mutateUpdate,
                updateList,
                username,
                animationPoint,
                rainConfettis,
                isConfetti,
                isGTC,
                localName,
                handleChangeName,
                handleChangeDescription,
                nameRef,
                descriptionRef,
                sampleDataVisible,
                showSampleDataModal,
            }
        },
    })
</script>

<style lang="less" module>
    .sampleDataModal {
        :global(.ant-modal-body) {
            @apply p-2 !important;
        }
    }
</style>
