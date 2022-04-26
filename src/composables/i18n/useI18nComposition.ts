import { useI18n } from 'vue-i18n'

export function useI18nComposition() {
    const { t } = useI18n({ useScope: 'global' })
    return { t }
}
