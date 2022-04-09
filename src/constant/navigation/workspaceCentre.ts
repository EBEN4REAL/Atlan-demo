/* eslint-disable import/prefer-default-export */
import page from '~/constant/accessControl/page'

export const workspaceCentreList = [
    {
        path: '/workflows',
        icon: 'WorkflowsActive',
        label: 'Workflow',
        isActive: true,
        auth: page.PAGE_ADMIN,
        inactiveIcon: 'WorkflowsInactive',
        description: ' Set up, run, and monitor your workflows',
        activeBackground: '#D7FCDF',
    },
    {
        path: '/governance',
        icon: 'GovernanceCenter',
        label: 'Governance',
        description: 'Set up and manage access for all data and metadata',
        isActive: true,
        auth: page.PAGE_GOVERNANCE,
    },
    {
        path: '/admin',
        icon: 'Admin',
        label: 'Admin',
        description:
            'Manage users and groups, API keys, integrations, and more',
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
