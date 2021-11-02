import { useStorage } from '@vueuse/core'
import { Glossary } from '~/types/glossary/glossary.interface'

export interface State {
    list: Glossary[]
}

export const state: State = {
    list: useStorage('glossary', []),
}
