
import { defineComponent, PropType, ref, toRefs, h, watch } from 'vue'
import { handleUpdateList } from '@/governance/purposes/composables/usePurposeList'
import { savePersona } from '@/governance/purposes/composables/useEditPurpose'
import { getDomain } from '~/utils/url';
import useAddEvent from '~/composables/eventTracking/useAddEvent'

const usePersonaResources = (purpose) => {

    // The `handleAddResource` function is a helper function that makes network request to store a resource link to the
    // purpose.
    const addStatus = ref('')
    const handleAddResource = async (r) => {
        addStatus.value = 'loading'
        try {
            const body = JSON.parse(JSON.stringify(purpose.value))
            const { resources } = body
            body.resources = {
                ...resources,
                links: [...(resources?.links ?? []), r],
            }
            body.readme = body.readme ?? '' // TODO
            await savePersona(body)
            handleUpdateList(body)
            useAddEvent(
                'governance',
                'purpose',
                'resource_created',
                {
                    domain: getDomain(r.attributes.link),
                }
            )
            addStatus.value = 'success'
        } catch (e) {
            addStatus.value = 'error'
        }
    }

    const updateStatus = ref('')
    const handleUpdateResource = async (r) => {
        updateStatus.value = 'loading'
        try {
            const body = JSON.parse(JSON.stringify(purpose.value))

            const index = body.resources.links.findIndex(
                (l) => l.qualifiedName === r.qualifiedName
            )
            if (index > -1) body.resources.links[index] = r
            body.readme = body.readme ?? '' // TODO
            await savePersona(body)
            handleUpdateList(body)
            useAddEvent(
                'governance',
                'purpose',
                'resource_updated',
                {
                    domain: getDomain(r.attributes.link),
                }
            )
            updateStatus.value = 'success'
        } catch (error) {
            updateStatus.value = 'error'
        }
    }

    const removeStatus = ref('')
    const handleRemoveResource = async (id) => {
        removeStatus.value = 'loading'
        try {
            const body = JSON.parse(JSON.stringify(purpose.value))
            body.resources.links = body.resources.links.filter(
                (l) => l.qualifiedName !== id
            )
            body.readme = body.readme ?? '' // TODO
            await savePersona(body)
            removeStatus.value = 'success'
            handleUpdateList(body)
            useAddEvent(
                'governance',
                'purpose',
                'resource_deleted',
                {}
            )
        } catch (e) {
            removeStatus.value = 'error'
        }
    }

    return {
        addStatus,
        updateStatus,
        removeStatus,
        handleAddResource,
        handleUpdateResource,
        handleRemoveResource
    }
}

export default usePersonaResources