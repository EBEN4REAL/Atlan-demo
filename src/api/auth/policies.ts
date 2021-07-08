import { getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
import { useAPI } from "~/api/useAPI";

const serviceAlias = "auth";

const evaluateAssetAccess = ({ cache, body }) => {
  return useAPI("ASSET_ACCESS", "POST", {
    cache,
    body,
  });
};

export const Policies = {
  evaluateAssetAccess,
};
