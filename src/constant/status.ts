import { CheckboxArray } from '~/types'
import deprecated from '~/assets/images/status/deprecated.svg'
import noStatus from '~/assets/images/status/nostatus.svg'
import verified from '~/assets/images/status/verified.svg'
import wip from '~/assets/images/status/wip.svg'

export const List: CheckboxArray = [
    {
        id: 'VERIFIED',
        label: 'Verified',
        description: 'Verified',
        icon: verified,
    },
    {
        id: 'DRAFT',
        label: 'Draft',
        description: 'Draft',
        icon: wip,
    },
    {
        id: 'DEPRECATED',
        label: 'Deprecated',
        description: 'Deprecated',
        icon: deprecated,
    },
    {
        id: 'is_null',
        label: 'No Certification',
        description: 'No Status',
        icon: noStatus,
    },
]

export const ListForSidebar: CheckboxArray = [
    {
        id: 'VERIFIED',
        label: 'Verified',
        description: 'Verified',
        icon: verified,
    },
    {
        id: 'DRAFT',
        label: 'Draft',
        description: 'Draft',
        icon: wip,
    },
    {
        id: 'DEPRECATED',
        label: 'Deprecated',
        description: 'Deprecated',
        icon: deprecated,
    },

]
