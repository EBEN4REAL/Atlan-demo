/**
 *
 * @param time @desc time in ms
 * @returns duration string in [ ms | s | m s | h m ]
 * @example 164717 -> 2m 44s
 */
export const getDurationStringFromMilliSec = (time) => {
    if (time) {
        if (time < 1000) return `${time}ms`
        if (time / 1000 < 60) return `${+(time / 1000).toFixed(2)}s`
        if (time / (1000 * 60) < 60)
            return `${Math.floor(time / (1000 * 60))}m ${Math.floor(
                (time / 1000) % 60
            )}s`
        return `${Math.floor(time / (1000 * 60 * 60))}h ${Math.floor(
            (time / (60 * 1000)) % 60
        )}m`
    }
    return ''
}
