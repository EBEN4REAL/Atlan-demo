import { getAPIPath } from "~/api";

export const RUN_ARCHIVED_LIST = 'RUN_ARCHIVED_LIST';

const runmap: Record<string, (...params: any) => string> = {
    [RUN_ARCHIVED_LIST]: () => getAPIPath('auth', `/runs/archived`),
}

export default runmap;