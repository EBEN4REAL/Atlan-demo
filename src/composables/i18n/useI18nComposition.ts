import { useI18n } from 'vue-i18n'
import { MessageSchema } from '~/locales/schema'

export function useI18nComposition() {
    const { t } = useI18n<{ message: MessageSchema }>({ useScope: 'global' })
    return { t }
}
