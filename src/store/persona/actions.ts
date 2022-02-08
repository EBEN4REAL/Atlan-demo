import { State } from './state'

export interface Actions extends State {
    setList(value: any): void
    updatePersona(persona: any): void
}

export const actions: Actions = {
    setList(value) {
        this.list = value
    },
    updatePersona(persona) {
        const index = this.list.findIndex((p) => p.id === persona.id)
        if (index > -1)
            this.list[index] = persona
    }
}
