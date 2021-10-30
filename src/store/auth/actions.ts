import { State } from './state'

export interface Actions extends State {
    setToken(value: any): void
    setPermissions(value: any): void
    setEvaluations(value: any): void
    setFailed(value: any): void
    setPending(value: any): void
    setIsAuthenticated(value: any): void
    setUserDetails(): void
}

export const actions: Actions = {
    setToken(value) {
        this.token = value?.token
        this.decodedToken = value?.decodedToken
    },
    setUserDetails() {
        this.name = this.decodedToken.name
        this.firstName = this.decodedToken.given_name
        this.lastName = this.decodedToken.family_name
        this.email = this.decodedToken.email
        this.id = this.decodedToken.userId
        this.username = this.decodedToken.username
    },
    setPermissions(value) {
        this.permissions = value
    },
    setFailed(value) {
        this.hasFailed = value
    },
    setPending(value) {
        this.isPending = value
    },
    setIsAuthenticated(value) {
        this.isAuthenticated = value
    },
    setEvaluations(value) {
        this.evaluations = value
    },
}
