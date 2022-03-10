/* eslint-disable import/prefer-default-export */
import page from '~/constant/accessControl/page'

export const workspaceCentreList = [
    {
        path: '/workflows',
        icon: 'WorkflowsActive',
        label: 'Workflow Center',
        isActive: true,
        auth: page.PAGE_ADMIN,
        inactiveIcon: 'WorkflowsInactive',
        description: 'Setup, run & monitor workflow runs',
        activeBackground: '#D7FCDF',
    },
    {
        path: '/governance',
        icon: 'GovernanceCenter',
        label: 'Governance Center',
        description: 'Setup and manage access to data and metadata',
        isActive: true,
        auth: page.PAGE_GOVERNANCE,
    },
    {
        path: '/admin',
        icon: 'Admin',
        label: 'Admin Center',
        description:
            'Manage users & groups, API keys, integrating tools, and more',
        isActive: true,
        auth: page.PAGE_ADMIN,
    },

    // {
    //     path: '/platform',
    //     icon: 'Platform',
    //     label: 'Platform Center',
    //     isActive: true,
    //     auth: page.PAGE_PLATFORM,
    // },
    {
        path: '/reporting',
        icon: 'Admin',
        label: 'Reporting Center',
        isActive: false,
        auth: page.PAGE_PLATFORM,
    },
]
