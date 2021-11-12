import { useStorage } from '@vueuse/core'
import { assetInterface } from '~/types/assets/asset.interface'
import { Glossary } from '~/types/glossary/glossary.interface'

export interface State {
    list: Glossary[]
    selectedGlossary: assetInterface
}

export const state: State = {
    list: useStorage('glossary', []),
}
