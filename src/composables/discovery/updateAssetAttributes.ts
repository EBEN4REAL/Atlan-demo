import { ref, inject, watch } from 'vue'
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
        viewerUsers,
        viewerGroups,
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
        seeAlso,
        assignedEntities,
        allowQuery,
        allowQueryPreview,
        connectionRowLimit,
    } = useAssetInfo()

    const entity = ref({
        guid: selectedAsset.value?.guid,
        typeName: selectedAsset.value?.typeName,
        attributes: {
            name: selectedAsset.value?.attributes?.name,
            qualifiedName: selectedAsset.value?.attributes?.qualifiedName,
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

    watch(
        selectedAsset,
        () => {
            if (['Query'].includes(entity.value.typeName)) {
                entity.value.attributes = {
                    ...entity.value.attributes,
                    name: selectedAsset.value.attributes.name,
                    parentQualifiedName: attributes(selectedAsset?.value)
                        ?.parentQualifiedName,
                    parent: attributes(selectedAsset?.value)?.parent,
                    collectionQualifiedName: attributes(selectedAsset?.value)
                        ?.collectionQualifiedName,
                }
            }
        },
        { immediate: true }
    )

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

    const localViewers = ref({
        viewerUsers: viewerUsers(selectedAsset.value),
        viewerGroups: viewerGroups(selectedAsset.value),
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
    const localSeeAlso = ref(seeAlso(selectedAsset.value))
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
            /* ownerUsers(selectedAsset.value).length === 0 &&
            (!localOwners.value?.ownerUsers ||
                localOwners.value?.ownerUsers.length === 0) &&
            ownerGroups(selectedAsset.value).length === 0 &&
            (!localOwners.value?.ownerGroups ||
                localOwners.value?.ownerGroups.length === 0) */
            ownerUsers(selectedAsset.value)?.sort().toString() ===
                localOwners.value?.ownerUsers?.sort().toString() &&
            ownerGroups(selectedAsset.value)?.sort().toString() ===
                localOwners.value?.ownerGroups?.sort().toString()
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
            adminUsers(selectedAsset.value)?.sort().toString() ===
                localAdmins.value?.adminUsers?.sort().toString() &&
            adminGroups(selectedAsset.value)?.sort().toString() ===
                localAdmins.value?.adminGroups?.sort().toString()
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

    // Viewers Change
    const handleChangeViewers = () => {
        let isChanged = false

        if (
            viewerUsers(selectedAsset.value)?.sort().toString() ===
                localViewers.value?.viewerUsers?.sort().toString() &&
            viewerGroups(selectedAsset.value)?.sort().toString() ===
                localViewers.value?.viewerGroups?.sort().toString()
        ) {
            isChanged = false
        } else {
            // Users
            if (
                entity.value.attributes.viewerUsers?.sort().toString() !==
                localViewers.value?.viewerUsers?.sort().toString()
            ) {
                entity.value.attributes.viewerUsers =
                    localViewers.value?.viewerUsers
                isChanged = true
            }

            // Groups
            if (
                entity.value.attributes.viewerGroups?.sort().toString() !==
                localViewers.value?.viewerGroups?.sort().toString()
            ) {
                entity.value.attributes.viewerGroups =
                    localViewers.value?.viewerGroups
                isChanged = true
            }
        }

        if (isChanged) {
            body.value.entities = [entity.value]

            currentMessage.value = 'Viewers have been updated'
            mutate()
            sendMetadataTrackEvent('viewers_updated')
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
        linkedAssets = [],
        unlinkedAssets = [],
        term,
    }: {
        linkedAssets?: assetInterface[]
        unlinkedAssets?: assetInterface[]
        term: assetInterface
    }) => {
        console.log(linkedAssets)
        console.log(unlinkedAssets)
        const linked = linkedAssets.map((assignedEntitiy) => {
            const meanings = assignedEntitiy.attributes.meanings ?? []
            if (!meanings.find((meaning) => meaning.guid === term.guid)) {
                meanings.push({
                    typeName: 'AtlasGlossaryTerm',
                    guid: term.guid,
                })
            }
            const payload = {
                guid: assignedEntitiy.guid,
                typeName: assignedEntitiy.typeName,
                attributes: {
                    qualifiedName:
                        assignedEntitiy.uniqueAttributes?.qualifiedName ??
                        assignedEntitiy.attributes?.qualifiedName ??
                        '',
                    name: assignedEntitiy.attributes.name,
                },
                relationshipAttributes: {
                    meanings,
                },
            }
            if (assignedEntitiy?.typeName === 'Query') {
                payload.attributes = {
                    ...payload.attributes,
                    parentQualifiedName:
                        assignedEntitiy?.attributes?.parentQualifiedName,
                    collectionQualifiedName:
                        assignedEntitiy?.attributes?.collectionQualifiedName,
                    parent: assignedEntitiy?.attributes?.parent,
                }
            }

            return payload
        })

        const unlinked = unlinkedAssets.map((unassignedEntity) => {
            const payload = {
                guid: unassignedEntity.guid,
                typeName: unassignedEntity.typeName,
                attributes: {
                    qualifiedName:
                        unassignedEntity.uniqueAttributes?.qualifiedName ??
                        unassignedEntity.attributes?.qualifiedName ??
                        '',
                    name: unassignedEntity.attributes.name,
                },
                relationshipAttributes: {
                    meanings:
                        unassignedEntity.attributes.meanings?.filter(
                            (meaning) => meaning.guid !== term.guid
                        ) ?? [],
                },
            }
            if (unassignedEntity?.typeName === 'Query') {
                payload.attributes = {
                    ...payload.attributes,
                    parentQualifiedName:
                        unassignedEntity?.attributes?.parentQualifiedName,
                    collectionQualifiedName:
                        unassignedEntity?.attributes?.collectionQualifiedName,
                    parent: unassignedEntity?.attributes?.parent,
                }
                console.log(payload)
            }
            return payload
        })

        body.value.entities = [...linked, ...unlinked]
        if (!unlinkedAssets.length) currentMessage.value = 'Assets linked'
        else if (!linkedAssets.length) currentMessage.value = 'Assets unlinked'
        else currentMessage.value = 'Linked assets updated'
        if (body.value.entities?.length) mutate()

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
        sendMetadataTrackEvent('categories_updated', {
            count: localCategories.value?.length,
        })
        mutate()
    }
    const handleSeeAlsoUpdate = () => {
        entity.value = {
            ...entity.value,
            relationshipAttributes: {
                seeAlso: localSeeAlso.value.map((term) => ({
                    typeName: 'AtlasGlossaryTerm',
                    guid: term.guid,
                })),
                anchor: selectedAsset?.value?.attributes?.anchor,
            },
        }
        body.value.entities = [entity.value]
        currentMessage.value = 'Related terms have been updated'
        sendMetadataTrackEvent('related_terms_updated', {
            count: localSeeAlso.value?.length,
        })
        mutate()
    }
    const handleParentCategoryUpdate = () => {
        entity.value = {
            ...entity.value,
            relationshipAttributes: {
                anchor: selectedAsset?.value?.attributes?.anchor,
            },
        }
        console.log(localParentCategory.value)
        if (localParentCategory.value?.guid) {
            entity.value.relationshipAttributes.parentCategory =
                localParentCategory.value
        } else {
            entity.value.relationshipAttributes.parentCategory = null
        }
        body.value.entities = [entity.value]
        currentMessage.value = 'Categories have been updated'
        mutate()
    }

    // Resource Addition
    const handleAddResource = async () => {
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

        const response = await mutate()
        sendTrackEvent('resource', 'created', {
            domain: localResource.value.link.split('/')[2],
        })
        return response
    }

    // Resource Update
    const handleUpdateResource = async (item) => {
        const resourceEntity = ref<any>({
            typeName: 'Link',
            guid: item.guid,
            attributes: {
                qualifiedName: item.uniqueAttributes?.qualifiedName,
                name: localResource.value?.title,
                link: localResource.value?.link,
                tenantId: 'default',
            },
        })

        body.value.entities = [resourceEntity.value]

        await mutate()
        sendTrackEvent('resource', 'updated', {
            domain: localResource.value.link.split('/')[2],
        })
    }

    // Resource Deletion
    const handleResourceDelete = (_id) => {
        const { error, isLoading, isReady } = Entity.DeleteEntity(_id)

        whenever(isReady, () => {
            guid.value = selectedAsset.value.guid
            mutateUpdate()
            sendTrackEvent('resource', 'deleted')
        })
        return {
            error,
            isLoading,
            isReady,
        }
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
            const readmeBody = ref({
                entities: [readmeEntity.value],
            })
            const { mutate, isLoading, isReady, error } =
                updateAsset(readmeBody)

            mutate()

            whenever(isReady, () => {
                message.success('Readme has been updated')
                sendTrackEvent('readme', 'updated')
            })

            whenever(error, () => {
                localReadmeContent.value = readmeContent(selectedAsset.value)

                message.error(
                    `${error.value?.response?.data?.errorCode} ${
                        error.value?.response?.data?.errorMessage.split(':')[0]
                    }` ?? 'Something went wrong'
                )
            })
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
        if (adminUsers(selectedAsset?.value) !== localAdmins.value.adminUsers) {
            localAdmins.value.adminUsers = adminUsers(selectedAsset?.value)
        }
        if (
            adminGroups(selectedAsset?.value) !== localAdmins.value.adminGroups
        ) {
            localAdmins.value.adminGroups = adminGroups(selectedAsset?.value)
        }
        if (
            viewerUsers(selectedAsset?.value) !== localViewers.value.viewerUsers
        ) {
            localViewers.value.viewerUsers = viewerUsers(selectedAsset?.value)
        }
        if (
            viewerGroups(selectedAsset?.value) !==
            localViewers.value.viewerGroups
        ) {
            localViewers.value.viewerGroups = viewerGroups(selectedAsset?.value)
        }
        if (meanings(selectedAsset?.value) !== localMeanings.value) {
            localMeanings.value = meanings(selectedAsset.value)
        }
        if (seeAlso(selectedAsset?.value) !== localSeeAlso.value) {
            localSeeAlso.value = seeAlso(selectedAsset.value)
        }

        message.error(
            `${error.value?.response?.data?.errorCode} ${
                error.value?.response?.data?.errorMessage.split(':')[0]
            }` ?? 'Something went wrong'
        )
    })

    whenever(isReady, () => {
        if (currentMessage.value) message.success(currentMessage.value)
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
            [selectedAsset.value?.guid]: {
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
        mutateUpdate,
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
        localSeeAlso,
        localViewers,
        handleChangeName,
        handleChangeDescription,
        handleOwnersChange,
        handleChangeAdmins,
        handleChangeViewers,
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
        handleSeeAlsoUpdate,
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
