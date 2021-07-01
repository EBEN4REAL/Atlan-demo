import { getAPIPath } from "~/api";

export const CREDENTIAL_TEST = 'CREDENTIAL_TEST';
export const CREDENTIAL_TEST_BY_ID = 'CREDENTIAL_TEST_BY_ID';

const credentialmap: Record<string, (...params: any) => string> = {
    [CREDENTIAL_TEST]: () => getAPIPath('auth', `/credentials/test`),
    [CREDENTIAL_TEST_BY_ID]: ({ id }) => getAPIPath('auth', `/credentials/${id}/test`),
}

export default credentialmap;