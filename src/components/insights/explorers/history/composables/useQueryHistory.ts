import dayjs from 'dayjs'

export const historyState = [
    {
        key: 0,
        title: 'Today',
        date: dayjs().format('MMMM D, YYYY'),
        startDate: dayjs(new Date(Date.now())).startOf('day').format(),
        endDate: dayjs(new Date(Date.now())).endOf('day').format(),
    },
    {
        key: 1,
        title: 'Yesterday',
        date: dayjs(Date.now() - 24 * 60 * 60 * 1000).format('MMMM D, YYYY'),
        startDate: dayjs(new Date(Date.now() - 24 * 60 * 60 * 1000))
            .startOf('day')
            .format(),
        endDate: dayjs(new Date(Date.now() - 24 * 60 * 60 * 1000))
            .endOf('day')
            .format(),
    },
    {
        key: 2,
        title: 'Older',
        date: '',
        startDate: dayjs(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
            .startOf('day')
            .format(),
        endDate: dayjs(new Date(Date.now() - 48 * 60 * 60 * 1000))
            .endOf('day')
            .format(),
    },
]
