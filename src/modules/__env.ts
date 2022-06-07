import { UserModule } from '~/types/vitessg'
// const debug = process.env.NODE_ENV !== "production";
const parse = function (value: any, fallback: any): any {
    if (typeof value === 'undefined') {
        return fallback
    }
    switch (typeof fallback) {
        case 'boolean':
            return !!JSON.parse(value)
        case 'number':
            return JSON.parse(value)
        default:
            return value
    }
}

export const getEnv = function (): any {
    const config = {
        DEFAULT_REQUEST_TIMEOUT: parse(
            import.meta.env.VITE_DEFAULT_REQUEST_TIMEOUT,
            30
        ),

        DEV_API_BASE_URL: parse(
            import.meta.env.VITE_DEV_API_BASE_URL,
            'default'
        ),
        DEFAULT_REALM: parse(import.meta.env.VITE_DEFAULT_REALM, 'default'),
        DEFAULT_CLIENT_ID: parse(
            import.meta.env.VITE_HOME_CLIENT_ID,
            'atlan-frontend'
        ),
        ANNOUNCEKIT_SECRET: parse(import.meta.env.VITE_ANNOUNCE_KIT_SECRET_TOKEN, '')
    }
    return config
}

export const getBasePath = function (): any {
    const env = import.meta.env.MODE
    const devBaseUrl = getEnv().DEV_API_BASE_URL
    switch (env) {
        case 'production':
            return `${window.location.origin}`
        case 'staging':
            return `${devBaseUrl}`
        default:
            return `${devBaseUrl}`
    }
}

// https://github.com/antfu/vite-plugin-pwa#automatic-reload-when-new-content-available
export const install: UserModule = ({ app }) => {
    const isDev = import.meta.env.MODE !== 'production'
    app.config.performance = isDev
    app.config.globalProperties.$atlanconfig = getEnv()
}
