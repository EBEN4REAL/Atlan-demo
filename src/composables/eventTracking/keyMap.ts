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
            description_updated: {
                action: 'discovery_metadata_description_updated',
            },
            classifications_updated: {
                action: 'discovery_metadata_classifications_updated',
            },
            certification_updated: {
                action: 'discovery_metadata_certification_updated',
            },
            owners_updated: {
                action: 'discovery_metadata_owners_updated',
            },
            terms_updated: {
                action: 'discovery_metadata_terms_updated',
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
        metadata: {
            description_updated: {
                action: 'gtc_metadata_description_updated',
                properties: (props) => ({ gtc_type: props?.gtc_type }),
            },
            certification_updated: {
                action: 'gtc_metadata_certification_updated',
                properties: (props) => ({ gtc_type: props?.gtc_type }),
            },
            owners_updated: {
                action: 'gtc_metadata_owners_updated',
                properties: (props) => ({ gtc_type: props?.gtc_type }),
            },
            classifications_updated: {
                action: 'gtc_metadata_classifications_updated',
                properties: (props) => ({ gtc_type: props?.gtc_type }),
            },
        },
        term: {
            created: {
                action: 'gtc_term_created',
            },
        },
        category: {
            created: {
                action: 'gtc_category_created',
            },
        },
        glossary: {
            created: {
                action: 'gtc_glossary_created',
            },
        },
        tree: {
            searched: {
                action: 'gtc_tree_searched',
            },
        },
        tree_search_result: {
            action: 'gtc_search_result_clicked',
        },
    },
    insights: {
        query: {
            // query made public/private
            space_changed: {
                action: 'insights_query_space_changed',
                properties: (props) => ({ finalSpace: props?.finalSPace }),
            },
            deleted: {
                action: 'inights_query_deleted',
            },
            saved: {
                action: 'insights_query_saved',
                properties: (props) => ({
                    variables_count: props?.variables_count,
                }),
            },
            updated: {
                action: 'insights_query_updated',
                properties: (props) => ({
                    variables_count: props?.variables_count,
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
        folder: {
            renamed: {
                action: 'insights_folder_renamed',
            },
            // folder made public/private
            space_changed: {
                action: 'insights_folder_space_changed',
                properties: (props) => ({ finalSpace: props?.finalSPace }),
            },
            created: {
                action: 'insights_folder_created',
            },
            deleted: {
                action: 'insights_folder_deleted',
            },
        },
    },
}
export default keyMap
