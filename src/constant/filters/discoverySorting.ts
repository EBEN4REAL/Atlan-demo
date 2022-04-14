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
        label: 'Name(a-z)',
    },
    {
        id: 'name.keyword-desc',
        label: 'Name(z-a)',
    },
    {
        id: '__modificationTimestamp-desc',
        label: 'Last updated on Atlan',
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
