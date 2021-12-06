import { ref, inject } from 'vue'
import { message } from 'ant-design-vue'
import { whenever } from '@vueuse/core'
import updateAsset from '~/composables/discovery/updateAsset'
import useAssetInfo from '~/composables/discovery/useAssetInfo'
import { useCurrentUpdate } from '~/composables/discovery/useCurrentUpdate'
import useSetClassifications from '~/composables/discovery/useSetClassifications'
import confetti from '~/utils/confetti'
import { generateUUID } from '~/utils/helper/generator'

export default function updateAssetAttributes(selectedAsset) {
    const {
        title,
        description,
        ownerGroups,
        ownerUsers,
        classifications,
        certificateStatus,
        certificateUpdatedAt,
        certificateStatusMessage,
        certificateUpdatedBy,
        getAnchorGuid,
        announcementMessage,
        announcementType,
        announcementTitle,
        readmeContent,
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

    const localAnnouncement = ref({
        announcementMessage: announcementMessage(selectedAsset.value) || '',
        announcementType:
            announcementType(selectedAsset.value) || 'information',
        announcementTitle: announcementTitle(selectedAsset.value) || '',
    })

    const localResource = ref({
        link: '',
        title: '',
    })
    const localReadmeContent = ref(readmeContent(selectedAsset.value))

    const localClassifications = ref(classifications(selectedAsset.value))

    const currentMessage = ref('')

    const nameRef = ref(null)
    const descriptionRef = ref(null)
    const animationPoint = ref(null)
    const isConfetti = ref(false)

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
        if (description(selectedAsset?.value) !== localDescription.value) {
            entity.value.attributes.userDescription = localDescription.value
            body.value.entities = [entity.value]
            currentMessage.value = 'Description has been updated'
            mutate()
        }
    }

    // Owners Change
    const handleOwnersChange = () => {
        let isChanged = false

        if (
            !entity.value.attributes.ownerUsers &&
            Object.keys(localOwners.value?.ownerUsers).length === 0
        ) {
            isChanged = false
        } else if (
            entity.value.attributes.ownerUsers?.sort().toString() !==
            localOwners.value?.ownerUsers?.sort().toString()
        ) {
            entity.value.attributes.ownerUsers = localOwners.value?.ownerUsers
            isChanged = true
        } else if (
            entity.value.attributes.ownerGroups?.sort().toString() !==
            localOwners.value?.ownerGroups?.sort().toString()
        ) {
            entity.value.attributes.ownerGroups = localOwners.value?.ownerGroups
            isChanged = true
        }

        if (isChanged) {
            body.value.entities = [entity.value]
            currentMessage.value = 'Owners has been updated'
            mutate()
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
        }
    }

    // Announcement Update
    const handleAnnouncementUpdate = () => {
        entity.value.attributes.announcementTitle =
            localAnnouncement.value.announcementTitle
        entity.value.attributes.announcementMessage =
            localAnnouncement.value.announcementMessage
        entity.value.attributes.announcementType =
            localAnnouncement.value.announcementType
        body.value.entities = [entity.value]
        currentMessage.value = 'Announcement has been updated'
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
    }

    // Readme Update
    const handleUpdateReadme = () => {
        const readmeEntity = ref<any>({
            typeName: 'Readme',
            attributes: {
                qualifiedName: `${selectedAsset.value?.guid}/readme`,
                name: `${title(selectedAsset?.value)} Readme`,
                description: localReadmeContent.value,
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
            nameRef.value?.handleReset(localName.value)
        }
        if (description(selectedAsset?.value) !== localDescription.value) {
            localDescription.value = description(selectedAsset?.value)
            descriptionRef.value?.handleReset(localDescription.value)
        }
        message.error(
            error.value?.response?.data?.errorCode +
                ' ' +
                error.value?.response?.data?.errorMessage.split(':')[0] ??
                'Something went wrong'
        )
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

    const arrayEquals = (a, b) =>
        Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => b.map((i) => i.typeName).includes(val.typeName))

    const handleClassificationChange = () => {
        console.log(classifications(selectedAsset.value))
        console.log(localClassifications.value)
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
        }
    }

    whenever(isReadyClassification, () => {
        message.success(currentMessage.value)
        guid.value = selectedAsset.value.guid
        mutateUpdate()
    })

    whenever(isErrorClassification, () => {
        message.error('Something went wrong. Please try again')
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
        handleChangeName,
        handleChangeDescription,
        handleOwnersChange,
        handleChangeCertificate,
        handleClassificationChange,
        handleAnnouncementUpdate,
        isLoadingClassification,
        nameRef,
        descriptionRef,
        animationPoint,
        handleAddResource,
        localResource,
        handleUpdateReadme,
        localReadmeContent,
    }
}
