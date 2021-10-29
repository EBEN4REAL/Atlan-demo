import deprecated from '~/assets/images/status/deprecated.svg'
import verified from '~/assets/images/status/verified.svg'
import wip from '~/assets/images/status/work_in_progress.svg'

export const certificateList = [
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
