export const userColumns = [
    {
        title: 'User',
        key: 'user',
        sorter: true,
        width: 320,
        slots: { customRender: 'name' },
        sortKey: 'first_name',
    },
    {
        title: 'Role',
        key: 'role',
        sorter: false,
        width: 150,
        slots: { customRender: 'role' },
        dataIndex: 'role_object.name',
    },
    {
        title: 'Groups',
        key: 'group',
        sorter: true,
        width: 150,
        slots: { customRender: 'group' },
        sortKey: 'group_count',
        dataIndex: 'group_count_string',
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
        width: 150,
    },
    {
        title: 'Actions',
        width: 120,
        slots: { customRender: 'actions' },
    },
]

export const statusColorCodes = {
    Active: '#DAEED4',
    Disabled: '#FADEE0',
    Invited: '#F8EED3',
}