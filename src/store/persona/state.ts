import { useStorage } from '@vueuse/core'

export interface State {
    list: any[]
    errorPersona: any
}

export const state: State = {
    list: useStorage('persona', []),
    errorPersona: undefined
}
