import whoami from '~/composables/user/whoami'

interface componentConfig {
    isInternal?: Boolean
}

export default function ABInternal() {
    const { isInternalUser } = whoami()

    // If isInternal attribute is there and user is not internal return false else true
    const checkVisibility = (config: componentConfig) =>
        !(config.isInternal && !isInternalUser.value)

    return { checkVisibility }
}
