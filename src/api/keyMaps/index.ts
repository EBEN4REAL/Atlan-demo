import asset from "~/api/keyMaps/asset";

import user from "~/api/keyMaps/auth/user";
import tenant from "~/api/keyMaps/auth/tenant";
import group from "~/api/keyMaps/auth/group";
import connection from "~/api/keyMaps/auth/connection";
import apiKeys from "~/api/keyMaps/auth/apiKeys";
import classification from "~/api/keyMaps/atlas/classification";

export default {
  ...asset,
  ...user,
  ...tenant,
  ...group,
  ...connection,
  ...apiKeys,
  ...classification,
};
