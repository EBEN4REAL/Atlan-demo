import { State } from './state'

export interface Actions extends State {
    setList(value: any): void
    updatePurpose(purpose: any): void
    removePurpose(purpose: any): void
    setErrorPurpose(purpose: any): void
}

export const actions: Actions = {
    setErrorPurpose(value) {
        this.errorPurpose = value
    },
    setList(value) {
        this.list = value
    },
    updatePurpose(purpose) {
        if(!this.list){
            return this.list = [purpose]
        }
        const index = this.list.findIndex((p) => p.id === purpose.id)
        if (index > -1)
            this.list[index] = purpose
        else this.list.push(purpose)
    },
    removePurpose(_id) {
        this.list = this.list.filter((p) => p.id !== _id)
    }
}
