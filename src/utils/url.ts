// @return host.com
export const getDomain = (url) => {
    try {
        const { host } = new URL(url)
        return host.split('.').slice(1).join('.')
    } catch {
        return url
    }
}
