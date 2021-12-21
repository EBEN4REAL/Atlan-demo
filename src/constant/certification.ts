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
        value: 'VERIFIED',
    },
    {
        id: 'DRAFT',
        label: 'Draft',
        description: 'Draft',
        icon: draft,
        value: 'DRAFT',
    },
    {
        id: 'DEPRECATED',
        label: 'Deprecated',
        description: 'Deprecated',
        icon: deprecated,
        value: 'DEPRECATED',
    },
    {
        id: 'NONE',
        label: 'No certificate',
        description: 'Deprecated',
        icon: noStatus,
        value: null,
    },
]
