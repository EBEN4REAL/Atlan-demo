import { IPurpose } from '~/types/accessPolicies/purposes'
import { IEnableDisablePayload } from '~/types/accessPolicies/personas'
import { Purpose } from '../../../../services/service/purpose'

export default function usePurposeService() {
    function list(params, options) {
        return Purpose.List(params, options)
    }
    // Refactor
    function listPurposes() {
        return Purpose.listPurposes()
    }

    function createPersona(newPersona: IPurpose) {
        return Purpose.createPersona(newPersona)
    }

    function updatePersona(newPersona: IPurpose) {
        return Purpose.updatePersona(newPersona)
    }

    function deletePersona(id: string) {
        return Purpose.deletePersona(id)
    }
    function updateUsers({ id, users, groups }) {
        return Purpose.updatePersonaUsers({
            personaId: id,
            users,
            groups,
        })
    }
    function enableDisablePurpose(id: string, payload: IEnableDisablePayload) {
        return Purpose.enableDisablePurpose(id, payload)
    }

    return {
        list,
        listPurposes,
        createPersona,
        updatePersona,
        deletePersona,
        updateUsers,
        enableDisablePurpose,
    }
}
