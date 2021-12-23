import { useTimeAgo } from '@vueuse/core'
import { pluralizeString } from '~//utils/string'

export const getFormattedGroup = (group: any) => {
    // deliberately switching alias and name so as to keep alias as a unique identifier for the group, for keycloak name is the unique identifier. For us, alias is the unique identifier and different groups with same name can exist.
    const formattedGroup = {
        id: group.id,
        name: group?.attributes?.alias?.[0] ?? '-',
        alias: group.name,
        createdAt: group?.attributes?.createdAt?.[0] ?? '-',
        createdAtTimeAgo: group?.attributes?.createdAt?.[0]
            ? useTimeAgo(parseInt(group.attributes.createdAt?.[0])).value
            : '',
        createdBy: group?.attributes?.createdBy?.[0] ?? '-',
        description: group?.attributes?.description?.[0] || '',
        memberCount: group.userCount || 0,
        memberCountString: pluralizeString('member', group.userCount || 0),
        isDefault: group?.attributes?.isDefault?.[0] ?? false,
    }
    return formattedGroup || {}
}
