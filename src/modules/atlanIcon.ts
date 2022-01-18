import { UserModule } from '~/types/vitessg'
import AtlanIcon from '~/components/common/icon/atlanIcon.vue'
import AtlanLoader from '~/components/common/loaders/atlanLoader.vue'

export const install: UserModule = ({ app }) => {
    app.component('AtlanIcon', AtlanIcon)
    app.component('AtlanLoader', AtlanLoader)
}
