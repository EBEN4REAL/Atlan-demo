export const mergeArray = (
    aData: any[],
    bData: any[],
    keyA: string,
    keyB: string
) => {
    /*  const bDataMap = new Map(bData.map((o) => [o[keyB], o]))

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
    } */
    let merged = []

    for (let i = 0; i < bData.length; i++) {
        merged.push({
            ...bData[i],
            ...aData.find((itmInner) => itmInner[keyA] === bData[i][keyB]),
        })
    }

    return {
        matchingIdsResult: merged,
    }
}
/* Handles null,undefiend */
export const safeArray = (arr: any) => {
    if (arr === null) return []
    if (arr === undefined) return []
    return arr
}

export const findDuplicates = (arr) => {
    let mp = new Map()
    let n = arr.length
    let res: string[] = []
    for (let i = 0; i < n; i++) {
        if (mp.has(arr[i])) mp.set(arr[i], mp.get(arr[i]) + 1)
        else mp.set(arr[i], 1)
    }

    for (let i = 0; i < n; i++) {
        if (mp.get(arr[i]) > 1) {
            res.push(arr[i])
            mp.set(arr[i], 0)
        }
    }

    return res
}

export const isObject = (item) => {
    return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 */
export const mergeDeep = (target, ...sources) => {
    if (!sources.length) return target
    const source = sources.shift()

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} })
                mergeDeep(target[key], source[key])
            } else {
                Object.assign(target, { [key]: source[key] })
            }
        }
    }
    return mergeDeep(target, ...sources)
}
