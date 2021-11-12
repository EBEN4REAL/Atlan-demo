import deprecated from '~/assets/images/status/deprecated.svg'
import verified from '~/assets/images/status/verified.svg'
import draft from '~/assets/images/status/draft.svg'
import noStatus from '~/assets/images/status/nostatus.svg'

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
        icon: draft,
    },
    {
        id: 'DEPRECATED',
        label: 'Deprecated',
        description: 'Deprecated',
        icon: deprecated,
    },
    {
        id: 'NONE',
        label: 'No certificate',
        description: 'Deprecated',
        icon: noStatus,
    },
]
