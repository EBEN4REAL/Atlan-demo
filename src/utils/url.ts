// @return host.com
export const getDomain = (url: string) => {
    const withProtocol = url.startsWith('http') ? url : `https://${url}`
    try {
        const { host } = new URL(withProtocol)
        return host.split('.').length > 2 || host.startsWith('www') ? host.split('.').slice(1).join('.') : host
    } catch {
        return url
    }
}