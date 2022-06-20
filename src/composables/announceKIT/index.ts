import whoami from '~/composables/user/whoami'

export const initAnnounceKit = async (
    target: string,
    widgetID: string,
    name: string
) => {
    const { username, email, userId } = whoami()
    const data = {
        id: userId.value,
        name: username.value,
        email: email.value,
    }

    if (window?.announcekit)
        window.announcekit.push({
            ...(name ? { name } : {}),
            widget: `https://announcekit.co/widgets/v2/${widgetID}`,
            selector: target,
            lang: 'en',
            user: {
                ...data,
            },
            data: {
                domain: window.location.hostname,
                username: username.value,
            },
        })
}
