import { computed } from 'vue'
import useTenantData from '~/composables/tenant/useTenantData'

import InsightsPreview from '~/assets/images/preference/Insights-workspace-toggle.gif'
import ScheduledQueryPreview from '~/assets/images/preference/Schedule-queries-toggle.gif'
import DownloadDataPreview from '~/assets/images/preference/Download-Data-toggle.gif'
import WorkflowPreview from '~/assets/images/preference/Worflow-Center-Image.png'
import LookerFieldPreview from '~/assets/images/preference/Looker-level-lineage.png'
import TermsAttributesPreview from '~/assets/images/preference/terms_attribute_preference.gif'

export const orgPrefrencesKey = 'orgLabPreferences'

// 7 days in milliseconds
const showNewTagRangeMs = 7 * 24 * 60 * 60 * 100
export const INSIGHT_WORKSPACE_LEVEL_TAB = 'INSIGHT_WORKSPACE_TAB_ENABLED'
export const INSIGHT_SCHEDULE_QUERY = 'INSIGHT_SCHEDULE_QUERY'
export const INSIGHT_TABLE_PREVIEW = 'INSIGHT_TABLE_PREVIEW_ENABLED'
export const INSIGHT_DATA_DOWNLOAD = 'INSIGHT_DATA_DOWNLOAD'
export const LINEAGE_LOOKER_FIELD_LEVEL_LINEAGE =
    'LINEAGE_LOOKER_FIELD_LEVEL_LINEAGE'
export const PREFERRED_TERMS = 'PREFERRED_TERMS'
export const ANTONYMS = 'ANTONYMS'
export const SYNONYMS = 'SYNONYMS'
export const TERM_ATTRIBUTES = 'TERM_ATTRIBUTES'

export const featureList = {
    insightsFeatures: [
        {
            name: 'Insights',
            key: INSIGHT_WORKSPACE_LEVEL_TAB,
            description: 'Enable/disable the Insights workspace for all users',
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
            previewIllustration: InsightsPreview,
        },
        {
            name: 'Schedule queries',
            key: INSIGHT_SCHEDULE_QUERY,
            description: 'Enable/disable Schedule Queries for all users',
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
            previewIllustration: ScheduledQueryPreview,
        },
        {
            name: 'Download data',
            key: INSIGHT_DATA_DOWNLOAD,
            description:
                'Ability to download and copy results of a query in insights',
            // if the config isn't present in tenant/user preferences, default value will be picked up from here
            defaultValue: true,
            // if feature needs a different feature to be active
            dependantFeatureKey: INSIGHT_WORKSPACE_LEVEL_TAB,
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
            releaseDate: null,
            isBeta: false,
            previewIllustration: DownloadDataPreview,
        },
    ],
    betaFeatures: [
        {
            name: 'Looker field level lineage',
            key: LINEAGE_LOOKER_FIELD_LEVEL_LINEAGE,
            description: 'Enable/disable looker field level lineage',
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
            previewIllustration: LookerFieldPreview,
        },
        {
            name: 'Term attributes',
            key: TERM_ATTRIBUTES,
            description:
                'Enable/disable Antonyms, Synonyms, Recommended Terms attributes for terms',
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
            previewIllustration: TermsAttributesPreview,
            type: 'checkbox',
            values: [
                {
                    name: 'Recommended Terms',
                    key: PREFERRED_TERMS,
                    description: 'Recommended terms in Glossary',
                    // if the config isn't present in tenant/user preferences, default value will be picked up from here
                    defaultValue: true,
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
                    isBeta: false,
                },
                {
                    name: 'Antonyms',
                    key: ANTONYMS,
                    description: 'Antonyms in Glossary',
                    // if the config isn't present in tenant/user preferences, default value will be picked up from here
                    defaultValue: true,
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
                    isBeta: false,
                },
                {
                    name: 'Synonyms',
                    key: SYNONYMS,
                    description: 'Synonyms in Glossary',
                    // if the config isn't present in tenant/user preferences, default value will be picked up from here
                    defaultValue: true,
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
                    isBeta: false,
                },
            ],
        },
    ],
}

export const showNewTagOnFeature = (feature) =>
    feature.releaseDate < Date.now() - showNewTagRangeMs

export const featureEnabledMap = computed(() => {
    const { tenantRaw } = useTenantData()
    const attributes = tenantRaw.value.attributes || {}
    const preferences = JSON.parse(attributes[orgPrefrencesKey] || '{}') || {}
    Object.values(featureList).forEach((features) => {
        features.forEach((feature) => {
            if (!(feature.key in preferences)) {
                if (feature?.type === 'checkbox') {
                    feature?.values?.forEach((el) => {
                        if (!(el.key in preferences))
                            preferences[el.key] = el.defaultValue
                    })
                }
                preferences[feature.key] = feature.defaultValue
            }
        })
    })

    console.log('featureEnabledMap preferences', preferences)
    return preferences
})
