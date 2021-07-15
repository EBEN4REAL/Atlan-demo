import { UPDATE_ASSET_BUSINESS_METADATA } from "~/api/keyMaps/businessMetadata/index";
import { useAPI } from "../useAPI";

const saveAssetBMUpdateChanges = (guid: any, payload: any) => {
    return useAPI(UPDATE_ASSET_BUSINESS_METADATA, "POST",
        { params: { isOverwrite: true }, pathVariables: { guid }, cache: undefined, body: payload }
    )
}

export const BusinessMetadata = {
    saveAssetBMUpdateChanges
}