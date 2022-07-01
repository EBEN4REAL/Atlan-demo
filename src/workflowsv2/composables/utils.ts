import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import isYesterday from 'dayjs/plugin/isYesterday'

dayjs.extend(isToday)
dayjs.extend(isYesterday)

export const findIntervalByDate = (
    gt: number,
    lt = Date.now(),
    long = false
) => {
    if (gt) {
        const days = Math.round((lt - gt) / (1000 * 60 * 60 * 24)) // ms * seconds * minutes * hours
        if (days < 3) return long ? 'Hourly' : '1h'
        if (days < 20) return long ? 'Daily' : '1d'
        return long ? 'Weekly' : '1w'
    }
    return '1d'
}

export const getIntervalString = (gt: number, lt: number) => {
    if (!gt && !lt) return 'All Time'

    const interval = findIntervalByDate(gt, lt, true)

    const relative = !lt // if there is no less than date, treat it as if starts from today
    const days = Math.round((lt || Date.now() - gt) / (1000 * 60 * 60 * 24)) // ms * seconds * minutes * hours

    // if (dayjs(gt).isToday()) return 'Today'
    // if (dayjs(gt).isYesterday() && dayjs(lt).isToday()) return 'Yesterday'
    if (days === 1) return `Last 24 Hours`
    if (relative) return `Last ${days} days (${interval})`
}

export const getFilterText = (filters: Record<string, any>) => {
    let filterStr = ''
    if (filters?.dateRange) {
        filterStr += getIntervalString(
            filters?.dateRange?.gt,
            filters?.dateRange?.lt
        )
    }
    return filterStr
}

export const moustacheInterpolator = (
    query: string,
    variables: Record<string, any>
) => {
    let q = query.slice()
    q.replaceAll(/[ ,;)(]+/gm, ' ')
    const matches = q.match(/{{\s*[\w\.\-]+\s*}}/gm) ?? []
    matches.map((x) => {
        q = q.replace(x, (a) => {
            console.log(a)
            const temp = a.match(/[\w\.\-]+/)[0]
            const splits = temp.split('.')
            if (splits.length > 1) {
                return moustacheInterpolator(
                    `{{${splits.slice(1)}}}`,
                    variables[splits[0]]
                )
            }
            return variables[temp]
        })
    })
    if (/{{\s*[\w\.]+\s*}}/gm.test(q)) {
        return moustacheInterpolator(q, variables)
    }
    return q
}

// const parseVariables = {
//     var1: { bcdf: 'hello' },
//     var2: 'value2',
// }
// const q = 'textsdsd , {{var1.bcdf}}.{{var2}}'

// console.log(moustacheInterpolator(q, parseVariables))
