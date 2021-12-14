import map from './map'

export default {
    PAGE_ADMIN: [
        map.LIST_USERS,
        map.LIST_GROUPS,
        map.LIST_APIKEY,
        map.UPDATE_WORKSPACE,
        map.LIST_INTEGRATION,
    ],
    PAGE_GOVERNANCE: [
        map.LIST_PERSONA,
        map.LIST_PURPOSE,
        map.LIST_CLASSIFICATION,
        map.LIST_REQUEST,
        map.LIST_BUSINESS_METADATA,
        map.LIST_ENUM,
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
