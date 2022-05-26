export const discoverySorting = [
    {
        id: 'default',
        label: 'Relevance',
    },
    // {
    //     id: 'popularityScore-desc',
    //     label: 'Popularity',
    // },
    {
        id: 'name.keyword-asc',
        label: 'Name',
        suffix: '(a-z)'
    },
    {
        id: 'name.keyword-desc',
        label: 'Name',
        suffix: '(z-a)'
    },
    {
        id: '__modificationTimestamp-desc',
        label: 'Last updated at Atlan',
        suffix: '(Newest)'
    },
    {
        id: '__modificationTimestamp-asc',
        label: 'Last updated at Atlan',
        suffix: '(Oldest)'
    },
    {
        id: 'sourceUpdatedAt-desc',
        label: 'Last updated at source',
        suffix: '(Newest)'
    },
    {
        id: 'sourceUpdatedAt-asc',
        label: 'Last updated at source',
        suffix: '(Oldest)'
    },
    
    
    // {
    //     id: '__modificationTimestamp-asc',
    //     label: 'Last updated ()',
    // },
    {
        id: 'order-asc',
        label: 'Order(Asc)',
        includes: ['Column', 'SalesforceField'],
    },
    {
        id: 'order-desc',
        label: 'Order(Desc)',
        includes: ['Column', 'SalesforceField'],
    },
]
