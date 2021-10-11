/* eslint-disable import/prefer-default-export */
import { getAPIPath, getHealthPath, PathParams } from '~/api'

export const KeyMaps = {
    asset: {
        GET_ASSET_AUDIT: ({ guid }: PathParams) =>
            getAPIPath('meta', `/entity/${guid}/audit`),
        BASIC_SEARCH: () => getAPIPath('meta', '/search/basic'),
        SAVED_SEARCH: () => getAPIPath('meta', `/search/save`),
        GET_ASSET_RELATIONSHIP: () =>
            getAPIPath('meta', '/search/relationship'),
        PREVIEW_TABLE: () => getAPIPath('query', '/preview'),
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
            GET_API_KEYS: () => getAPIPath('service', '/accesstokens'),
            DELETE_API_KEY: ({ id }: PathParams) =>
                getAPIPath('service', `/accesstokens/${id}/delete`),
        },
        avatar: {
            UPLOAD_AVATAR: () => getAPIPath('service', '/avatars'),
            GET_AVATAR: ({ username }: PathParams) =>
                `/api/${getAPIPath('service', `/avatars/${username}`)}`,
        },
        connection: {
            TEST_NETWORK: () => getAPIPath('service', '/connections/test'),
            Setup: () => getAPIPath('service', '/connections'),
        },
        group: {
            LIST_GROUPS: () => getAPIPath('service', '/groups'),
            GET_GROUP: () => getAPIPath('service', `/groups`),
            UPDATE_GROUP: ({ id }: PathParams) =>
                getAPIPath('service', `/groups/${id}`),
            DELETE_GROUP: ({ id }: PathParams) =>
                getAPIPath('service', `/groups/${id}/delete`),
            CREATE_GROUP: () => getAPIPath('service', `/groups`),
            REMOVE_MEMBERS_FROM_GROUP: ({ id }: PathParams) =>
                getAPIPath('service', `/groups/${id}/members/remove`),
            ADD_MEMBERS_TO_GROUP: ({ id }: PathParams) =>
                getAPIPath('service', `/groups/${id}/members`),
        },
        image: {
            UPLOAD_IMAGE: () => getAPIPath('service', '/images'),
            GET_IMAGE: ({ id }: PathParams) =>
                getAPIPath('service', `/images/${id}`),
        },
        policies: {
            ASSET_ACCESS: () => getAPIPath('service', '/access/evaluate'),
        },
        role: {
            LIST_ROLES: () => getAPIPath('service', '/roles'),
        },
        tenant: {
            GET_TENANT: () => getAPIPath('service', '/tenants/default'),
            TEST_SMTP_CONFIG: () => getAPIPath('service', '/smtp/test'),
            UPDATE_SMTP: () => getAPIPath('service', ''),
        },
        user: {
            LIST_USERS: () => getAPIPath('service', '/users'),
            GET_USER: () => getAPIPath('service', '/users'),
            UPDATE_USER: ({ id }: PathParams) =>
                getAPIPath('service', `/users/${id}`),
            GET_USER_SESSIONS: ({ id }: PathParams) =>
                getAPIPath('service', `/users/${id}/sessions`),
            SIGN_OUT_ALL_SESSIONS: ({ id }: PathParams) =>
                getAPIPath('service', `/users/${id}/sessions/delete`),
            SIGN_OUT_SESSION_BY_ID: ({ id }: PathParams) =>
                getAPIPath('service', `/users/sessions/${id}/delete`),
            GET_USER_ACCESS_LOGS: ({ id }: PathParams) =>
                getAPIPath('service', `/users/${id}/events`),
            UPDATE_USER_ROLE: ({ id }: PathParams) =>
                getAPIPath('service', `/users/${id}/roles/update`),
            ADD_USER_TO_GROUPS: ({ id }: PathParams) =>
                getAPIPath('service', `/users/${id}/groups`),
            RESEND_INVITATION_EMAIL: ({ id }: PathParams) =>
                getAPIPath('service', `/users/${id}/resendinvite`),
            REVOKE_INVITATION: ({ id }: PathParams) =>
                getAPIPath('service', `/users/${id}/delete`),
            /** FIXME: Not implemented properly */
            INVITE_USERS: ({ id }: PathParams) =>
                getAPIPath('service', `/users`),
        },
        requests: {
            LIST_REQUESTS: () => getAPIPath('service', '/requests'),
            ACT_ON_REQUEST: ({ id }: PathParams) =>
                getAPIPath('service', `/requests/${id}/action`),
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
                'meta',
                `/glossary/${guid}/categories?limit=${limit ?? -1}${
                    offset ? `&offset=${offset}` : ''
                }${searchText ? `&searchText=${searchText}` : ''}`
            ),
        GET_GLOSSARY_TERMS: ({ guid, limit, offset, searchText }: PathParams) =>
            getAPIPath(
                'meta',
                `/glossary/${guid}/terms?limit=${limit ?? -1}${
                    offset ? `&offset=${offset}` : ''
                }${searchText ? `&searchText=${searchText}` : ''}`
            ),

        GET_CATEGORY_TERMS: ({ guid }: PathParams) =>
            getAPIPath('meta', `/glossary/category/${guid}/terms`),

        GET_TERM_LINKED_ASSETS: () => getAPIPath('meta', `/search/basic`),
        ASSIGN_TERM_LINKED_ASSETS: ({ guid }: PathParams) =>
            getAPIPath('meta', `/glossary/terms/${guid}/assignedEntities`),
        BULK_LINK_TERMS: () =>
            getAPIPath('meta', `/glossary/terms/assignedEntities`),
        GTC_SEARCH: () => getAPIPath('meta', `/search/basic`),
        GLOSSARY_LIST: () => getAPIPath('meta', `/search/basic`),
    },
    health: {
        PING_USER: () => getHealthPath('service', '/debug/health'),
    },
    credential: {
        CREDENTIAL_TEST: () => getAPIPath('service', `/credentials/test`),
        CREDENTIAL_TEST_BY_ID: ({ id }: PathParams) =>
            getAPIPath('service', `/credentials/${id}/test`),
        UPDATE_CREDENTIAL_BY_ID: ({ id }: PathParams) =>
            getAPIPath('service', `/credentials/${id}`),
    },
    connection: {
        TEST_NETWORK: () => getAPIPath('service', '/connections/test'),
        SETUP: () => getAPIPath('service', '/connections'),
        CONNECTION_SETUP: () => getAPIPath('meta', `/connections/setup`),
        CONNECTION_TEST_NETWORK: () =>
            getAPIPath('service', `/connections/test`),
        CONNECTION_ARCHIVE: ({ id }) =>
            getAPIPath('service', `/connections/${id}/archive`),
    },
    // `/sql/stream?sql=${query}&defaultSchema=${defaultSchema}&dataSourceName=${dataSourceName}&length=${length}`
    query: {
        RUN_QUERY: ({ params }: PathParams) =>
            getAPIPath('api/query', `/sql/stream?${params}`),
    },
    bots: {
        WORKFLOW_LOG_STREAM: ({}: PathParams) =>
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
        WORKFLOW_TEMPLATES: ({ tenant }: PathParams) =>
            getAPIPath('/auth/argo', `/workflow-templates/${tenant}`),
        ARCHIVED_WORKFLOW: () =>
            getAPIPath('/auth/argo', `/archived-workflows`),
        ARCHIVED_WORKFLOW_RUN: ({ guid }: PathParams) =>
            getAPIPath('/auth/argo', `/archived-workflows/${guid}`),
        CLUSTER_WORKFLOW_TEMPLATE: () =>
            getAPIPath('/auth/argo', `/cluster-workflow-templates`),
        WORKFLOW_TEMPLATES_BY_NAME: ({ tenant, name }: PathParams) =>
            getAPIPath('/auth/argo', `/workflow-templates/${tenant}/${name}`),
    },
}
