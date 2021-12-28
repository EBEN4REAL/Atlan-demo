import { createI18n } from 'vue-i18n'
import type { UserModule } from '~/types'

// Import i18n resources
// https://vitejs.dev/guide/features.html#glob-import
//

const messages = Object.fromEntries(
    Object.entries(
        import.meta.globEager('../../locales/*.y(a)?ml'))
        .map(([key, value]) => {
            const json = key.endsWith('.json')
            return [key.slice(14, json ? -5 : -4), value.default]
        }),
)

export const install: UserModule = ({ app }) => {
    const i18n = createI18n({
        legacy: false,
        locale: 'en',
        messages,
    })

    app.use(i18n)
}
