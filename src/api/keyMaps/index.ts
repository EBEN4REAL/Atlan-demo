import user from '@services/keycloak/users/users_keymap'
import asset from '~/api/keyMaps/asset'

import businessMetadata from '~/api/keyMaps/businessMetadata'

import tenant from '~/api/keyMaps/auth/tenant'
import group from '@services/keycloak/groups/groups_keymap'
import avatar from '~/api/keyMaps/auth/avatar'
import connection from '~/api/keyMaps/auth/connection'
import glossary from '~/api/keyMaps/glossary'
import health from '~/api/keyMaps/health'
import apiKeys from '~/api/keyMaps/auth/apiKeys'
import role from '~/api/keyMaps/auth/role'
import search from '~/api/keyMaps/search'
import classification from '~/api/keyMaps/atlas/classification'
import lineage from '~/api/keyMaps/atlas/lineage'
import image from '~/api/keyMaps/auth/image'
import policies from '~/api/keyMaps/auth/policies'
import requests from '~/api/keyMaps/heracles/request'

export default {
    ...asset,
    ...health,
    ...user,
    ...tenant,
    ...glossary,
    ...group,
    ...connection,
    ...businessMetadata,
    ...apiKeys,
    BASIC_SEARCH: () => getAPIPath('auth/atlas', '/search/basic'),
    ...classification,
    ...lineage,
    ...role,
    ...avatar,
    ...search,
    ...image,
    ...policies,
    ...requests,
}
