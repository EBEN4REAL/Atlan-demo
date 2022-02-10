// @return host.com
export const getDomain = (url: string) => {
    const withProtocol = url.startsWith('http') ? url : `https://${url}`
    try {
        const { host } = new URL(withProtocol)

        const url =
            host.split('.').length > 2 || host.startsWith('www')
                ? host.split('.').slice(1).join('.')
                : host

        if (url.startsWith('atlan', 0)) {
            return 'atlan.com'
        }
        return url
    } catch {
        return url
    }
}
