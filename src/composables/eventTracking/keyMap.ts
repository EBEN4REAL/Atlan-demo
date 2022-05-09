import {
    NAME_OF_EVENTS,
    README_TRIGGERS,
} from '~/modules/editor/analytics/useTrackEvent'

interface BLOCK_README_EVENT_INTERFACE {
    assetType: string
    blockType: NAME_OF_EVENTS
    trigger: README_TRIGGERS
    embedService?: string
}

interface BLOCK_README_EVENT_RETURN_INTERFACE {
    asset_type: string
    block_type: NAME_OF_EVENTS
    trigger: README_TRIGGERS
    embed_service?: string
}

interface FORMATTING_README_EVENT_INTERFACE {
    assetType: string
    markType: NAME_OF_EVENTS
    trigger: README_TRIGGERS
    alignment?: string
}

interface FORMATTING_README_EVENT_RETURN_INTERFACE {
    asset_type: string
    mark_type: NAME_OF_EVENTS
    trigger: README_TRIGGERS
    alignment?: string
}

interface EMBED_README_EVENT_INTERFACE {
    assetType: string
    application: string
    trigger: README_TRIGGERS
}

interface EMBED_README_EVENT_RETURN_INTERFACE {
    asset_type: string
    application: string
    trigger: README_TRIGGERS
}

