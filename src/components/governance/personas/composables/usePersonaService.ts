import { IPersona } from '~/types/accessPolicies/personas'
import { Persona } from '../../../../services/service/persona'

export default function usePersonaService() {
    function listPersonas() {
        return Persona.listPersonas()
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
        listPersonas,
        createPersona,
        updatePersona,
        deletePersona,
        updateUsers,
    }
}
