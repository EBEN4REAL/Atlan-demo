// Helper functions to encode/decode unicode<->base64
// https://attacomsian.com/blog/javascript-base64-encode-decode

function encodeUnicode(str: string) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) =>
            String.fromCharCode('0x' + p1)
        )
    )
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/\=+$/, '')
}

function decodeUnicode(strm: string) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(strm))
}

export function serializeQuery(params: Record<string, any>) {
    try {
        const queryStr = JSON.stringify(params)
        return encodeUnicode(queryStr)
    } catch (error) {
        return ''
    }
}

export function decodeQuery(queryStr: string): Record<string, any> {
    try {
        return JSON.parse(decodeUnicode(queryStr))
    } catch (error) {
        return []
    }
}
