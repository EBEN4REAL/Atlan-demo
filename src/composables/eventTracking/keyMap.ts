const keyMap = {
    discovery: {
        facet: {
            changed: {
                action: 'discovery_facet_changed',
                properties: (props) => ({
                    filter_type: props.filter_type,
                    count: props.count,
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
    },
    gtc: {
        metadata: {
            description_updated: {
                action: 'gtc_metadata_description_updated',
            },
            classifications_updated: {
                action: 'gtc_metadata_classifications_updated',
            },
            certification_updated: {
                action: 'gtc_metadata_certification_updated',
            },
            owners_updated: {
                action: 'gtc_metadata_owners_updated',
            },
            terms_updated: {
                action: 'gtc_metadata_terms_updated',
            },
        },
    },
}
export default keyMap
