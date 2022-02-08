
import { defineComponent, PropType, ref, toRefs, h, watch } from 'vue'
import { getDomain } from '~/utils/url';
import { reFetchList } from '@/governance/personas/composables/usePersonaList'
import { savePersona } from '@/governance/personas/composables/useEditPersona'
import usePersona from '~/composables/persona/usePersona'
import useAddEvent from '~/composables/eventTracking/useAddEvent'

const usePersonaResources = (persona) => {

    // The `handleAddResource` function is a helper function that makes network request to store a resource link to the
    // persona.
    const addStatus = ref('')
    const handleAddResource = async (r) => {
        addStatus.value = 'loading'
        try {
            const body = JSON.parse(JSON.stringify(persona.value))
            const { resources } = body
            body.resources = {
                ...resources,
                links: [...(resources?.links ?? []), r],
            }
            delete body.metadataPolicies
            delete body.dataPolicies
            await savePersona(body)
            usePersona() // update store
            reFetchList() // TODO refetch only required persona
            useAddEvent(
                'governance',
                'resource',
                'created',
                {
                    domain: getDomain(r.url),
                    asset_type: 'persona'
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
            const body = JSON.parse(JSON.stringify(persona.value))
            delete body.metadataPolicies
            delete body.dataPolicies
            const index = body.resources.links.findIndex(
                (l) => l.qualifiedName === r.qualifiedName
            )
            if (index > -1) body.resources.links[index] = r
            await savePersona(body)
            usePersona() // update store
            reFetchList()  // TODO refetch only required persona
            useAddEvent(
                'governance',
                'resource',
                'updated',
                {
                    domain: getDomain(r.url),
                    asset_type: 'persona'
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
            const body = JSON.parse(JSON.stringify(persona.value))
            body.resources.links = body.resources.links.filter(
                (l) => l.qualifiedName !== id
            )
            delete body.metadataPolicies
            delete body.dataPolicies
            await savePersona(body)
            removeStatus.value = 'success'
            usePersona() // update store
            reFetchList() // TODO refetch only required persona
            useAddEvent(
                'governance',
                'resource',
                'deleted',
                {
                    asset_type: 'persona'
                }
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