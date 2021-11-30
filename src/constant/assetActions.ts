export const assetActions = [
    {
        id: 'open',
        label: 'Open',
        description: 'Open asset profile',
        icon: 'Enter',
    },
    {
        id: 'query',
        label: 'Query',
        description: 'Run a sample query',
        icon: 'Query',
        includes: ['Table', 'View', 'Column', 'Query'],
    },
    {
        id: 'share',
        label: 'Share',
        description: 'Share asset link',
        icon: 'Share',
        component: 'ShareMenu'
    },
]
