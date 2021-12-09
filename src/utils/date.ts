/**
 *
 * @param date date timestamp
 * @returns human readable date string without time eg.
 */
export const formatDate = (date: string | number | Date) => {
    const d = new Date(date)
    let month = `${d.getMonth() + 1}`
    let day = `${d.getDate()}`
    const year = d.getFullYear()

    if (month.length < 2) month = `0${month}`
    if (day.length < 2) day = `0${day}`

    return [year, month, day].join('-')
}

export const formatDateTime = (
    date: any,
    config = {
        dateStyle: 'medium',
        timeStyle: 'medium',
    },
    locale = 'en-US'
) => {
    if (typeof date === 'string' && date)
        return new Intl.DateTimeFormat(locale, config).format(new Date(date))
    return new Intl.DateTimeFormat(locale, config).format(date)
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
