import { createI18n } from 'vue-i18n'
import type { UserModule } from '~/types'
import { MessageSchema, messages } from '~/locales/schema'

export const install: UserModule = ({ app }) => {
    const i18n = createI18n<[MessageSchema], 'en'>({
        legacy: false,
        locale: 'en',
        fallbackLocale: 'en',
        globalInjection: true,
        messages,
    })

    app.use(i18n)
}
