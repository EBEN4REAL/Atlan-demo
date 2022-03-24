import { UserModule } from '~/types'
import Readme from '~/modules/readme/index.vue'

export const install: UserModule = ({ app }) => {
    app.component('AtlanReadme', Readme)
}
