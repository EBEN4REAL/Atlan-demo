import { UserModule } from '~/types/vitessg'
import Button from '@/UI/button.vue'

export const install: UserModule = ({ app }) => {
    app.component('AtlanButton', Button)
}
