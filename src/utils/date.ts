/**
 *
 * @param date date timestamp
 * @returns human readable date string without time eg.
 */
export const formatDate = (date: string | number | Date) => new Date(date).toLocaleDateString()

export const formatDateTime = (
    date: any,
    config = {
        dateStyle: 'medium',
        timeStyle: 'medium',
    },
    locale = 'en-US',
    isUnixTimestamp = false
) => {
    if (!date) {
        return
    }
    console.log('formatDateTime', { date })
    if (isUnixTimestamp) {
        date = Number(date)
    }
    let formattedDate = ''
    try {
        if ((typeof date === 'string' || typeof date === 'number') && date) {
            formattedDate = new Intl.DateTimeFormat(locale, config).format(
                new Date(date)
            )
            console.log('formatDateTime', { formattedDate })
            // formattedDate = new Date(date)
        } else {
            // formattedDate = new Intl.DateTimeFormat(locale, config).format(date)
            formattedDate = date
        }
    } catch (error) {
        console.error(error)
    }
    return formattedDate
}
/**
 *
 * @param dateString : time ago string ex - 1 hour ago
 * @returns time ago string with shortened time-unit ex - 1h ago
 */
export const getShortNotationDateTimeAgo = (dateString) => {
    const timeUnitStrings = [
        'sec',
        'min',
        'hour',
        'day',
        'week',
        'month',
        'year',
    ]
    const dateTimeStringFragments = dateString.split(' ')
    const timeFragmentIndex = dateTimeStringFragments.findIndex((s) =>
        timeUnitStrings.some((ts) => s.includes(ts))
    )
    const timeFragment = dateTimeStringFragments.find((s) =>
        timeUnitStrings.some((ts) => s.includes(ts))
    )
    const timeMagnitude = dateTimeStringFragments[0]
    let timeFragmentShortNotation = ''
    if (timeFragmentIndex && timeFragment) {
        timeFragmentShortNotation = timeFragment?.includes('month')
            ? dateTimeStringFragments[timeFragmentIndex].substring(0, 2) // mo for months, m for mins
            : dateTimeStringFragments[timeFragmentIndex].substring(0, 1)

        return `${timeMagnitude}${timeFragmentShortNotation} ${dateTimeStringFragments[2]}`
    }
    return dateString
}
/**
 *
 * @param date_future date_now  date timestamp
 * @returns human readable difference between two days
 */
export function timeDiffCalc(date_future, date_now) {
    // get total seconds between the times
    let delta = Math.abs(date_future - date_now) / 1000

    // calculate (and subtract) whole days
    const days = Math.floor(delta / 86400)
    delta -= days * 86400

    // calculate (and subtract) whole hours
    const hours = Math.floor(delta / 3600) % 24
    delta -= hours * 3600

    // calculate (and subtract) whole minutes
    const minutes = Math.floor(delta / 60) % 60
    delta -= minutes * 60

    // what's left is seconds
    const seconds = delta % 60

    let string = ''

    if (days && hours && minutes && seconds)
        string = `${days}d ${hours}h ${minutes}m ${seconds}s`
    else if (hours && minutes && seconds)
        string = `${hours}h ${minutes}m ${seconds}s`
    else string = `${minutes}m ${seconds}s`

    return string
}
