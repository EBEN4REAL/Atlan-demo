import { getAPIPath } from '~/api'

export const CREDENTIAL_TEST = 'CREDENTIAL_TEST'
export const CREDENTIAL_TEST_BY_ID = 'CREDENTIAL_TEST_BY_ID'

const credentialmap: Record<string, (...params: any) => string> = {
    [CREDENTIAL_TEST]: () => getAPIPath('service', `/credentials/test`),
    [CREDENTIAL_TEST_BY_ID]: ({ id }) =>
        getAPIPath('service', `/credentials/${id}/test`),
}

export default credentialmap
