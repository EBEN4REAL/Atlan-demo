export function numFormatter(num: number, precesion: number = 1) {
    if (typeof num !== 'number') return num
    if (num > 999 && num < 1000000) {
        return (num / 1000).toFixed(precesion) + 'K' // convert to K for number from > 1000 < 1 million
    } else if (num > 1000000) {
        return (num / 1000000).toFixed(precesion) + 'M' // convert to M for number from > 1 million
    } else if (num < 900) {
        return num // if value < 1000, nothing to do
    }
}
