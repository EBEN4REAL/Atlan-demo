import { CheckboxArray } from '~/types'
import issues from '~/assets/images/status/issues.svg'
import information from '~/assets/images/status/information.svg'
import warning from '~/assets/images/status/warning.svg'

const AnnouncementList: CheckboxArray = [
    {
        id: 'information',
        label: 'Information',
        icon: information,
    },
    {
        id: 'issue',
        label: 'Issue',
        icon: issues,
    },
    {
        id: 'warning',
        label: 'Warning',
        icon: warning,
    },
]

export default AnnouncementList;