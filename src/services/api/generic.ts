import { useAPI } from "./useAPI";
import { getAPIPath } from './common'

const genericAPI = async (path, method, reqOptions) => {
    const { data: response, mutate } = useAPI(
        () => getAPIPath('', path),
        method,
        reqOptions,
        { asyncOptions: { immediate: false, onError: e => { throw e } } })
    await mutate()
    return response.value
}

export default genericAPI