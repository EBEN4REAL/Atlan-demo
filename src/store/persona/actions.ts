import { State } from './state'

export interface Actions extends State {
    setList(value: any): void
    updatePersona(persona: any): void
    removePersona(persona: any): void
    setErrorPersona(val: any): void
}

export const actions: Actions = {
    setErrorPersona(value) {
        this.errorPersona = value
    },
    setList(value) {
        this.list = value
    },
    updatePersona(persona) {
        if(!this.list){
            return this.list = [persona]
        }
        const index = this.list.findIndex((p) => p.id === persona.id)
        if (index > -1) this.list[index] = persona
        else this.list.push(persona)
    },
    removePersona(_id) {
        this.list = this.list.filter((p) => p.id !== _id)
    },
}
