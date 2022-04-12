import { useStorage } from '@vueuse/core'

export interface State {
    list: any[]
    errorPurpose: any 
}

export const state: State = {
    list: useStorage('purpose', []),
    errorPurpose: undefined
}
