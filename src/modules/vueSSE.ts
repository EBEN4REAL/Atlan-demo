import VueSSE from 'vue-sse'
import { UserModule } from '~/types'

export const install: UserModule = ({ app }) => {
    app.use(VueSSE, {
        polyfill: true,
        withCredentials: true,
    })
}
