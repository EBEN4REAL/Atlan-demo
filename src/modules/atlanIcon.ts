import { UserModule } from '~/types/vitessg'
import AtlanIcon from '~/components/common/icon/atlanIcon.vue'

export const install: UserModule = ({ app }) => {
    app.component('AtlanIcon', AtlanIcon)
}
