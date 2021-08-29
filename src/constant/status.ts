import { CheckboxArray } from '~/types'
import deprecated from '~/assets/images/status/deprecated.svg'
import issues from '~/assets/images/status/issues.svg'
import noStatus from '~/assets/images/status/nostatus.svg'
import verified from '~/assets/images/status/verified.svg'
import wip from '~/assets/images/status/work_in_progress.svg'

export const List: CheckboxArray = [
    {
        id: 'verified',
        label: 'Verified',
        description: 'Verified',
        icon: verified,
    },
    {
        id: 'draft',
        label: 'Draft',
        description: 'Draft',
        icon: wip,
    },
    {
        id: 'issue',
        label: 'Issue',
        description: 'Issue',
        icon: issues,
    },
    {
        id: 'deprecated',
        label: 'Deprecated',
        description: 'Deprecated',
        icon: deprecated,
    },
    {
        id: 'is_null',
        label: 'No Status',
        description: 'No Status',
        icon: noStatus,
    },
]
