import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import VueAxios from 'vue-axios'
import { UserModule } from '~/types/vitessg'
import { getEnv } from '~/modules/__env'

const authInterceptor = (app: any) => (config: AxiosRequestConfig) => {
    if (app.config.globalProperties.$keycloak?.token)
        config.headers.Authorization = `Bearer ${app.config.globalProperties.$keycloak?.token}
    `
    return config
}

export let axiosClient: AxiosInstance = null

const errorInterceptor = (error: any) => {
    // check if it's a server error
    if (!error.response) {
        return Promise.reject(error)
    }
    // all the other error responses
    switch (error.response.status) {
        case 400:
            console.error(error.response.status, error.message)
            break
        case 401: // authentication error, logout the user
            localStorage.removeItem('token')
            break
        default:
            console.error(error.response.status, error.message)
    }
    return Promise.reject(error)
}

// Interceptor for responses
const responseInterceptor = (response: any) =>
    // switch (response.status) {
    //   case 200:
    //     // yay!
    //     break;
    //   // any other cases
    //   default:
    //   // default case
    // }

    response.data
// export function getBasePath() {
//   const env = process.env.NODE_ENV;
//   const devBaseUrl = getEnv().DEV_API_BASE_URL;
//   switch (env) {
//     case "production":
//       return `${window.location.origin}/api`;
//     case "staging":
//       return `${devBaseUrl}/api`;
//     default:
//       return `${devBaseUrl}/api`;
//   }
// }

// https://github.com/antfu/vite-plugin-pwa#automatic-reload-when-new-content-available
export const install: UserModule = ({ app }) => {
    const cacheConfig = {
        enabledByDefault: false,
        cacheFlag: 'cache',
    }
    axiosClient = axios.create({
        baseURL: `/api`,
        timeout: getEnv().DEFAULT_REQUEST_TIMEOUT,
        timeoutErrorMessage: 'timeout',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    axiosClient.interceptors.request.use(authInterceptor(app))
    axiosClient.interceptors.response.use(responseInterceptor, errorInterceptor)

    app.config.globalProperties.$axios = axios
    app.use(VueAxios, axiosClient)
}