const keyMap = {
    discovery: {
        filter: {
            changed: {
                action: 'discovery_filter_changed',
                properties: (props: {
                    type: string
                    property?: string
                    value?: string
                    operator?: string
                }) => ({
                    ...props,
                }),
            },
        },
        cta_action: {
            clicked: {
                action: 'discovery_cta_action_clicked',
                properties: (props: {
                    action:
                        | 'open_asset'
                        | 'vqb_query'
                        | 'sql_query'
                        | 'copy_link'
                        | 'open_in_source'
                    asset_type: string
                }) => ({
                    ...props,
                }),
            },
        },
        view_preference: {
            changed: {
                action: 'discovery_view_preference_changed',
                properties: (props: {
                    visible: boolean
                    preference: 'description' | 'terms' | 'classifications'
                }) => ({
                    ...props,
                }),
            },
        },
        global_context: {
            changed: {
                action: 'discovery_global_context_changed',
                properties: (props: {
                    type: 'persona' | 'purpose' | 'all_assets'
                }) => ({
                    type: props.type,
                }),
            },
        },
        aggregate_tab: {
            changed: {
                action: 'discovery_aggregate_tab_changed',
                properties: (props) => ({
                    name: props.name,
                }),
            },
        },
        asset_card: {
            clicked: {
                action: 'discovery_asset_card_clicked',
                properties: (props) => ({
                    click_index: props.click_index,
                    keyboard_shortcut: !!props.keyboard_shortcut,
                }),
            },
            // when someone clicks schema or database to set it as filter
            filter_context_changed: {
                action: 'discovery_asset_card_filter_context_changed',
                properties: (props) => ({
                    asset_type: props.asset_type,
                    hierarchy_type: props.hierarchy_type,
                }),
            },
        },
        asset_sidebar: {
            tab_changed: {
                action: 'discovery_asset_sidebar_tab_changed',
                properties: (props) => ({
                    asset_type: props.asset_type,
                    tab_name: props.tab_name,
                }),
            },
        },
        metadata: {
            name_updated: {
                action: 'discovery_metadata_name_updated',
                properties: (props) => ({
                    asset_type: props.asset_type,
                }),
            },
            description_updated: {
                action: 'discovery_metadata_description_updated',
                properties: (props) => ({
                    asset_type: props.asset_type,
                }),
            },
            classifications_updated: {
                action: 'discovery_metadata_classifications_updated',
                properties: (props) => ({
                    asset_type: props.asset_type,
                }),
            },
            certification_updated: {
                action: 'discovery_metadata_certification_updated',
                properties: (props) => ({
                    asset_type: props.asset_type,
                    certificate: props.certificate,
                    has_message: !!props.has_message,
                }),
            },
            query_config_updated: {
                action: 'discovery_metadata_query_config_updated',
                properties: (props) => ({
                    allow_query: props.allow_query,
                    row_limit: props.row_limit,
                    allow_query_preview: !!props.allow_query_preview,
                }),
            },
            owners_updated: {
                action: 'discovery_metadata_owners_updated',
                properties: (props) => ({
                    asset_type: props.asset_type,
                }),
            },
            admins_updated: {
                action: 'discovery_metadata_admins_updated',
                properties: (props) => ({
                    asset_type: props.asset_type,
                }),
            },
            terms_updated: {
                action: 'discovery_metadata_terms_updated',
                properties: (props) => ({
                    asset_type: props.asset_type,
                }),
            },
            categories_updated: {
                action: 'discovery_metadata_categories_updated',
                properties: (props) => ({
                    count: props.count,
                }),
            },
            related_terms_updated: {
                action: 'discovery_metadata_related_terms_updated',
                properties: (props) => ({
                    count: props.count,
                }),
            },
            suggestion_applied: {
                action: 'discovery_metadata_suggestion_applied',
                properties: (props) => ({
                    asset_type: props.asset_type,
                    suggestion_index: props.index,
                }),
            },
        },
        announcement: {
            created: {
                action: 'discovery_announcement_created',
                properties: (props) => ({
                    announcement_type: props.announcement_type,
                    asset_type: props.asset_type,
                }),
            },
            updated: {
                action: 'discovery_announcement_updated',
                properties: (props) => ({
                    announcement_type: props.announcement_type,
                    asset_type: props.asset_type,
                }),
            },
            deleted: {
                action: 'discovery_announcement_deleted',
            },
        },
        resource: {
            created: {
                action: 'discovery_resource_created',
                properties: (props) => ({
                    domain: props.domain,
                    asset_type: props.asset_type,
                }),
            },
            updated: {
                action: 'discovery_resource_updated',
                properties: (props) => ({
                    domain: props.domain,
                    asset_type: props.asset_type,
                }),
            },
            clicked: {
                action: 'discovery_resource_clicked',
                properties: (props) => ({
                    domain: props.domain,
                    asset_type: props.asset_type,
                }),
            },
            deleted: {
                action: 'discovery_resource_deleted',
            },
        },
        search: {
            changed: {
                action: 'discovery_search_changed',
            },
        },
        asset_profile: {
            navigated: {
                action: 'discovery_asset_profile_navigated',
                properties: (props) => ({ from: props.from }),
            },
        },
        bulk: {
            update: {
                action: 'discovery_bulk_updated',
                properties: (props) => ({
                    total_assets: props.total_assets,
                    num_owners: props.num_owners,
                    num_classifications: props.num_classifications,
                    num_terms: props.num_terms,
                }),
            },
        },
        readme: {
            updated: {
                action: 'discovery_readme_updated',
                properties: (props) => ({ asset_type: props.asset_type }),
            },
        },
        display_preference: {
            changed: {
                action: 'discovery_display_preference_changed',
                properties: (props: {
                    visible: boolean
                    preference: 'description' | 'terms' | 'classifications'
                }) => ({
                    ...props,
                }),
            },
        },
        sort: {
            changed: {
                action: 'discovery_sort_changed',
                properties: (props: { sort_type: string }) => ({
                    ...props,
                }),
            },
        },
    },
<<<<<<< HEAD
=======
    lineage: {
        search: {
            changed: {
                action: 'lineage_search_changed',
                properties: (props) => ({
                    result_count: props?.result_count,
                    search_query: props?.search_query
                }),
            },
        },
        search_result: {
            clicked: {
                action: 'lineage_search_result_clicked',
                properties: (props) => ({
                    click_index: props?.click_index,
                    result_count: props?.result_count,
                    asset_type: props?.asset_type,
                    connector: props?.connector,
                }),
            },
        },
    },
>>>>>>> eed8f12df (FEAT: Lineage Search Result Clicked Event)
    gtc: {
        term: {
            created: {
                action: 'gtc_term_created',
                properties: (props) => ({
                    create_more: !!props.create_more,
                }),
            },
            deleted: {
                action: 'gtc_term_deleted',
            },
            bulk_upload_initiated:{
                action: 'gtc_term_bulk_upload_initiated',
            }
        },
        category: {
            created: {
                action: 'gtc_category_created',
                properties: (props) => ({
                    create_more: !!props.create_more,
                }),
            },
            deleted: {
                action: 'gtc_category_deleted',
            },
        },
        glossary: {
            created: {
                action: 'gtc_glossary_created',
            },
            deleted: {
                action: 'gtc_glossary_deleted',
            },
        },
        tree: {
            searched: {
                action: 'gtc_tree_searched',
            },
            search_result_clicked: {
                action: 'gtc_tree_search_result_clicked',
            },
        },
    },
    insights: {
        query: {
            renamed: {
                action: 'insights_query_renamed',
            },
            deleted: {
                action: 'inights_query_deleted',
            },
            saved: {
                action: 'insights_query_saved',
                properties: (props) => ({
                    variables_count: props?.variables_count,
                    visual_query: !!props?.visual_query,
                }),
            },
            updated: {
                action: 'insights_query_updated',
                properties: (props) => ({
                    variables_count: props?.variables_count,
                    visual_query: !!props?.visual_query,
                }),
            },
            link_copied: {
                action: 'insights_query_link_copied',
            },
            panel_add: {
                action: 'insights_vqb_panel_add',
                properties: (props) => ({
                    panel_type: props?.panel_type,
                    panel_source: props?.panel_source,
                }),
            },
            run: {
                action: 'insights_query_run',
                properties: (props) => ({
                    saved_query: !!props?.saved_query,
                    visual_query: !!props?.visual_query,
                    limit_100: !!props.limit_100,
                }),
            },
        },
        schema_tree: {
            item_click: {
                action: 'insights_schema_explorer_tree_item_clicked',
                properties: (props) => ({
                    action: props?.action,
                    trigger: props?.trigger,
                    query_tab_id: props?.query_tab_id,
                    asset_type: props?.asset_type,
                }),
            },
        },
        results_panel: {
            cta_clicked: {
                action: 'insights_results_panel_cta_clicked',
                properties: (props) => ({
                    action: props.action,
                    query_tab_id: props?.query_tab_id,
                    is_full_screen: props?.is_full_screen,
                }),
            },
            tab_switched: {
                action: 'insights_results_panel_tab_switched',
                properties: (props) => ({
                    click_index: props?.click_index,
                    previous_index: props?.previous_index,
                    is_full_screen: props?.is_full_screen,
                }),
            },
        },
        preview_tabs: {
            closed: {
                action: 'insights_preview_tabs_closed',
                properties: (props) => ({
                    query_tab_id: props?.query_tab_id,
                    click_index: props?.click_index,
                }),
            },

            right_click_action: {
                action: 'insights_preview_tabs_right_click_action',
                properties: (props) => ({
                    action: props?.action,
                }),
            },
        },
        collection: {
            created: {
                action: 'insights_collection_created',
            },
        },
        folder: {
            renamed: {
                action: 'insights_folder_renamed',
            },
            created: {
                action: 'insights_folder_created',
            },
            deleted: {
                action: 'insights_folder_deleted',
            },
        },
        tab: {
            opened: {
                action: 'insights_tab_opened',
                properties: (props) => ({
                    visual_query: !!props?.visual_query,
                }),
            },
            closed: {
                action: 'insights_tab_closed',
            },
        },
    },
    governance: {
        persona: {
            created: {
                action: 'governance_persona_created',
                properties: (props) => ({
                    title: props.title,
                }),
            },
            deleted: {
                action: 'governance_persona_deleted',
                properties: (props) => ({
                    title: props.title,
                }),
            },
            policy_added: {
                action: 'governance_persona_policy_added',
                properties: (props) => ({
                    type: props?.type,
                    masking: props.masking,
                    denied: !!props.denied,
                    asset_count: props.asset_count,
                }),
            },
            policy_updated: {
                action: 'governance_persona_policy_updated',
                properties: (props) => ({
                    type: props?.type,
                    masking: props.masking,
                    denied: !!props.denied,
                    asset_count: props.asset_count,
                }),
            },
            policy_deleted: {
                action: 'governance_persona_policy_deleted',
            },
            readme_updated: {
                action: 'persona_readme_updated',
            },
            resource_created: {
                action: 'persona_resource_created',
                properties: (props) => ({
                    domain: props.domain,
                }),
            },
            resource_updated: {
                action: 'persona_resource_updated',
                properties: (props) => ({
                    domain: props.domain,
                }),
            },
            resource_deleted: {
                action: 'persona_resource_deleted',
            },
            cm_preferences: {
                action: 'persona_preferences_cm_toggled',
                properties: (props) => ({
                    state: props.state,
                }),
            },
            persona_enable: {
                action: 'governance_persona_enabled',
            },
            persona_disable: {
                action: 'governance_persona_disabled',
            },
        },
        purpose: {
            created: {
                action: 'governance_purpose_created',
                properties: (props) => ({
                    title: props.title,
                }),
            },
            deleted: {
                action: 'governance_purpose_deleted',
                properties: (props) => ({
                    title: props.title,
                }),
            },
            policy_added: {
                action: 'governance_purpose_policy_added',
                properties: (props) => ({
                    type: props?.type,
                    masking: props.masking,
                    denied: !!props.denied,
                    user_count: props.user_count,
                    group_count: props.group_count,
                    all_users_enabled: !!props.all_users_enabled,
                }),
            },
            policy_updated: {
                action: 'governance_purpose_policy_updated',
                properties: (props) => ({
                    type: props?.type,
                    masking: props.masking,
                    denied: !!props.denied,
                    user_count: props.user_count,
                    group_count: props.group_count,
                    all_users_enabled: !!props.all_users_enabled,
                }),
            },
            policy_deleted: {
                action: 'governance_purpose_policy_deleted',
            },
            readme_updated: {
                action: 'purpose_readme_updated',
            },
            resource_created: {
                action: 'purpose_resource_created',
                properties: (props) => ({
                    domain: props.domain,
                }),
            },
            resource_updated: {
                action: 'purpose_resource_updated',
                properties: (props) => ({
                    domain: props.domain,
                }),
            },
            resource_deleted: {
                action: 'purpose_resource_deleted',
            },
            purpose_enable: {
                action: 'governance_purpose_enabled',
            },
            purpose_disable: {
                action: 'governance_purpose_disabled',
            },
        },
        classification: {
            created: {
                action: 'governance_classification_created',
            },
            updated: {
                action: 'governance_classification_updated',
            },
            deleted: {
                action: 'governance_classification_deleted',
            },
        },
        custom_metadata: {
            created: {
                action: 'governance_custom_metadata_created',
                properties: (props) => ({
                    title: props.title,
                }),
            },
            updated: {
                action: 'governance_custom_metadata_updated',
                properties: (props) => ({
                    title: props.title,
                }),
            },
            deleted: {
                action: 'governance_custom_metadata_deleted',
                properties: (props) => ({
                    title: props.title,
                }),
            },
            property_added: {
                action: 'governance_custom_metadata_property_added',
                properties: (props) => ({
                    title: props.title,
                    data_type: props.data_type,
                    multi_value: !!props.multi_value,
                    allow_filtering: !!props.allow_filtering,
                    show_in_overview: !!props.show_in_overview,
                }),
            },
            property_updated: {
                action: 'governance_custom_metadata_property_updated',
                properties: (props) => ({
                    title: props.title,
                    data_type: props.data_type,
                    multi_value: !!props.multi_value,
                    allow_filtering: !!props.allow_filtering,
                    show_in_overview: !!props.show_in_overview,
                }),
            },
            property_reordered: {
                action: 'governance_custom_metadata_property_reordered',
            },
        },
        requests: {
            searched: {
                action: 'governance_requests_searched',
            },
            created: {
                action: 'governance_requests_created',
                properties: (props) => ({
                    request_type: props.request_type,
                    asset_type: props.asset_type,
                    count: props.count,
                    actions: props.action,
                }),
            },
            resolved: {
                action: 'governance_requests_resolved',
                properties: (props) => ({
                    // approve/decline
                    action: props.action,
                    request_type: props.request_type,
                    widget_type: props.widget_type,
                }),
            },
        },

        options: {
            created: {
                action: 'governance_options_created',
                properties: (props: { title: string }) => ({
                    ...props,
                }),
            },
            updated: {
                action: 'governance_options_updated',
                properties: (props: { title: string }) => ({
                    ...props,
                }),
            },
        },
    },
    admin: {
        api_key: {
            created: {
                action: 'admin_api_key_created',
                properties: (props) => ({
                    persona_count: props.persona_count,
                }),
            },
            updated: {
                action: 'admin_api_key_updated',
                properties: (props) => ({
                    persona_count: props.persona_count,
                }),
            },
            deleted: {
                action: 'admin_api_key_deleted',
            },
        },
        integration: {
            added: {
                action: 'admin_integration_added',
                properties: (props: {
                    integration: string
                    level: string
                }) => ({
                    ...props,
                }),
            },
            removed: {
                action: 'admin_integration_removed',
                properties: (props: {
                    integration: string
                    level: string
                }) => ({
                    ...props,
                }),
            },
        },
        sso: {
            added: {
                action: 'admin_sso_added',
                properties: (props: { alias: string }) => ({
                    ...props,
                }),
            },
            updated: {
                action: 'admin_sso_updated',
                properties: (props: {
                    enforced_sso: boolean
                    enabled: boolean
                }) => ({
                    ...props,
                }),
            },
            removed: {
                action: 'admin_sso_removed',
                properties: (props: { alias: string }) => ({
                    ...props,
                }),
            },
        },
        user: {
            added: {
                // add invitation
                action: 'admin_user_added',
                properties: (props: { count: number }) => ({
                    ...props,
                }),
            },
            enabled: {
                // enable user
                action: 'admin_user_enabled',
            },
            removed: {
                // revoke invitation o disable users
                action: 'admin_user_removed',
                properties: (props: { status: string }) => ({
                    ...props,
                }),
            },
            // updated: {
            //     action: 'admin_user_updated',
            //     properties: (props: {
            //         action: 'enabled' | 'disabled' | 'groups_updated',
            //         groups_count?: number
            //     }) => ({
            //         ...props,
            //     }),
            // },
        },
        group: {
            created: {
                // create group
                action: 'admin_group_created',
                properties: (props: {
                    users_count: number
                    has_slack_channel_added: boolean
                    is_default: boolean
                    has_description: boolean
                }) => ({
                    ...props,
                }),
            },
            deleted: {
                action: 'admin_group_deleted',
            },
            updated: {
                action: 'admin_group_updated',
                properties: (props: {
                    users_count: number
                    has_slack_channel_added: boolean
                    is_default: boolean
                    has_description: boolean
                }) => ({
                    ...props,
                }),
            },
        },
        labs: {
            feature_enabled: {
                action: 'admin_labs_feature_enabled',
                properties: (props) => ({
                    feature: props.feature,
                }),
            },
            feature_disabled: {
                action: 'admin_labs_feature_disabled',
                properties: (props) => ({
                    feature: props.feature,
                }),
            },
        },
    },
    integration: {
        slack: {
            asset_shared: {
                action: 'integration_slack_asset_shared',
                properties: (props: {
                    asset_type: string
                    has_message: boolean
                }) => ({
                    ...props,
                }),
            },
            asset_question_posted: {
                action: 'integration_slack_asset_question_posted',
                properties: (props: { asset_type: string }) => ({
                    ...props,
                }),
            },
            message_cta_clicked: {
                action: 'integration_slack_message_cta_clicked',
                properties: (props: { type: string }) => ({
                    ...props,
                }),
            },
            share_channels_updated: {
                action: 'integration_slack_share_channels_updated',
                properties: (props: {
                    channel_count: string
                    workflow_alert_channel_present: boolean
                }) => ({
                    ...props,
                }),
            },
        },
        jira: {
            issue_created: {
                action: 'integration_jira_issue_created',
                properties: (props: {
                    asset_type: string
                    issue_type: boolean
                }) => ({
                    ...props,
                }),
            },
            issue_linked: {
                action: 'integration_jira_issue_linked',
                properties: (props: {
                    asset_type: string
                    selected_issue_count: number
                    total_issue_count: number
                }) => ({
                    ...props,
                }),
            },
            issue_link_opened: {
                action: 'integration_jira_issue_link_opened',
            },
            issue_unlinked: {
                action: 'integration_jira_issue_unlinked',
                properties: (props: { asset_type: string }) => ({
                    ...props,
                }),
            },
            issue_searched: {
                action: 'integration_jira_issue_searched',
                properties: (props: { asset_type: string }) => ({
                    ...props,
                }),
            },
            config_updated: {
                action: 'integration_jira_config_updated',
                properties: (props: { default_project_present: Boolean }) => ({
                    ...props,
                }),
            },
        },
    },
    readme: {
        block: {
            added: {
                action: 'readme_block_added',
                properties: ({
                    assetType,
                    blockType,
                    trigger,
                    embedService,
                }: BLOCK_README_EVENT_INTERFACE): BLOCK_README_EVENT_RETURN_INTERFACE => ({
                    asset_type: assetType,
                    block_type: blockType,
                    trigger,
                    ...(embedService && {
                        embed_service: embedService,
                    }),
                }),
            },
        },
        formatting: {
            added: {
                action: 'readme_formatting_added',
                properties: ({
                    assetType,
                    markType,
                    trigger,
                    alignment,
                }: FORMATTING_README_EVENT_INTERFACE): FORMATTING_README_EVENT_RETURN_INTERFACE => ({
                    asset_type: assetType,
                    mark_type: markType,
                    trigger,
                    ...(alignment && {
                        alignment,
                    }),
                }),
            },
        },
        embed: {
            added: {
                action: 'readme_embed_added',
                properties: ({
                    assetType,
                    application,
                    trigger,
                }: EMBED_README_EVENT_INTERFACE): EMBED_README_EVENT_RETURN_INTERFACE => ({
                    asset_type: assetType,
                    application,
                    trigger,
                }),
            },
            open_cta_clicked: {
                action: 'readme_embed_open_cta_clicked',
                properties: ({
                    assetType,
                    application,
                    trigger,
                }: EMBED_README_EVENT_INTERFACE): EMBED_README_EVENT_RETURN_INTERFACE => ({
                    asset_type: assetType,
                    application,
                    trigger,
                }),
            },
        },
    },
}
export default keyMap
