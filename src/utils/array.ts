export const mergeArray = (
    aData: any[],
    bData: any[],
    keyA: string,
    keyB: string
) => {
    const bDataMap = new Map(bData.map((o) => [o[keyB], o]))

    const [matchingIdsResult, unmatchingIdsResult] = aData.reduce(
        (r, o) => {
            if (bDataMap.has(o[keyA]))
                r[0].push(Object.assign({}, o, bDataMap.get(o[keyA])))
            else r[1].push(o)

            return r
        },
        [[], []]
    )

    return {
        matchingIdsResult,
        unmatchingIdsResult,
    }
}
/* Handles null,undefiend */
export const safeArray = (arr: any) => {
    if (arr === null) return []
    if (arr === undefined) return []
    return arr
}
