import { ref, inject } from 'vue'
import { message } from 'ant-design-vue'
import { whenever } from '@vueuse/core'
import updateAsset from '~/composables/discovery/updateAsset'
import useAssetInfo from '~/composables/discovery/useAssetInfo'
import { useCurrentUpdate } from '~/composables/discovery/useCurrentUpdate'
import useSetClassifications from '~/composables/discovery/useSetClassifications'
import confetti from '~/utils/confetti'
import { generateUUID } from '~/utils/helper/generator'
import { Entity } from '~/services/meta/entity/index'
import { assetInterface } from '~/types/assets/asset.interface'
import useAddEvent from '~/composables/eventTracking/useAddEvent'

export default function updateAssetAttributes(selectedAsset, isDrawer = false) {
    const {
        title,
        description,
        ownerGroups,
        ownerUsers,
        adminGroups,
        adminUsers,
        classifications,
        certificateStatus,
        certificateUpdatedAt,
        certificateStatusMessage,
        certificateUpdatedBy,
        getAnchorGuid,
        announcementMessage,
        announcementType,
        attributes,
        announcementTitle,
        readmeContent,
        meanings,
        categories,
        assignedEntities,
        allowQuery,
        allowQueryPreview,
        connectionRowLimit,
    } = useAssetInfo()

    const entity = ref({
        guid: selectedAsset.value.guid,
        typeName: selectedAsset.value.typeName,
        attributes: {
            name: selectedAsset.value.attributes?.name,
            qualifiedName: selectedAsset.value.attributes?.qualifiedName,
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

    if (['Query'].includes(entity.value.typeName)) {
        entity.value.attributes = {
            ...entity.value.attributes,
            parentQualifiedName: attributes(selectedAsset?.value)
                ?.parentQualifiedName,
            parent: attributes(selectedAsset?.value)?.parent,
            collectionQualifiedName: attributes(selectedAsset?.value)
                ?.collectionQualifiedName,
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
        certificateStatusMessage: certificateStatusMessage(selectedAsset.value),
    })
    const localOwners = ref({
        ownerUsers: ownerUsers(selectedAsset.value),
        ownerGroups: ownerGroups(selectedAsset.value),
    })

    const localAdmins = ref({
        adminUsers: adminUsers(selectedAsset.value),
        adminGroups: adminGroups(selectedAsset.value),
    })

    const localAnnouncement = ref({
        announcementMessage: announcementMessage(selectedAsset.value) || '',
        announcementType:
            announcementType(selectedAsset.value) || 'information',
        announcementTitle: announcementTitle(selectedAsset.value) || '',
    })

    const localMeanings = ref(meanings(selectedAsset.value))
    const localAssignedEntities = ref(assignedEntities(selectedAsset.value))
    const localCategories = ref(categories(selectedAsset.value))
    const localParentCategory = ref(
        selectedAsset.value?.attributes?.parentCategory
    )

    const localResource = ref({
        link: 'https://',
        title: '',
    })
    const localReadmeContent = ref(readmeContent(selectedAsset.value))

    const localClassifications = ref(classifications(selectedAsset.value))

    const localSQLQuery = ref({
        allowQuery: allowQuery(selectedAsset.value),
        allowQueryPreview: allowQueryPreview(selectedAsset.value),
        connectionRowLimit: connectionRowLimit(selectedAsset.value),
    })

    const currentMessage = ref('')

    const nameRef = ref(null)
    const descriptionRef = ref(null)
    const animationPoint = ref(null)
    const isConfetti = ref(false)
    const shouldDrawerUpdate = ref(false)

    // metadata analytics event
    const sendMetadataTrackEvent = (action: string, props = {}) => {
        const baseProps = {
            asset_type: selectedAsset.value?.typeName,
        }
        const finalProps = {
            ...baseProps,
            ...props,
        }
        useAddEvent('discovery', 'metadata', action, finalProps)
    }

    // general analytics event
    const sendTrackEvent = (objectName: string, action: string, props = {}) => {
        const baseProps = {
            asset_type: selectedAsset.value?.typeName,
        }
        const finalProps = {
            ...baseProps,
            ...props,
        }
        useAddEvent('discovery', objectName, action, finalProps)
    }

    // Name Change
    const handleChangeName = () => {
        if (title(selectedAsset?.value) !== localName.value) {
            entity.value.attributes.name = localName.value
            body.value.entities = [entity.value]
            currentMessage.value = 'Name has been updated'
            mutate()
            sendMetadataTrackEvent('name_updated')
        }
    }

    // Description Change
    const handleChangeDescription = () => {
        if (description(selectedAsset?.value) !== localDescription.value) {
            entity.value.attributes.userDescription = localDescription.value
            body.value.entities = [entity.value]

            currentMessage.value = 'Description has been updated'
            mutate()
            sendMetadataTrackEvent('description_updated')
        }
    }

    // Owners Change
    const handleOwnersChange = () => {
        let isChanged = false

        if (
            ownerUsers(selectedAsset.value).length === 0 &&
            (!localOwners.value?.ownerUsers ||
                localOwners.value?.ownerUsers.length === 0) &&
            ownerGroups(selectedAsset.value).length === 0 &&
            (!localOwners.value?.ownerGroups ||
                localOwners.value?.ownerGroups.length === 0)
        ) {
            isChanged = false
        } else {
            // Users
            if (
                entity.value.attributes.ownerUsers?.sort().toString() !==
                localOwners.value?.ownerUsers?.sort().toString()
            ) {
                entity.value.attributes.ownerUsers =
                    localOwners.value?.ownerUsers
                isChanged = true
            }

            // Groups
            if (
                entity.value.attributes.ownerGroups?.sort().toString() !==
                localOwners.value?.ownerGroups?.sort().toString()
            ) {
                entity.value.attributes.ownerGroups =
                    localOwners.value?.ownerGroups
                isChanged = true
            }
        }

        if (isChanged) {
            body.value.entities = [entity.value]

            currentMessage.value = 'Owners have been updated'
            mutate()
            sendMetadataTrackEvent('owners_updated')
        }
    }

    // Admins Change
    const handleChangeAdmins = () => {
        let isChanged = false

        if (
            adminUsers(selectedAsset.value).length === 0 &&
            (!localAdmins.value?.adminUsers ||
                localAdmins.value?.adminUsers.length === 0) &&
            adminGroups(selectedAsset.value).length === 0 &&
            (!localAdmins.value?.adminGroups ||
                localAdmins.value?.adminGroups.length === 0)
        ) {
            isChanged = false
        } else {
            // Users
            if (
                entity.value.attributes.adminUsers?.sort().toString() !==
                localAdmins.value?.adminUsers?.sort().toString()
            ) {
                entity.value.attributes.adminUsers =
                    localAdmins.value?.adminUsers
                isChanged = true
            }

            // Groups
            if (
                entity.value.attributes.adminGroups?.sort().toString() !==
                localAdmins.value?.adminGroups?.sort().toString()
            ) {
                entity.value.attributes.adminGroups =
                    localAdmins.value?.adminGroups
                isChanged = true
            }
        }

        if (isChanged) {
            body.value.entities = [entity.value]

            currentMessage.value = 'Admins have been updated'
            mutate()
            sendMetadataTrackEvent('admins_updated')
        }
    }

    // Certificate Change
    const handleChangeCertificate = () => {
        if (
            localCertificate.value.certificateStatus !==
                certificateStatus(selectedAsset.value) ||
            localCertificate.value.certificateStatusMessage !==
                certificateStatusMessage(selectedAsset.value)
        ) {
            if (localCertificate.value.certificateStatus === 'VERIFIED') {
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
            sendMetadataTrackEvent('certification_updated', {
                certificate: localCertificate.value.certificateStatus,
                has_message: !!localCertificate.value.certificateStatusMessage,
            })
        }
    }

    // Announcement Update
    const handleAnnouncementUpdate = (isUpdating) => {
        entity.value.attributes.announcementTitle =
            localAnnouncement.value.announcementTitle
        entity.value.attributes.announcementMessage =
            localAnnouncement.value.announcementMessage
        entity.value.attributes.announcementType =
            localAnnouncement.value.announcementType
        body.value.entities = [entity.value]

        currentMessage.value = 'Announcement has been updated'
        mutate()
        const action = isUpdating ? 'updated' : 'created'
        sendTrackEvent('announcement', action, {
            announcement_type: localAnnouncement.value.announcementType,
        })
    }

    // SQL Query Config Update
    const handleSQLQueryUpdate = () => {
        entity.value.attributes.allowQuery = localSQLQuery.value.allowQuery
        entity.value.attributes.allowQueryPreview =
            localSQLQuery.value.allowQueryPreview
        entity.value.attributes.rowLimit =
            localSQLQuery.value.connectionRowLimit
        body.value.entities = [entity.value]

        currentMessage.value = 'SQL Query Config has been updated'
        mutate()
        sendMetadataTrackEvent('query_config_updated', {
            allow_query: localSQLQuery.value.allowQuery,
            allow_query_preview: localSQLQuery.value.allowQueryPreview,
            row_limit: localSQLQuery.value.connectionRowLimit,
        })
    }

    const handleAnnouncementDelete = () => {
        entity.value.attributes.announcementTitle = null
        entity.value.attributes.announcementMessage = null
        entity.value.attributes.announcementType = null
        body.value.entities = [entity.value]

        currentMessage.value = 'Announcement has been deleted'
        mutate()
        sendTrackEvent('announcement', 'deleted')
    }

    const handleMeaningsUpdate = () => {
        entity.value = {
            ...entity.value,
            relationshipAttributes: {
                meanings: localMeanings.value.map((term) => ({
                    typeName: 'AtlasGlossaryTerm',
                    guid: term.guid ?? term.termGuid,
                })),
            },
        }
        body.value.entities = [entity.value]

        currentMessage.value = 'Terms have been updated'
        mutate()
        sendMetadataTrackEvent('terms_updated')
    }

    const handleAssignedEntitiesUpdate = ({
        linkedAssets,
        unlinkedAssets,
        term,
    }: {
        linkedAssets: assetInterface[]
        unlinkedAssets: assetInterface[]
        term: assetInterface
    }) => {
        const linked = linkedAssets.map((assignedEntitiy) => {
            const meanings = assignedEntitiy.attributes.meanings ?? []
            if (!meanings.find((meaning) => meaning.guid === term.guid)) {
                meanings.push({
                    typeName: 'AtlasGlossaryTerm',
                    guid: term.guid,
                })
            }
            return {
                guid: assignedEntitiy.guid,
                typeName: assignedEntitiy.typeName,
                attributes: {
                    ...assignedEntitiy.attributes,
                    ...assignedEntitiy.uniqueAttributes,
                },
                relationshipAttributes: {
                    meanings,
                },
            }
        })

        const unlinked = unlinkedAssets.map((unassignedEntity) => {
            return {
                guid: unassignedEntity.guid,
                typeName: unassignedEntity.typeName,
                attributes: {
                    ...unassignedEntity.attributes,
                    ...unassignedEntity.uniqueAttributes,
                },
                relationshipAttributes: {
                    meanings:
                        unassignedEntity.attributes.meanings?.filter(
                            (meaning) => meaning.guid !== term.guid
                        ) ?? [],
                },
            }
        })

        body.value.entities = [...linked, ...unlinked]
        currentMessage.value = 'Linked assets updated'
        mutate()

        whenever(isUpdateReady, () => {
            localAssignedEntities.value = assignedEntities(asset.value)
        })
    }

    const handleCategoriesUpdate = () => {
        entity.value = {
            ...entity.value,
            relationshipAttributes: {
                categories: localCategories.value.map((category) => ({
                    typeName: 'AtlasGlossaryCategory',
                    guid: category.guid,
                })),
                anchor: selectedAsset?.value?.attributes?.anchor,
            },
        }
        body.value.entities = [entity.value]
        currentMessage.value = 'Categories have been updated'
        mutate()
    }
    const handleParentCategoryUpdate = () => {
        entity.value = {
            ...entity.value,
            relationshipAttributes: {
                parentCategory: localParentCategory.value,
                anchor: selectedAsset?.value?.attributes?.anchor,
            },
        }
        body.value.entities = [entity.value]
        currentMessage.value = 'Categories have been updated'
        mutate()
    }

    // Resource Addition
    const handleAddResource = () => {
        const resourceEntity = ref<any>({
            typeName: 'Link',
            attributes: {
                qualifiedName: generateUUID(),
                name: localResource.value.title,
                link: localResource.value.link,
                tenantId: 'default',
            },
            relationshipAttributes: {
                asset: {
                    guid: selectedAsset.value?.guid,
                    typeName: selectedAsset.value?.typeName,
                },
            },
        })
        body.value.entities = [resourceEntity.value]

        currentMessage.value = 'A new resource has been added'
        mutate()
        sendTrackEvent('resource', 'created', {
            domain: localResource.value.link.split('/')[2],
        })
    }

    // Resource Update
    const handleUpdateResource = (item) => {
        const resourceEntity = ref<any>({
            typeName: 'Link',
            guid: item.value?.guid,
            attributes: {
                qualifiedName: item.value?.uniqueAttributes?.qualifiedName,
                name: localResource.value?.title,
                link: localResource.value?.link,
                tenantId: 'default',
            },
        })

        body.value.entities = [resourceEntity.value]

        currentMessage.value = `Resource ${title(item.value)} of ${title(
            selectedAsset.value
        )} updated`
        mutate()
        sendTrackEvent('resource', 'updated', {
            domain: localLResource.value.link.split('/')[2],
        })
    }

    // Resource Deletion
    const handleResourceDelete = (link) => {
        const { error, isLoading, isReady } = Entity.DeleteEntity(link?.guid)

        whenever(error, () => {
            message.error(
                `${error.value?.response?.data?.errorCode} ${
                    error.value?.response?.data?.errorMessage.split(':')[0]
                }` ?? 'Something went wrong'
            )
        })
        whenever(isReady, () => {
            message.success(`Resource deleted`)
            guid.value = selectedAsset.value.guid

            mutateUpdate()
            sendTrackEvent('resource', 'deleted')
        })
    }

    // Readme Update
    const handleUpdateReadme = () => {
        const readmeEntity = ref<any>({
            typeName: 'Readme',
            attributes: {
                qualifiedName: `${selectedAsset.value?.guid}/readme`,
                name: `${title(selectedAsset?.value)} Readme`,
                description: localReadmeContent.value,
                tenantId: 'default',
            },
            relationshipAttributes: {
                asset: {
                    guid: selectedAsset.value?.guid,
                    typeName: selectedAsset.value?.typeName,
                },
            },
        })
        if (readmeContent(selectedAsset.value) !== localReadmeContent.value) {
            body.value.entities = [readmeEntity.value]

            currentMessage.value = 'Readme has been updated'
            mutate()
            sendTrackEvent('readme', 'updated')
        }
    }

    const rainConfettis = () => {
        const config = {
            angle: 45,
            startVelocity: 10,
            spread: 200,
            elementCount: 100,
            colors: ['#2251cc', '#2251cc', '#82b54b', '#e94a3f', '#faa040'],
            width: '0.3rem',
            height: '0.3rem',
        }
        if (isConfetti.value) {
            if (animationPoint) {
                confetti(animationPoint.value, config)
            }
        }
    }

    // error handling
    whenever(error, () => {
        if (title(selectedAsset?.value) !== localName.value) {
            localName.value = title(selectedAsset?.value)
            if (nameRef.value?.handleReset)
                nameRef.value?.handleReset(localName.value)
        }
        if (description(selectedAsset?.value) !== localDescription.value) {
            localDescription.value = description(selectedAsset?.value)
            if (descriptionRef.value?.handleReset)
                descriptionRef.value?.handleReset(localDescription.value)
        }
        if (ownerUsers(selectedAsset?.value) !== localOwners.value.ownerUsers) {
            localOwners.value.ownerUsers = ownerUsers(selectedAsset?.value)
        }
        if (
            ownerGroups(selectedAsset?.value) !== localOwners.value.ownerGroups
        ) {
            localOwners.value.ownerGroups = ownerGroups(selectedAsset?.value)
        }
        if (meanings(selectedAsset?.value) !== localMeanings.value) {
            localMeanings.value = meanings(selectedAsset.value)
        }

        message.error(
            `${error.value?.response?.data?.errorCode} ${
                error.value?.response?.data?.errorMessage.split(':')[0]
            }` ?? 'Something went wrong'
        )
    })

    whenever(isReady, () => {
        message.success(currentMessage.value)
        guid.value = selectedAsset.value.guid
        rainConfettis()
        mutateUpdate()
    })

    const updateList = inject('updateList')
    const updateDrawerList = inject('updateDrawerList')

    whenever(isUpdateReady, () => {
        if (!isDrawer && updateList) {
            updateList(asset.value)
        } else {
            shouldDrawerUpdate.value = true
            if (typeof updateDrawerList === 'function' && updateDrawerList) {
                updateDrawerList(asset.value)
            }
        }
        isConfetti.value = false
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

    const arrayEquals = (a, b) =>
        Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => b.map((i) => i.typeName).includes(val.typeName))

    const handleClassificationChange = () => {
        if (
            !arrayEquals(
                classifications(selectedAsset.value),
                localClassifications.value
            )
        ) {
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
            sendMetadataTrackEvent('classifications_updated')
        }
    }

    whenever(isReadyClassification, () => {
        message.success(currentMessage.value)
        guid.value = selectedAsset.value.guid
        mutateUpdate()
    })

    whenever(isErrorClassification, () => {
        localClassifications.value = classifications(selectedAsset.value)
        message.error(
            `${error.value?.response?.data?.errorCode} ${
                error.value?.response?.data?.errorMessage.split(':')[0]
            }` ?? 'Something went wrong'
        )
    })

    return {
        entity,
        isLoading,
        localName,
        localDescription,
        localCertificate,
        localOwners,
        localClassifications,
        localAnnouncement,
        localMeanings,
        localCategories,
        handleChangeName,
        handleChangeDescription,
        handleOwnersChange,
        handleChangeAdmins,
        handleChangeCertificate,
        handleClassificationChange,
        handleAnnouncementUpdate,
        isLoadingClassification,
        localSQLQuery,
        handleSQLQueryUpdate,
        nameRef,
        descriptionRef,
        animationPoint,
        handleAddResource,
        localResource,
        handleResourceDelete,
        handleUpdateReadme,
        handleAnnouncementDelete,
        localReadmeContent,
        handleUpdateResource,
        handleMeaningsUpdate,
        handleCategoriesUpdate,
        shouldDrawerUpdate,
        asset,
        localAssignedEntities,
        handleAssignedEntitiesUpdate,
        localAdmins,
        error,
        handleParentCategoryUpdate,
        localParentCategory,
    }
}
