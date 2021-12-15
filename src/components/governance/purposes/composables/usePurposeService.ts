import { IPurpose } from '~/types/accessPolicies/purposes'
import { IEnableDisablePayload } from '~/types/accessPolicies/personas'
import { Persona } from '../../../../services/service/purpose'

export default function usePurposeService() {
    function listPurposes() {
        return Persona.listPurposes()
    }

    function createPersona(newPersona: IPurpose) {
        return Persona.createPersona(newPersona)
    }

    function updatePersona(newPersona: IPurpose) {
        return Persona.updatePersona(newPersona)
    }

    function deletePersona(id: string) {
        return Persona.deletePersona(id)
    }
    function updateUsers({ id, users, groups }) {
        return Persona.updatePersonaUsers({
            personaId: id,
            users,
            groups,
        })
    }
    function enableDisablePurpose(id: string, payload: IEnableDisablePayload) {
        return Persona.enableDisablePurpose(id, payload)
    }

    return {
        listPurposes,
        createPersona,
        updatePersona,
        deletePersona,
        updateUsers,
        enableDisablePurpose,
    }
}
