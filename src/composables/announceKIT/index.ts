import whoami from '~/composables/user/whoami'
import { signJWT } from '~/modules/jose'
import { getEnv } from '~/modules/__env'

export const initAnnounceKit = async (target: string, widgetID: string) => {
    const { username, email, userId } = whoami()
    const data = {
        id: userId.value,
        name: username.value,
        email: email.value,
    }
    const user_token = await signJWT({
        data,
        secretKey: getEnv().ANNOUNCEKIT_SECRET,
        algorithm: 'HS256',
        expirationTime: '24h',
    })

    if (window?.announcekit)
        window.announcekit.push({
            widget: `https://announcekit.co/widgets/v2/${widgetID}`,
            selector: target,
            lang: 'en',
            user_token,
            data: {
                domain: window.location.hostname,
                username: username.value,
            },
        })
}