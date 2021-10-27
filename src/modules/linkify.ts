import linkify from 'vue-linkify'

import { UserModule } from '~/types'

export const install: UserModule = ({ app }) => {
    app.directive('linkified', linkify)
}
