export const getCountString = (count: number, showZero = false) => {
    if (count === 0 || !count) return showZero ? '0' : '-'

    let countString = count.toLocaleString('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
    })

    if (count > 1000) return '' + countString
    return countString
}

export const getSizeString = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
