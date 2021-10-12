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
    },
}
export default keyMap
