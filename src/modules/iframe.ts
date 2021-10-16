import VueFriendlyIframe from 'vue-friendly-iframe'

import { UserModule } from '~/types/vitessg'

export const install: UserModule = ({ app }) => {
    app.use(VueFriendlyIframe)
}
