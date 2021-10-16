import { AxiosRequestConfig } from "axios";
import { getAPIPath, getAxiosClient } from "~/api";
import { useAPI } from "~/services/api/useAPI";

const serviceAlias = "auth";

const evaluateAssetAccess = ({ cache, body }) => useAPI("ASSET_ACCESS", "POST", {
    cache,
    body,
  });

export const Policies = {
  evaluateAssetAccess,
};
