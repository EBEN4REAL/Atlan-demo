/* eslint-disable import/prefer-default-export */
import { getAPIPath, getHealthPath, PathParams } from '~/api'

export const KeyMaps = {
    asset: {
        GET_ASSET_AUDIT: ({ guid }: PathParams) =>
            getAPIPath('auth/atlas', `/entity/${guid}/audit`),
        BASIC_SEARCH: () => getAPIPath('auth/atlas', '/search/basic'),
        SAVED_SEARCH: () => getAPIPath('auth/atlas', `/search/save`),
        GET_ASSET_RELATIONSHIP: () =>
            getAPIPath('auth/atlas', '/search/relationship'),
        PREVIEW_TABLE: () => getAPIPath('query', '/preview'),
        GET_ENTITY: ({ guid }: PathParams) =>
            getAPIPath('auth/atlas', `/entity/guid/${guid}`),
        GET_PREVIEW: ({ imageId }: PathParams) =>
            `/api/${getAPIPath('/auth', imageId)}`,
    },
    classification: {
        GET_CLASSIFICATION_LIST: () =>
            getAPIPath('auth/atlas', '/types/typedefs?type=classification'),
        CREATE_CLASSIFICATION: () =>
            getAPIPath('auth/atlas', '/types/typedefs'),
        BASIC_SEARCH: () => getAPIPath('auth/atlas', '/search/basic'),
        UPDATE_CLASSIFICATION: () =>
            getAPIPath('auth/atlas', '/types/typedefs'),
        ARCHIVE_CLASSIFICATION: ({ typeName, entityGuid }: PathParams) =>
            getAPIPath(
                'auth/atlas',
                `/entity/guid/${entityGuid}/classification/${typeName}`
            ),
        LINK_CLASSIFICATION: ({ entityGuid }: PathParams) =>
            getAPIPath(
                'auth/atlas',
                `/entity/guid/${entityGuid}/classifications`
            ),
    },
    lineage: {
        GET_LINEAGE: ({ guid, depth, direction }: PathParams) =>
            getAPIPath(
                'auth/atlas',
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
            UPLOAD_AVATAR: () => getAPIPath('auth', '/avatars'),
            GET_AVATAR: ({ username }: PathParams) =>
                `/api/${getAPIPath('auth', `/avatars/${username}`)}`,
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
                getAPIPath('auth', `/images/${id}`),
        },
        policies: {
            ASSET_ACCESS: () => getAPIPath('auth', '/access/evaluate'),
        },
        role: {
            LIST_ROLES: () => getAPIPath('auth', '/roles'),
        },
        tenant: {
            GET_TENANT: () => getAPIPath('auth', ''),
            TEST_SMTP_CONFIG: () => getAPIPath('auth', '/smtp/test'),
            UPDATE_SMTP: () => getAPIPath('auth', ''),
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
        requests: {
            LIST_REQUESTS: () => getAPIPath('auth', '/requests'),
            ACT_ON_REQUEST: ({ id }: PathParams) =>
                getAPIPath('auth', `/requests/${id}/action`),
        },
    },
    BM: {
        GET_BUSINESS_METADATA: () =>
            getAPIPath('auth/atlas', `/types/typedefs`),
        ADD_BUSINESS_METADATA: () =>
            getAPIPath('auth/atlas', `/types/typedefs`),
        UPDATE_BUSINESS_METADATA: () =>
            getAPIPath('auth/atlas', `/types/typedefs`),
        UPDATE_ASSET_BUSINESS_METADATA: ({ guid }: PathParams) =>
            getAPIPath('auth/atlas', `/entity/guid/${guid}/businessmetadata`),
    },
    glossary: {
        CREATE_GLOSSARY: () => getAPIPath('auth/atlas', '/glossary'),
        CREATE_GLOSSARY_CATEGORY: () =>
            getAPIPath('auth/atlas', '/glossary/category'),
        CREATE_GLOSSARY_TERM: () => getAPIPath('auth/atlas', '/glossary/term'),

        GET_GTC_ENTITY: () => getAPIPath('auth/atlas', `/search/basic`),
        GET_GLOSSARY: ({ guid }: PathParams) =>
            getAPIPath('auth/atlas', `/glossary/${guid}`),
        GET_CATEGORY: ({ guid }: PathParams) =>
            getAPIPath('auth/atlas', `/glossary/category/${guid}`),
        GET_TERM: ({ guid }: PathParams) =>
            getAPIPath('auth/atlas', `/glossary/term/${guid}`),

        DELETE_GLOSSARY: ({ guid }: PathParams) =>
            getAPIPath('auth/atlas', `/glossary/${guid}`),
        DELETE_GLOSSARY_CATEGORY: ({ guid }: PathParams) =>
            getAPIPath('auth/atlas', `/glossary/category/${guid}`),
        DELETE_GLOSSARY_TERM: ({ guid }: PathParams) =>
            getAPIPath('auth/atlas', `/glossary/term/${guid}`),

        UPDATE_GLOSSARY: ({ guid }: PathParams) =>
            getAPIPath('auth/atlas', `/glossary/${guid}`),
        UPDATE_GLOSSARY_CATEGORY: ({ guid }: PathParams) =>
            getAPIPath('auth/atlas', `/glossary/category/${guid}/partial`),
        UPDATE_GLOSSARY_TERM: ({ guid }: PathParams) =>
            getAPIPath('auth/atlas', `/glossary/term/${guid}/partial`),

        UPDATE_GLOSSARY_CATEGORY_FULL: ({ guid }: PathParams) =>
            getAPIPath('auth/atlas', `/glossary/category/${guid}`),

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
                'auth/atlas',
                `/glossary/${guid}/terms?limit=${limit ?? -1}${offset ? `&offset=${offset}` : ''
                }${searchText ? `&searchText=${searchText}` : ''}`
            ),

        GET_CATEGORY_TERMS: ({ guid }: PathParams) =>
            getAPIPath('auth/atlas', `/glossary/category/${guid}/terms`),

        GET_TERM_LINKED_ASSETS: () => getAPIPath('auth/atlas', `/search/basic`),
        ASSIGN_TERM_LINKED_ASSETS: ({ guid }: PathParams) =>
            getAPIPath(
                'auth/atlas',
                `/glossary/terms/${guid}/assignedEntities`
            ),
        GTC_SEARCH: () => getAPIPath('auth/atlas', `/search/basic`),
        GLOSSARY_LIST: () => getAPIPath('auth/atlas', `/search/basic`),
    },
    health: {
        PING_USER: () => getHealthPath('auth', '/debug/health'),
    },
    credential: {
        CREDENTIAL_TEST: () => getAPIPath('auth', `/credentials/test`),
        CREDENTIAL_TEST_BY_ID: ({ id }: PathParams) => getAPIPath('auth', `/credentials/${id}/test`),
        UPDATE_CREDENTIAL_BY_ID: ({ id }: PathParams) => getAPIPath('auth', `/credentials/${id}`),
    },
    connection: {
        TEST_NETWORK: () => getAPIPath('auth', "/connections/test"),
        SETUP: () => getAPIPath('auth', "/connections"),
        CONNECTION_SETUP: () => getAPIPath('auth/atlas', `/connections/setup`),
        CONNECTION_TEST_NETWORK: () => getAPIPath('auth', `/connections/test`),
        CONNECTION_ARCHIVE: ({ id }) => getAPIPath('auth', `/connections/${id}/archive`),
    },
    query: {
        RUN_QUERY: ({
            query,
            defaultSchema,
            dataSourceName,
            length,
        }: PathParams) =>
            getAPIPath(
                'api/query',
                `/sql/stream?sql=${query}&defaultSchema=${defaultSchema}&dataSourceName=${dataSourceName}&length=${length}`
            ),
    },
    bots: {
        WORKFLOW_LOG_STREAM: ({ }: PathParams) =>
            getAPIPath(
                'api/auth/argo',
                `/workflows/default/atlan-init-tgx7h/log?logOptions.container=main&grep=&logOptions.follow=true`
            ),
    },
    schemaExplorer: {
        BASIC_SEARCH: () => getAPIPath('auth/atlas', '/search/basic'),
    },
    savedQueries: {
        RELATIONSHIP: () => getAPIPath('auth/atlas', '/search/relationship'),
        BASIC_SEARCH: () => getAPIPath('auth/atlas', '/search/basic'),
    }
}
