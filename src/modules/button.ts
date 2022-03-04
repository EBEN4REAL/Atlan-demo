import { UserModule } from '~/types/vitessg'
import Button from '@/UI/button.vue'
import Button2 from '@/UI/button2.vue'
import IconButton from '@/UI/iconButton.vue'

export const install: UserModule = ({ app }) => {
    app.component('AtlanButton', Button)
    app.component('AtlanButton2', Button2)
    app.component('IconButton', IconButton)
}
