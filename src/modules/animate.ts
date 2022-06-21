import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { UserModule } from '~/types/vitessg'

export const install: UserModule = ({ app }) => {
    app.use(autoAnimatePlugin)
}
