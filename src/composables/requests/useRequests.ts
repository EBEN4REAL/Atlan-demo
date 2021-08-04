import { getRequests, actOnRequest } from '~/api/atlas/requests'
import { IRequestActionBody } from '~/types/atlas/requests'

export default function useRequests() {
    const { response, error } = getRequests()

    // Change it to use some inbuilt request object
    function takeAction(requestId: string, body: IRequestActionBody) {
        return actOnRequest(requestId, body)
    }

    return { response, error, takeAction }
}
