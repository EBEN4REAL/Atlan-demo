export const assetActions = [
    {
        id: 'open',
        label: 'Open',
        description: 'Open asset profile',
        icon: 'EnterProfile',
    },
    {
        id: 'query',
        label: 'Query',
        description: 'Run a sample query',
        icon: 'Query',
        includes: [
            'Table',
            'View',
            'Column',
            'Query',
            'TablePartition',
            'MaterialisedView',
        ],
    },
]
