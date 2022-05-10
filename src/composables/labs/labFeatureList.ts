import { computed } from 'vue'
import useTenantData from '~/composables/tenant/useTenantData'

export const orgPrefrencesKey = 'orgLabPreferences'

// 7 days in milliseconds
const showNewTagRangeMs = 7 * 24 * 60 * 60 * 100
export const INSIGHT_WORKSPACE_LEVEL_TAB = 'INSIGHT_WORKSPACE_TAB_ENABLED'
export const INSIGHT_SCHEDULE_QUERY = 'INSIGHT_SCHEDULE_QUERY'
export const INSIGHT_TABLE_PREVIEW = 'INSIGHT_TABLE_PREVIEW_ENABLED'
export const INSIGHT_DATA_DOWNLOAD = 'INSIGHT_DATA_DOWNLOAD'
export const WORKFLOW_CENTER_V2 = 'WORKFLOW_CENTER_V2_ENABLED'

export const featureList = [
    {
        name: 'Insights',
        key: INSIGHT_WORKSPACE_LEVEL_TAB,
        description:
            'You can enable/disable the Insights workspace for all users',
        // if the config isn't present in tenant/user preferences, default value will be picked up from here
        defaultValue: true,
        // if feature needs a different feature to be active 
        dependantFeatureKey: null,
        // only these users will be allowed
        allowedUsers: [],
        allowedGroups: [],
        // these users will be deined even if its enabled for whole org
        deniedUsers: [],
        deniedGroups: [],
        // should it show up in admin center to configure for organisation
        isAdminLevel: true,
        // should it show up in user preferences
        isUserLevel: false,
        // shows beta tag on UI
        isBeta: false,
        // shows `new` tag based on show_new_tag_range
        releaseDate: null,
    },
    {
        name: 'Schedule Queries',
        key: INSIGHT_SCHEDULE_QUERY,
        description:
            'You can enable/disable Schedule Queries for all users',
        // if the config isn't present in tenant/user preferences, default value will be picked up from here
        defaultValue: true,
        // only these users will be allowed
        // if feature needs a different feature to be active 
        dependantFeatureKey: INSIGHT_WORKSPACE_LEVEL_TAB,
        allowedUsers: [],
        allowedGroups: [],
        // these users will be deined even if its enabled for whole org
        deniedUsers: [],
        deniedGroups: [],
        // should it show up in admin center to configure for organisation
        isAdminLevel: true,
        // should it show up in user preferences
        isUserLevel: false,
        // shows beta tag on UI
        isBeta: false,
        // shows `new` tag based on show_new_tag_range
        releaseDate: null,
    },
    {
        name: 'Download data',
        key: INSIGHT_DATA_DOWNLOAD,
        description:
            'Ability to download and copy results of a query in insights',
        // if the config isn't present in tenant/user preferences, default value will be picked up from here
        defaultValue: true,
        // if feature needs a different feature to be active 
        dependantFeatureKey: null,
        // only these users will be allowed
        allowedUsers: [],
        allowedGroups: [],
        // these users will be deined even if its enabled for whole org
        deniedUsers: [],
        deniedGroups: [],
        // should it show up in admin center to configure for organisation
        isAdminLevel: true,
        // should it show up in user preferences
        isUserLevel: true,
        isBeta: false,
    },
    // {
    //     name: 'New table preview',
    //     key: INSIGHT_TABLE_PREVIEW,
    //     description: 'View and compare multiple table previews at once',
    //     // if the config isn't present in tenant/user preferences, default value will be picked up from here
    //     defaultValue: true,
    //     // only these users will be allowed
    //     allowedUsers: [],
    //     allowedGroups: [],
    //     // these users will be deined even if its enabled for whole org
    //     deniedUsers: [],
    //     deniedGroups: [],
    //     // should it show up in admin center to configure for organisation
    //     isAdminLevel: true,
    //     // should it show up in user preferences
    //     isUserLevel: false,
    //     isBeta: true,
    // },
    {
        name: 'New workflow center',
        key: WORKFLOW_CENTER_V2,
        description:
            'New enhanced workflow monitoring and discovery experience',
        // if the config isn't present in tenant/user preferences, default value will be picked up from here
        defaultValue: false,
        // only these users will be allowed
        allowedUsers: [],
        allowedGroups: [],
        // these users will be deined even if its enabled for whole org
        deniedUsers: [],
        deniedGroups: [],
        // should it show up in admin center to configure for organisation
        isAdminLevel: true,
        // should it show up in user preferences
        isUserLevel: false,
        isBeta: true,
    },
]

export const showNewTagOnFeature = (feature) =>
    feature.releaseDate < Date.now() - showNewTagRangeMs

export const featureEnabledMap = computed(() => {
    const { tenantRaw } = useTenantData()
    const attributes = tenantRaw.value.attributes || {}
    const preferences = JSON.parse(attributes[orgPrefrencesKey] || '{}') || {}
    featureList.forEach((feature) => {
        if (!(feature.key in preferences)) {
            preferences[feature.key] = feature.defaultValue
        }
    })
    console.log('featureEnabledMap preferences', preferences)
    return preferences
})
