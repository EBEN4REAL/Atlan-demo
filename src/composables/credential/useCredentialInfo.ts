import dayjs from 'dayjs'

export default function useCredentialInfo() {
    const host = (item) => item.host
    const port = (item) => item.port

    const name = (item) => item.name
    const authType = (item) => item.authType

    const updatedAt = (item: any, relative: any) => {
        if (relative) {
            return dayjs().from(item?.updatedAt, true)
        }
        return dayjs(item?.updatedAt).format('dddd MMMM D YYYY HH:mm:ss')
    }

    const updatedBy = (item) => item?.updatedBy || item.createdBy

    const connector = (item) => item?.connector

    return {
        host,
        port,
        name,
        authType,
        updatedAt,
        updatedBy,
        connector,
    }
}
