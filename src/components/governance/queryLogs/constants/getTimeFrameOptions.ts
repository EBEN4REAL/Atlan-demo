import dayjs from 'dayjs'
export function getTimeframeOptions() {
    return [
        {
            label: 'last 30 days',
            value: '30 days',
            ISOVal: [
                dayjs(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).format(),
                dayjs().format(),
            ],
        },
        {
            label: 'last 6 months',
            value: '6 months',
            ISOVal: [
                dayjs(new Date().setMonth(new Date().getMonth() - 6)).format(),
                dayjs().format(),
            ],
        },
        {
            label: 'last 3 months',
            value: '3 months',
            ISOVal: [
                dayjs(new Date().setMonth(new Date().getMonth() - 3)).format(),
                dayjs().format(),
            ],
        },
        {
            label: 'last 7 days',
            value: '7 days',
            ISOVal: [
                dayjs(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).format(),
                dayjs().format(),
            ],
        },
    ]
}
