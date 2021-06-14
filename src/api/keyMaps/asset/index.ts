import { getAPIPath } from "~/api";

export const GET_ASSET_AUDIT = 'GET_ASSET_AUDIT';

const groupsMap: Record<string, (...params: any) => string> = {
    [GET_ASSET_AUDIT]: ({ guid }: Record<string, string>) => getAPIPath('auth/atlas', `/entity/${guid}/audit`),
}

export default groupsMap;