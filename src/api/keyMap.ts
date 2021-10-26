/* eslint-disable import/prefer-default-export */
import { getAPIPath, getHealthPath, PathParams } from '~/api'

export const KeyMaps = {
    asset: {
        GET_ASSET_AUDIT: ({ guid }: PathParams) =>
            getAPIPath('meta', `/entity/${guid}/audit`),
        BASIC_SEARCH: () => getAPIPath('meta', '/search/basic'),
        SAVED_SEARCH: () => getAPIPath('meta', '/search/saved'),
        GET_ASSET_RELATIONSHIP: () =>
            getAPIPath('meta', '/search/relationship'),
        PREVIEW_TABLE: () => getAPIPath('sql', '/query/preview'),
        GET_ENTITY: ({ guid }: PathParams) =>
            getAPIPath('meta', `/entity/guid/${guid}`),
        GET_PREVIEW: ({ imageId }: PathParams) =>
            `/api/${getAPIPath('/auth', imageId)}`,
        BULK_UPDATE_ASSETS: () => getAPIPath('meta', '/entity/bulk'),
    },
    classification: {
        GET_CLASSIFICATION_LIST: () =>
            getAPIPath('meta', '/types/typedefs?type=classification'),
        CREATE_CLASSIFICATION: () => getAPIPath('meta', '/types/typedefs'),
        BASIC_SEARCH: () => getAPIPath('meta', '/search/basic'),
        UPDATE_CLASSIFICATION: () => getAPIPath('meta', '/types/typedefs'),
        ARCHIVE_CLASSIFICATION: ({ typeName, entityGuid }: PathParams) =>
            getAPIPath(
                'meta',
                `/entity/guid/${entityGuid}/classification/${typeName}`
            ),
        LINK_CLASSIFICATION: ({ entityGuid }: PathParams) =>
            getAPIPath('meta', `/entity/guid/${entityGuid}/classifications`),
        // supports n:n linking i.e. n entities -> n classifications; only caveat: we need to send the existing clsfs as well as newly added otherwise they'll be removed
        BULK_LINK_CLASSIFICATION: () =>
            getAPIPath('meta', `/entity/bulk/setClassifications`),
    },
    lineage: {
        GET_LINEAGE: ({ guid, depth, direction }: PathParams) =>
            getAPIPath(
                'meta',
                `/lineage/${guid}?depth=${depth}&direction=${direction}`
            ),
    },
    auth: {
        apiKeys: {
            GET_API_KEYS: () => getAPIPath('auth', '/accesstokens'),
            DELETE_API_KEY: ({ id }: PathParams) =>
                getAPIPath('auth', `/accesstokens/${id}/delete`),
        },
        avatar: {
            UPLOAD_AVATAR: () => getAPIPath('service', '/avatars'),
            GET_AVATAR: ({ username }: PathParams) =>
                `/api/${getAPIPath('service', `/avatars/${username}`)}`,
        },
        connection: {
            TEST_NETWORK: () => getAPIPath('auth', '/connections/test'),
            Setup: () => getAPIPath('auth', '/connections'),
        },
        group: {
            LIST_GROUPS: () => getAPIPath('auth', '/groups'),
            GET_GROUP: () => getAPIPath('auth', `/groups`),
            UPDATE_GROUP: ({ id }: PathParams) =>
                getAPIPath('auth', `/groups/${id}`),
            DELETE_GROUP: ({ id }: PathParams) =>
                getAPIPath('auth', `/groups/${id}/delete`),
            CREATE_GROUP: () => getAPIPath('auth', `/groups`),
            REMOVE_MEMBERS_FROM_GROUP: ({ id }: PathParams) =>
                getAPIPath('auth', `/groups/${id}/members/remove`),
            ADD_MEMBERS_TO_GROUP: ({ id }: PathParams) =>
                getAPIPath('auth', `/groups/${id}/members`),
        },
        image: {
            UPLOAD_IMAGE: () => getAPIPath('auth', '/images'),
            GET_IMAGE: ({ id }: PathParams) =>
                getAPIPath('service', `/images/${id}`),
        },
        policies: {
            ASSET_ACCESS: () => getAPIPath('auth', '/access/evaluate'),
        },
        role: {
            LIST_ROLES: () =>
                getAPIPath('service', '/workspaceroles?type=default'),
        },
        tenant: {
            GET_TENANT: () => getAPIPath('service', '/tenants/default'),
            UPDATE_TENANT: () => getAPIPath('service', '/tenants/default'),
            TEST_SMTP_CONFIG: () => getAPIPath('auth', '/smtp/test'),
            UPDATE_SMTP: () => getAPIPath('auth', ''),
            CREATE_LOGO: () => getAPIPath('service', '/logo'),
        },
        user: {
            LIST_USERS: () => getAPIPath('auth', '/users'),
            GET_USER: () => getAPIPath('auth', '/users'),
            UPDATE_USER: ({ id }: PathParams) =>
                getAPIPath('auth', `/users/${id}`),
            GET_USER_SESSIONS: ({ id }: PathParams) =>
                getAPIPath('auth', `/users/${id}/sessions`),
            SIGN_OUT_ALL_SESSIONS: ({ id }: PathParams) =>
                getAPIPath('auth', `/users/${id}/sessions/delete`),
            SIGN_OUT_SESSION_BY_ID: ({ id }: PathParams) =>
                getAPIPath('auth', `/users/sessions/${id}/delete`),
            GET_USER_ACCESS_LOGS: ({ id }: PathParams) =>
                getAPIPath('auth', `/users/${id}/events`),
            UPDATE_USER_ROLE: ({ id }: PathParams) =>
                getAPIPath('auth', `/users/${id}/roles/update`),
            ADD_USER_TO_GROUPS: ({ id }: PathParams) =>
                getAPIPath('auth', `/users/${id}/groups`),
            RESEND_INVITATION_EMAIL: ({ id }: PathParams) =>
                getAPIPath('auth', `/users/${id}/resendinvite`),
            REVOKE_INVITATION: ({ id }: PathParams) =>
                getAPIPath('auth', `/users/${id}/delete`),
            /** FIXME: Not implemented properly */
            INVITE_USERS: ({ id }: PathParams) => getAPIPath('auth', `/users`),
        },
    },
    BM: {
        GET_BUSINESS_METADATA: () => getAPIPath('meta', `/types/typedefs`),
        ADD_BUSINESS_METADATA: () => getAPIPath('meta', `/types/typedefs`),
        UPDATE_BUSINESS_METADATA: () => getAPIPath('meta', `/types/typedefs`),
        UPDATE_ASSET_BUSINESS_METADATA: ({ guid }: PathParams) =>
            getAPIPath('meta', `/entity/guid/${guid}/businessmetadata`),
    },
    glossary: {
        CREATE_GLOSSARY: () => getAPIPath('meta', '/glossary'),
        CREATE_GLOSSARY_CATEGORY: () =>
            getAPIPath('meta', '/glossary/category'),
        CREATE_GLOSSARY_TERM: () => getAPIPath('meta', '/glossary/term'),

        GET_GTC_ENTITY: () => getAPIPath('meta', `/search/basic`),
        GET_GLOSSARY: ({ guid }: PathParams) =>
            getAPIPath('meta', `/glossary/${guid}`),
        GET_CATEGORY: ({ guid }: PathParams) =>
            getAPIPath('meta', `/glossary/category/${guid}`),
        GET_TERM: ({ guid }: PathParams) =>
            getAPIPath('meta', `/glossary/term/${guid}`),

        DELETE_GLOSSARY: ({ guid }: PathParams) =>
            getAPIPath('meta', `/glossary/${guid}`),
        DELETE_GLOSSARY_CATEGORY: ({ guid }: PathParams) =>
            getAPIPath('meta', `/glossary/category/${guid}`),
        DELETE_GLOSSARY_TERM: ({ guid }: PathParams) =>
            getAPIPath('meta', `/glossary/term/${guid}`),

        UPDATE_GLOSSARY: ({ guid }: PathParams) =>
            getAPIPath('meta', `/glossary/${guid}`),
        UPDATE_GLOSSARY_CATEGORY: ({ guid }: PathParams) =>
            getAPIPath('meta', `/glossary/category/${guid}/partial`),
        UPDATE_GLOSSARY_TERM: ({ guid }: PathParams) =>
            getAPIPath('meta', `/glossary/term/${guid}/partial`),

        UPDATE_GLOSSARY_CATEGORY_FULL: ({ guid }: PathParams) =>
            getAPIPath('meta', `/glossary/category/${guid}`),

        GET_GLOSSARY_CATEGORIES: ({
            guid,
            limit,
            offset,
            searchText,
        }: Record<string, any>) =>
            getAPIPath(
                'auth/atlas',
                `/glossary/${guid}/categories?limit=${limit ?? -1}${offset ? `&offset=${offset}` : ''
                }${searchText ? `&searchText=${searchText}` : ''}`
            ),
        GET_GLOSSARY_TERMS: ({ guid, limit, offset, searchText }: PathParams) =>
            getAPIPath(
                'meta',
                `/glossary/${guid}/terms?limit=${limit ?? -1}${offset ? `&offset=${offset}` : ''
                }${searchText ? `&searchText=${searchText}` : ''}`
            ),
        BULK_LINK_TERMS: () =>
            getAPIPath('meta', `/glossary/terms/assignedEntities`),
        health: {
            PING_USER: () => getHealthPath('auth', '/debug/health'),
        },
        CREDENTIAL_TEST: () => getAPIPath('auth', `/credentials/test`),
        CREDENTIAL_TEST_BY_ID: ({ id }: PathParams) =>
            getAPIPath('auth', `/credentials/${id}/test`),
        UPDATE_CREDENTIAL_BY_ID: ({ id }: PathParams) =>
            getAPIPath('auth', `/credentials/${id}`),
    },
    connection: {
        TEST_NETWORK: () => getAPIPath('auth', '/connections/test'),
        CONNECTION_SETUP: () => getAPIPath('meta', `/connections/setup`),
        CONNECTION_TEST_NETWORK: () => getAPIPath('auth', `/connections/test`),
        CONNECTION_ARCHIVE: ({ id }) =>
            getAPIPath('auth', `/connections/${id}/archive`),
    },
    // `/sql/stream?sql=${query}&defaultSchema=${defaultSchema}&dataSourceName=${dataSourceName}&length=${length}`
    query: {
        RUN_QUERY: ({ params }: PathParams) =>
            getAPIPath('api/query', `/sql/stream?${params}`),
    },
    bots: {
        WORKFLOW_LOG_STREAM: ({ }: PathParams) =>
            getAPIPath(
                'api/auth/argo',
                `/workflows/default/atlan-init-tgx7h/log?logOptions.container=main&grep=&logOptions.follow=true`
            ),
    },
    insights: {
        BASIC_SEARCH: () => getAPIPath('meta', '/search/basic'),
        CREATE_SAVED_QUERY: () => getAPIPath('meta', '/entity'),
    },
    savedQueries: {
        RELATIONSHIP: () => getAPIPath('meta', '/search/relationship'),
        BASIC_SEARCH: () => getAPIPath('meta', '/search/basic'),
    },
    workflow: {
        WORKFLOW: () => getAPIPath('/service', `/workflows`),
        CREATE_WORKFLOW: () => getAPIPath('/service', `/workflows`),
        WORKFLOW_UPDATE_BY_NAME: ({ name }: PathParams) =>
            getAPIPath('/service', `/workflows/${name}`),
        ARCHIVED_WORKFLOW: () => getAPIPath('/service', `/archived-workflows`),
        ARCHIVED_WORKFLOW_RUN: ({  }: PathParams) =>
          getAPIPath('/service', `/runs/archived?`),
        WORKFLOW_TEMPLATE: () => getAPIPath('/service', `/workflowtemplates`),
        // TODO REMOVE this, use workflow template
        WORKFLOW_TEMPLATE_NAME: ({ filter }: PathParams) =>
            getAPIPath('/service', `/workflowtemplates?filter=${filter}`),
        // TODO REMOVE this, use workflow 
        WORKFLOW_BY_NAME: ({ filter }: PathParams) =>
            getAPIPath('/service', `/workflows?filter=${filter}`),
        WORKFLOW_CONFIG_MAP: () => getAPIPath('/service', `/configmaps`),
    },
}
