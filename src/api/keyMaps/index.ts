import asset from "~/api/keyMaps/asset";

import businessMetadata from "~/api/keyMaps/businessMetadata";

import user from "~/api/keyMaps/auth/user";
import tenant from "~/api/keyMaps/auth/tenant";
import group from "~/api/keyMaps/auth/group";
import avatar from "~/api/keyMaps/auth/avatar";
import connection from "~/api/keyMaps/auth/connection";
import glossary from "~/api/keyMaps/glossary";
import apiKeys from "~/api/keyMaps/auth/apiKeys";
import role from "~/api/keyMaps/auth/role";
import search from "~/api/keyMaps/search";
import classification from "~/api/keyMaps/atlas/classification";
import image from "~/api/keyMaps/auth/image";

export default {
  ...asset,
  ...user,
  ...tenant,
  ...glossary,
  ...group,
  ...connection,
  ...businessMetadata,
  ...apiKeys,
  BASIC_SEARCH: () => getAPIPath("auth/atlas", "/search/basic"),
  ...classification,
  ...role,
  ...avatar,
  ...search,
  ...image,
};
