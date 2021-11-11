import { useAPI } from "./useAPI";
import { getAPIPath } from './common'

const genericAPI = async (path, method, reqOptions, ApiOptions) =>
    useAPI(() => getAPIPath('', path), method, reqOptions, ApiOptions)

export default genericAPI