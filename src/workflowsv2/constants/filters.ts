import dayjs from 'dayjs'

export const workflowFilter = [
    {
        id: 'creators',
        label: 'CREATED BY',
        component: 'Owners',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        propsToComponent: {
            showNone: false,
            hideDisabledTabs: true,
            enableTabs: ['users'],
        },
        // selectUserKey: 'id',
        class: 'bg-transparent',
    },
    {
        id: 'wfType',
        label: 'Workflow Type',
        component: 'CheckBoxOption',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        class: 'bg-transparent',
        data: [],
    },
    {
        id: 'schedule',
        label: 'Schedule',
        component: 'RadioButton',
        overallCondition: 'OR',
        attributes: [],
        isDeleted: false,
        isDisabled: false,
        exclude: false,
        class: 'bg-transparent',
        data: [
            {
                id: 'scheduled',
                label: 'Scheduled',
                icon: 'Schedule',
                iconClass: 'text-success',
            },
            {
                id: 'manual',
                label: 'Unscheduled',
                icon: 'Unscheduled',
            },
        ],
    },
]

export const runStatuses = [
    {
        value: 'Succeeded',
        label: 'Success',
        colorDot: '#00B28A',
    },
    {
        value: 'Running',
        label: 'Running',
        colorDot: '#F7B43D',
    },
    {
        value: ['Failed', 'Error'],
        label: 'Failed',
        colorDot: '#CC4747',
    },
    {
        value: 'Pending',
        label: 'Waiting',
        colorDot: '#6A7692',
    },
]

export const dateRanges = [
    {
        label: 'Today',
        value: { gt: dayjs().startOf('day').valueOf() },
        hint:
            'Runs created on/' +
            dayjs().startOf('day').format('D MMM YYYY [(GMT] Z[)]'),
    },
    {
        label: 'Yesterday',
        value: {
            lt: dayjs().startOf('day').valueOf(),
            gt: dayjs().startOf('day').subtract(1, 'day').valueOf(),
        },
        hint:
            'Runs created on/' +
            dayjs()
                .startOf('day')
                .subtract(1, 'day')
                .format('D MMM YYYY [(GMT] Z[)]'),
    },
    {
        label: 'Last 7D',
        value: {
            gt: dayjs().startOf('day').subtract(7, 'day').valueOf(),
        },
        hint:
            'Runs created since/' +
            dayjs()
                .startOf('day')
                .subtract(7, 'day')
                .format('D MMM YYYY [(GMT] Z[)]'),
    },
    {
        label: 'Last 30D',
        value: {
            gt: dayjs().startOf('day').subtract(30, 'day').valueOf(),
        },
        hint:
            'Runs created since/' +
            dayjs()
                .startOf('day')
                .subtract(30, 'day')
                .format('D MMM YYYY [(GMT] Z[)]'),
    },
    // { label: 'Custom' },
]
