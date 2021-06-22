import asset from "~/api/keyMaps/asset";

import user from "~/api/keyMaps/auth/user";
import tenant from "~/api/keyMaps/auth/tenant";
import group from "~/api/keyMaps/auth/group";
import connection from "~/api/keyMaps/auth/connection";
import glossary from "~/api/keyMaps/glossary";
import health from "~/api/keyMaps/health";
import apiKeys from "~/api/keyMaps/auth/apiKeys";
import role from "~/api/keyMaps/auth/role";
import { getAPIPath } from "..";

export default {
  ...asset,
  ...health,
  ...user,
  ...tenant,
  ...glossary,
  ...group,
  ...connection,
  ...apiKeys,
  ...role,
  BASIC_SEARCH: () => getAPIPath("auth/atlas", "/search/basic"),
};
