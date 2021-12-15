/* eslint-disable import/prefer-default-export */
import page from '~/constant/accessControl/page'

export const workspaceCentreList = [
    {
        path: '/governance',
        icon: 'GovernanceCenter',
        label: 'Governance Center',
        isActive: true,
        auth: page.PAGE_GOVERNANCE,
    },
    {
        path: '/admin',
        icon: 'Admin',
        label: 'Admin Center',
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
