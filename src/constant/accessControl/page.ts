import map from './map'

export default {
    PAGE_ADMIN: [
        map.CREATE_USERS,
        map.CREATE_GROUP,
        map.CREATE_APIKEY,
        map.UPDATE_WORKSPACE,
        map.UPDATE_INTEGRATIONS,
    ],
    PAGE_GOVERNANCE: [
        map.CREATE_PERSONA,
        map.CREATE_PURPOSE,
        map.CREATE_CLASSIFICATION,
        map.APPROVE_REQUEST,
        map.CREATE_BUSINESS_METADATA,
        map.CREATE_ENUM,
        map.QUERY_ACCESS_LOGS,
        map.QUERY_SQL_LOGS,
    ],
    PAGE_PLATFORM: [],
    PAGE_REPORTING: [],
    PAGE_WORKFLOWS: [map.LIST_WORKFLOW],
    PAGE_GLOSSARY: [],
    PAGE_ASSETS: [],
    PAGE_HOME: [],
}
