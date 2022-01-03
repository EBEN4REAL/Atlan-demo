import { State } from './state'

export interface Actions extends State {
    setList(value: any): void
}

export const actions: Actions = {
    setList(value) {
        this.list = value
    },
}
