import { UserModule } from '~/types'
import Editor from '~/modules/editor/index.vue'

export const install: UserModule = ({ app }) => {
    app.component('AtlanEditor', Editor)
}
