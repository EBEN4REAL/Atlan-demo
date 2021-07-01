import { getAPIPath } from "~/api";

export const WORKFLOW_LIST = 'WORKFLOW_LIST';

const worfklowmap: Record<string, (...params: any) => string> = {
    [WORKFLOW_LIST]: () => getAPIPath('auth/argo', `/workflows/default`),
}

export default worfklowmap;