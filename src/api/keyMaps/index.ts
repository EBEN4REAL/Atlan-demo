import asset from "~/api/keyMaps/asset";

import user from "~/api/keyMaps/auth/user";
import tenant from "~/api/keyMaps/auth/tenant";
import avatar from "~/api/keyMaps/auth/avatar";
import group from "~/api/keyMaps/auth/group";
import connection from "~/api/keyMaps/auth/connection";
import glossary from "~/api/keyMaps/glossary";
import apiKeys from "~/api/keyMaps/auth/apiKeys";
import role from "~/api/keyMaps/auth/role";
import search from "~/api/keyMaps/search";

import { getAPIPath } from "..";

export default {
  ...asset,
  ...user,
  ...tenant,
  ...glossary,
  ...group,
  ...connection,
  ...apiKeys,
  ...role,
  ...avatar,
  ...search,
};
