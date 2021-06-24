import asset from "~/api/keyMaps/asset";

import user from "~/api/keyMaps/auth/user";
import tenant from "~/api/keyMaps/auth/tenant";
import group from "~/api/keyMaps/auth/group";
import avatar from "~/api/keyMaps/auth/avatar";
import connection from "~/api/keyMaps/auth/connection";
import glossary from "~/api/keyMaps/glossary";
import health from "~/api/keyMaps/health";
import apiKeys from "~/api/keyMaps/auth/apiKeys";
import role from "~/api/keyMaps/auth/role";
import search from "~/api/keyMaps/search";
import classification from "~/api/keyMaps/atlas/classification";

export default {
  ...asset,
  ...health,
  ...user,
  ...tenant,
  ...connection,
  ...apiKeys,
  ...classification,
  ...glossary,
  ...group,
  ...role,
  ...avatar,
  ...search,
};
