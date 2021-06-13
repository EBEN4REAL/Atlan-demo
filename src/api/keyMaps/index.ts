import user from "~/api/keyMaps/auth/user";
import tenant from "~/api/keyMaps/auth/tenant"
import group from "~/api/keyMaps/auth/group";
import connection from "~/api/keyMaps/auth/connection"

export default {
    ...user,
    ...tenant,
    ...group,
    ...connection
};
