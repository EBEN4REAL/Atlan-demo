import { personaServiceAPI } from '../apis/personas'

export default function usePersonaService() {
    function listPersonas() {
        return personaServiceAPI.listPersonas()
    }

    return { listPersonas }
}
