/**
 *
 * @param word string
 * @returns string wth capital first letter
 */
export const capitalizeFirstLetter = (word: string) =>
    word?.charAt(0).toUpperCase() + word?.slice(1) || ''

/**
 *
 * @param sizeofSplit - Length of main/first array
 * @param arr - Array to spilt
 * @returns - (2, [l,m,n,o,p]) -> {a:[l,m], b:[n,o,p]}
 */
export const splitArray = (sizeofSplit: number, arr: any[]) => {
    if (sizeofSplit >= arr?.length) {
        return {
            a: [...arr],
            b: [],
        }
    }
    const a: any[] = arr.slice(0, sizeofSplit)
    const b: any[] = arr.slice(sizeofSplit, arr.length)
    return {
        a,
        b,
    }
}

/**
 *
 * @param arr - Array of words to be joined
 * @param wordCount - Max count allowed for the joined string
 * @returns [a,b,c] -> a, b and c OR a, b and <x> other(s)
 */
export const getTruncatedStringFromArray = (
    arr: string[],
    wordCount: number = 30
) => {
    const strSize: number[] = [0]
    let idx = 0
    arr.forEach((name) => {
        strSize.push(strSize[strSize.length - 1] + name.length)
    })

    // Check upto how long it is possible to display
    while (strSize[idx] < wordCount && idx < strSize.length) {
        idx += 1
    }
    // // Compenstion for the initial 0 in strSize
    idx -= 1

    /** The elements that would be displayed */
    const displayArray = arr.slice(0, idx)
    /** The elements that would be truncated as x other(s) */
    const truncated = arr.slice(idx)
    // Check if something needs to be truncated
    if (truncated.length && idx > 0) {
        // If there is only 1 element to be truncated then compare the
        // length of name and 'x others(s)'
        const lastElm =
            truncated.length === 1 &&
            truncated[0].length < `${truncated.length} other(s)`.length
                ? `${truncated[0]}`
                : `${truncated.length} other(s)`

        return `${displayArray.join(', ')} and ${lastElm}`
    }
    // first element being greater than the limit, truncate first element till limit and show # of others
    if (!displayArray.length && truncated.length) {
        // If there is only 1 element to be truncated then compare the
        // length of name and 'x others(s)'
        const others =
            truncated.length >= 2 ? `${truncated.length - 1} other(s)` : ``
        if (others)
            return `${truncated[0].slice(0, wordCount)}... and ${others}`
        return `${truncated[0].slice(0, wordCount)}...`
    }
    // Check if everything can be directly displayed
    // If so then take the last element from array, append it with 'and'
    const lastElm = displayArray.pop()
    return displayArray.length
        ? `${displayArray.join(', ')} and ${lastElm}`
        : `${lastElm}`
}

/**
 * If the string ends in a y, add an ies. If the string ends in a s, add an s. If the string ends in
 * anything else, add an s. If the count is greater than 1, add an s
 * @param {string} string - The string to be pluralized.
 * @param {number} count - The number of items.
 * @param {boolean} [includeCountInString=true] - If the result string should have the count ex- if string is asset -> 2 assets or assets
 * @returns The pluralized string.
 */
export const pluralizeString = (
    string: string,
    count: number,
    includeCountInString: boolean = true
) => {
    if (!string) return ''
    if (!count) return string

    const plural = { y: 'ies', s: 's' }
    const vowels = ['a', 'e', 'i', 'o', 'u']

    if (count > 1) {
        const lastLetter = string[string.length - 1]
        const secondTolastLetter = string[string.length - 2]
        const isVowel = (letter) => vowels.includes(letter)

        if (plural[lastLetter] && !isVowel(secondTolastLetter)) {
            const s = string.slice(0, string.length - 1)
            return `${includeCountInString ? count : ''} ${s}${
                plural[lastLetter]
            }`
        }
        return `${includeCountInString ? count : ''} ${string}s`
    }

    return `${includeCountInString ? count : ''} ${string}`
}

/**
 *
 * @param name - can be a sentence or a word or anything else needed in titleCase
 * @param delimiter - delimiter to split the string and each word of that would be capitalised, by default a space
 * @returns ex- harry potter -> Harry Potter
 */
export const getNameInTitleCase = (name: string, delimiter = ' ') => {
    if (name) {
        return name
            .split(delimiter)
            .map(
                (word) =>
                    `${word.charAt(0).toUpperCase()}${word
                        .substr(1)
                        .toLowerCase()}`
            )
            .join(' ')
    }
    return ''
}

/**
 *
 * @param name Name to get initials from
 * @returns ex- harry potter -> hp
 */
export const getNameInitials = (name: string) => {
    if (name) {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
    }
    return ''
}

export const getValidStringUsingCount = (count: number, str: string) => {
    if (count === 0) return ''
    return str
}

export const truncate = (string, len) => {
    const myTruncatedString = string.substring(0, len)
    return `${myTruncatedString}...`
}
