import asset from "~/api/keyMaps/asset";

import user from "~/api/keyMaps/auth/user";
import tenant from "~/api/keyMaps/auth/tenant";
import group from "~/api/keyMaps/auth/group";
import connection from "~/api/keyMaps/auth/connection";
import role from "~/api/keyMaps/auth/role";

export default {
  ...asset,
  ...user,
  ...tenant,
  ...group,
  ...connection,
  ...role,
};
