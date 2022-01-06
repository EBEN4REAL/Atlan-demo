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
        title: 'Group',
        key: 'name',
        ellipsis: true,
        width: 250,
        sortKey: 'alias',
        dataIndex: 'name',
        align: 'left',
        ascOrderString: `Sort by name (A-Z)`,
        descOrderString: `Sort by name (Z-A)`,
        sorter: true,
        // HACK TO HIDE ANTD SORT ICONS -> refer https://github.com/ant-design/ant-design/issues/11246#issuecomment-869556659 👇
        sortDirections: ['ASC', 'DESC'],
        fixed: 'left',
        // slots: { title: 'customTitle', customRender: 'name' },
    },
    {
        title: 'Members',
        dataIndex: 'memberCount',
        key: 'memberCount',
        ellipsis: true,
        width: 250,
        sortKey: 'userCount',
        align: 'left',
        sorter: true,
        sortDirections: ['ASC', 'DESC'],
    },
    // {
    //     title: 'Personas',
    //     dataIndex: 'personaCount',
    //     key: 'personaCount',
    //     sorter: false,
    //     ellipsis: true,
    //     width: 250,
    //     sortKey: 'personaCount',
    //     sorter: true,
    //     sortDirections: ['ASC', 'DESC'],
    //     align: 'right',
    // },
    {
        title: 'Created By',
        width: 250,
        dataIndex: 'createdBy',
        key: 'createdBy',
        align: 'left',
    },
    {
        title: '',
        key: 'actions',
        // slots: { customRender: 'actions' },
        align: 'right',
    },
]
