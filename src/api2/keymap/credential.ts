import { getAPIPath } from "~/api";

export const CREDENTIAL_TEST = 'CREDENTIAL_TEST';

const credentialmap: Record<string, (...params: any) => string> = {
    [CREDENTIAL_TEST]: () => getAPIPath('auth', `/credentials/test`),
}

export default credentialmap;