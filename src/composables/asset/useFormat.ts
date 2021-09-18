export const getCountString = (count: number) => {
    if (count === 0 || !count) return '0'

    let countString = count.toLocaleString('en-US', {
        notation: 'compact',
        compactDisplay: 'short',
    })

    if (count > 1000) return '~' + countString
    return countString
}
