
import { defineComponent, PropType, ref, toRefs, h, watch } from 'vue'
import { getDomain } from '~/utils/url';
import { handleUpdateList } from '@/governance/personas/composables/usePersonaList'
import { savePersona } from '@/governance/personas/composables/useEditPersona'
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
            const personaRaw = JSON.parse(JSON.stringify(body))
            delete body.metadataPolicies
            delete body.dataPolicies
            await savePersona(body)
            handleUpdateList(personaRaw) // updating list locally on sucess
            useAddEvent(
                'governance',
                'persona',
                'resource_created',
                {
                    domain: getDomain(r.attributes.link),
                }
            )
            addStatus.value = 'success'
        } catch (e) {
            console.log({ e })
            addStatus.value = 'error'
        }
    }

    const updateStatus = ref('')
    const handleUpdateResource = async (r) => {
        updateStatus.value = 'loading'
        try {
            const body = JSON.parse(JSON.stringify(persona.value))
            const index = body.resources.links.findIndex(
                (l) => l.qualifiedName === r.qualifiedName
            )
            if (index > -1) body.resources.links[index] = r
            const personaRaw = JSON.parse(JSON.stringify(body))

            delete body.metadataPolicies
            delete body.dataPolicies

            await savePersona(body)
            handleUpdateList(personaRaw)  // updating list locally on sucess
            useAddEvent(
                'governance',
                'persona',
                'resource_updated',
                {
                    domain: getDomain(r.attributes.link),
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
            const personaRaw = JSON.parse(JSON.stringify(body))
            delete body.metadataPolicies
            delete body.dataPolicies
            await savePersona(body)
            handleUpdateList(personaRaw)  // updating list locally on sucess

            removeStatus.value = 'success'
            useAddEvent(
                'governance',
                'persona',
                'resource_deleted',
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