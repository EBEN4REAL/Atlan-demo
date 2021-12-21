export const allTabs = [
    {
        // tab name
        name: 'About',
        // tab icon
        iconClass: '',
        // component name in groupPreview.vue
        component: 'GroupAbout',
        // unique id for tab - the one that'll get passed from different components
        key: 'about',
        icon: 'Overview',
        tooltip: 'User Info',
        activeIcon: 'InfoActive',
    },
    {
        name: 'Assets',
        iconClass: '',
        component: 'Assets',
        key: 'assets',
        icon: 'AssetsInactiveLight',
        tooltip: 'Assets',
        activeIcon: 'AssetsActiveLight',
    },
    {
        name: 'Members',
        iconClass: '',
        component: 'Members',
        key: 'members',
        icon: 'UserLight',
        tooltip: 'Members',
        activeIcon: 'UserLightActive',
    },
]

export const columns = [
    {
        title: 'Group Name',
        key: 'name',
        sorter: true,
        ellipsis: true,
        width: 400,
        sortKey: 'alias',
        slots: { title: 'customTitle', customRender: 'name' },
    },
    {
        title: 'Members',
        dataIndex: 'memberCountString',
        key: 'memberCountString',
        sorter: true,
        ellipsis: true,
        width: 250,
        sortKey: 'userCount',
    },
    {
        title: 'Created By',
        width: 250,
        dataIndex: 'createdBy',
        key: 'createdBy',
    },
    {
        title: 'Actions',
        slots: { customRender: 'actions' },
    },
]
