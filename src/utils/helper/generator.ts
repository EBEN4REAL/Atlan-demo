import ShortUniqueId from 'short-unique-id'

export const generateUUID = () => {
    let d = new Date().getTime()
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        (c) => {
            const r = (d + Math.random() * 16) % 16 | 0
            d = Math.floor(d / 16)
            return (c === 'x' ? r : r & (0x3 | 0x8)).toString(16)
        }
    )
    return uuid
}

export const shortUUID = () => {
    const uid = new ShortUniqueId({ length: 10, dictionary: 'alpha_lower' })

    return uid()
}
