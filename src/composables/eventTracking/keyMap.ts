const keyMap = {
    discovery: {
        filter: {
            changed: {
                action: 'discovery_filter_changed',
                properties: (props) => ({
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
                properties: (props) => ({ click_index: props.click_index }),
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
        },
        announcement: {
            created: {
                action: 'discovery_announcement_created',
                properties: (props) => ({
                    announcement_type: props.announcement_type,
                }),
            },
            updated: {
                action: 'discovery_announcement_updated',
                properties: (props) => ({
                    announcement_type: props.announcement_type,
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
        saved_search: {
            deleted: {
                action: 'discovery_saved_search_deleted',
                properties: (props) => ({ facets: props.facets }),
            },
            clicked: {
                action: 'discovery_saved_search_clicked',
                properties: (props) => ({ facets: props.facets }),
            },
            updated: {
                action: 'discovery_saved_search_updated',
                properties: (props) => ({ facets: props.facets }),
            },
            created: {
                action: 'discovery_saved_search_created',
                properties: (props) => ({ facets: props.facets }),
            },
        },
    },
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
            run: {
                action: 'insights_query_run',
                properties: (props) => ({
                    saved_query: !!props?.saved_query,
                    visual_query: !!props?.visual_query,
                    limit_100: !!props.limit_100,
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
            },
            deleted: {
                action: 'governance_persona_deleted',
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
        },
        purpose: {
            created: {
                action: 'governance_purpose_created',
            },
            deleted: {
                action: 'governance_purpose_deleted',
            },
            policy_added: {
                action: 'governance_purpose_policy_added',
                properties: (props) => ({
                    type: props?.type,
                    masking: props.masking,
                    denied: !!props.denied,
                    user_count: props.user_count,
                    group_count: props.group_count,
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
                }),
            },
            policy_deleted: {
                action: 'governance_purpose_policy_deleted',
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
            },
            updated: {
                action: 'governance_custom_metadata_updated',
            },
            deleted: {
                action: 'governance_custom_metadata_deleted',
            },
            property_added: {
                action: 'governance_custom_metadata_property_added',
                properties: (props) => ({
                    data_type: props.data_type,
                    multi_value: !!props.multi_value,
                    allow_filtering: !!props.allow_filtering,
                }),
            },
            property_updated: {
                action: 'governance_custom_metadata_property_updated',
                properties: (props) => ({
                    data_type: props.data_type,
                    multi_value: !!props.multi_value,
                    allow_filtering: !!props.allow_filtering,
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
            resolved: {
                action: 'governance_requests_resolved',
                properties: (props) => ({
                    // approve/decline
                    action: props.action,
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
    },
}
export default keyMap
