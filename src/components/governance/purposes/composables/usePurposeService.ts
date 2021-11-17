import { IPersona } from '~/types/accessPolicies/purposes'
import { Persona } from '../../../../services/service/purpose'

export default function usePurposeService() {
    function listPurposes() {
        return Persona.listPurposes()
    }

    function createPersona(newPersona: IPersona) {
        return Persona.createPersona(newPersona)
    }

    function updatePersona(newPersona: IPersona) {
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

    return {
        listPurposes,
        createPersona,
        updatePersona,
        deletePersona,
        updateUsers,
    }
}
