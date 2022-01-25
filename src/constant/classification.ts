export const tabs = [
    {
        // tab name
        name: 'Overview',
        // tab icon
        iconClass: '',
        // component name in userPreview.vue
        component: 'Overview',
        // unique id for tab - the one that'll get passed from different components
        key: 'about',
        icon: 'Overview',
        tooltip: 'Overview',
        activeIcon: 'InfoActive',
    },
    {
        name: 'Linked Assets',
        iconClass: '',
        component: 'LinkedAssets',
        key: 'linkedAssets',
        icon: 'AssetsInactiveLight',
        tooltip: 'Assets',
        activeIcon: 'AssetsActiveLight',
    },
    {
        name: 'Purposes',
        iconClass: '',
        component: 'Purposes',
        key: 'purposes',
        icon: 'ClassificationPoliciesGray',
        tooltip: 'purposes',
        activeIcon: 'ClassificationPoliciesActive',
    },
]
