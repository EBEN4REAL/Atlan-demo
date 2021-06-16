import asset from "~/api/keyMaps/asset"

import user from "~/api/keyMaps/auth/user";
import tenant from "~/api/keyMaps/auth/tenant"
import group from "~/api/keyMaps/auth/group";
import connection from "~/api/keyMaps/auth/connection"
import glossary from "~/api/keyMaps/glossary";
import apiKeys from "~/api/keyMaps/auth/apiKeys";
import { getAPIPath } from "..";

export default {
    ...asset,
    ...user,
    ...tenant,
    ...glossary,
    ...group,
    ...connection,
    ...apiKeys,
    "BASIC_SEARCH":() => getAPIPath("auth/atlas", "/search/basic")
};
