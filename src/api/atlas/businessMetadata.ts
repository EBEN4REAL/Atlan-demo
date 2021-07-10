import { UPDATE_ASSET_BUSINESS_METADATA } from "~/api/keyMaps/businessMetadata/index";
import { useAPI } from "../useAPIv2";

const saveAssetBMUpdateChanges = (guid: any, payload: any) => {
    const { error, isReady } = useAPI(UPDATE_ASSET_BUSINESS_METADATA, "POST", { params: { isOverwrite: true }, pathVariables: { guid }, cache: undefined, body: payload })
    return { error, isReady }
}

export const BusinessMetadata = {
    saveAssetBMUpdateChanges
}