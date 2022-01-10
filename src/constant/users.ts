export const allTabs = [
    {
        // tab name
        name: 'About',
        // tab icon
        iconClass: '',
        // component name in userPreview.vue
        component: 'UserAbout',
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
        name: 'Groups',
        iconClass: '',
        component: 'Groups',
        key: 'groups',
        icon: 'GroupLight',
        tooltip: 'Groups',
        activeIcon: 'GroupActive',
    },
    {
        name: 'Sessions',
        iconClass: '',
        component: 'Sessions',
        key: 'sessions',
        icon: 'Hourglass',
        tooltip: 'Sessions',
        activeIcon: 'HourglassActive',
    },
    // {
    //     name: 'Access Logs',
    //     iconClass: '',
    //     component: 'AccessLogs',
    //     key: 'accessLogs',
    //     icon: 'AccessLogs',
    //     tooltip: 'Access Logs',
    //     activeIcon: 'AccessLogsActive',
    // },
]

export const userColumns = [
    {
        title: 'User',
        key: 'user',
        // sorter: true,
        slots: { customRender: 'name' },
        sortKey: 'firstName',
        align: 'left',
        width: '30%',
        sortDirections: ['ASC', 'DESC'],
        ascOrderString: `Sort by name (A-Z)`,
        descOrderString: `Sort by name (Z-A)`,
        sorter: true,
        fixed: 'left',
    },
    {
        title: 'Role',
        key: 'role',
        sorter: false,
        slots: { customRender: 'role' },
        // dataIndex: ['role_object', 'name'],
        width: '15%',
    },
    {
        title: 'Status',
        key: 'status',
        slots: { customRender: 'status' },
        // dataIndex: "status_object.status",
        // filters: [
        //   { text: "Active", value: JSON.stringify({ enabled: true }) },
        //   { text: "Disabled", value: JSON.stringify({ enabled: false }) },
        //   // { text: "Locked", value: JSON.stringify({ locked: true }) },
        // ],
        filterMultiple: false,
        width: '15%',
    },
    {
        title: 'Groups',
        key: 'group',
        sorter: true,
        align: 'left',
        slots: { customRender: 'group' },
        sortKey: 'groupCount',
        sortDirections: ['ASC', 'DESC'],
        ascOrderString: `Sort by group count`,
        descOrderString: `Sort by group count`,
        // dataIndex: 'group_count_string',
        width: '15%',
    },
    {
        title: 'Personas',
        key: 'personas',
        // sorter: true,
        align: 'left',
        slots: { customRender: 'persona' },
        width: '15%',
    },
    {
        title: '',
        slots: { customRender: 'actions' },
        align: 'right',
        width: '15%',
    },
]

export const statusColorClass = {
    Active: 'success',
    Disabled: 'error',
    Invited: 'alert',
}

export const userStatusOptions = [
    {
        label: 'Active',
        value: JSON.stringify({ enabled: true, emailVerified: true }),
    },
    { label: 'Disabled', value: JSON.stringify({ enabled: false }) },
    {
        label: 'Invited',
        value: JSON.stringify({ enabled: true, emailVerified: false }),
    },
]

export const roleOptions = [
    {
        label: 'Members',
        value: JSON.stringify({ roles: { $elemMatch: '$member' } }),
    },
    {
        label: 'Admin',
        value: JSON.stringify({ roles: { $elemMatch: '$admin' } }),
    },
    {
        label: 'Guest',
        value: JSON.stringify({ roles: { $elemMatch: '$guest' } }),
    },
]

export const allRoles = {
    member: {
        value: '',
        role: 'member',
        label: 'Member',
    },
    admin: {
        value: '',
        role: 'admin',
        label: 'Admin',
    },
    guest: {
        value: '',
        role: 'guest',
        label: 'Guest',
    },
}
