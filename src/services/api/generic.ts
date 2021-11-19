import { useAPI } from './useAPI'
import { getAPIPath } from './common'

const genericAPI = async (path, method, reqOptions, reqConfig = {}) => {
    const { data: response, mutate } = useAPI(
        () => getAPIPath('', path),
        method,
        reqOptions,
        {
            options: reqConfig,
            asyncOptions: {
                immediate: false,
                onError: (e) => {
                    throw e
                },
            },
        }
    )
    await mutate()
    return response.value
}

export default genericAPI
