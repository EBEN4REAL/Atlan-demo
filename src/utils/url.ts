// @return host.com
export const getDomain = (url: string) => {
    const withProtocol = url.startsWith('http') ? url : `https://${url}`
    try {
        const { hostname } = new URL(withProtocol)

        const url =
            hostname.split('.').length > 2 || hostname.startsWith('www')
                ? hostname.split('.').slice(1).join('.')
                : hostname

        if (url.startsWith('atlan', 0)) {
            return 'atlan.com'
        }
        return url
    } catch {
        return url
    }
}
