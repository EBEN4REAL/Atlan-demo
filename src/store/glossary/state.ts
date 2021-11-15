import { useStorage } from '@vueuse/core'
import { assetInterface } from '~/types/assets/asset.interface'
import { Glossary } from '~/types/glossary/glossary.interface'

export interface State {
    list: Glossary[]
    selectedGlossary: assetInterface
    activeFacetTab: string[]
    activeFacet: any
    preferences: any
    activePostFacet: any
}

export const state: State = {
    list: useStorage('glossary', []),
    selectedGlossary: useStorage('glossary_selected', {}),
    activeFacetTab: useStorage('glossary_activeFacetTab', []),
    preferences: useStorage('glossary_preferences', {}),
    activeFacet: useStorage('glossary_activeFacet', {}),
    activePostFacet: useStorage('glossary_activePostFacet', {}),
}
