import { State } from './state'

export interface Actions extends State {
    setList(value: any): void
    updatePurpose(purpose: any): void
    removePurpose(purpose: any): void
}

export const actions: Actions = {
    setList(value) {
        this.list = value
    },
    updatePurpose(purpose) {
        const index = this.list.findIndex((p) => p.id === purpose.id)
        if (index > -1)
            this.list[index] = purpose
        else this.list.push(purpose)
    },
    removePurpose(_id) {
        this.list.filter((p) => p.id !== _id)
    }
}
