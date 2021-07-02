import { useTimeAgo } from "@vueuse/core";
import { pluralizeString } from "~/composables//utils/string-operations";
export const getFormattedGroup = (group: any) => {
  //deliberately switching alias and name so as to keep alias as a unique identifier for the group, for keycloak name is the unique identifier. For us, alias is the unique identifier and different groups with same name can exist.
  let formattedGroup = {
    id: group.id,
    name: group?.attributes?.alias?.[0] ?? "-",
    alias: group.name,
    createdAt: group?.attributes?.created_at?.[0] ?? "-",
    createdAtTimeAgo: group?.attributes?.created_at?.[0]
      ? useTimeAgo(group.attributes.created_at?.[0]).value
      : "",
    createdBy: group?.attributes?.created_by?.[0] ?? "-",
    image: group.attributes.image[0] || "",
    description: group.attributes.description[0] || "",
    memberCount: group.user_count || 0,
    memberCountString: pluralizeString("member", group.user_count || 0),
    isDefault: group?.attributes?.isDefault ?? false,
  };
  return formattedGroup || {};
};
