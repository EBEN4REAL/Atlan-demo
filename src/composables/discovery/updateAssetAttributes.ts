import { computed, ref, Ref } from 'vue'
import updateAsset from '~/composables/discovery/updateAsset'
import useAssetInfo from '~/composables/discovery/useAssetInfo'

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

    const localClassifications = ref(classifications(selectedAsset.value))

    const currentMessage = ref('')

    return { entity }
}
