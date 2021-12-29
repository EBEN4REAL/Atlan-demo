import { useStorage } from '@vueuse/core'

export interface State {
    list: any[]
}

export const state: State = {
    list: useStorage('persona', []),
}
