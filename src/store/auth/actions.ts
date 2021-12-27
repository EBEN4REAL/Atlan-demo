import { State } from './state'

export interface Actions extends State {
    setToken(value: any): void
    setPermissions(value: any): void
    setEvaluations(value: any): void
    setFailed(value: any): void
    setPending(value: any): void
    setIsAuthenticated(value: any): void
    setUserDetails(): void
    setRoles(value: any): void
    setDecentralizedRoles(value: any): void
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
        const valueMap = value.map(
            (evaluation) =>
                `${evaluation.entityGuid || evaluation.entityGuidEnd2}_${
                    evaluation.action
                }`
        )
        const evaluationMap = this.evaluations.map(
            (evaluation) =>
                `${evaluation.entityGuid || evaluation.entityGuidEnd2}_${
                    evaluation.action
                }`
        )
        const uniqueValues = valueMap.filter(
            (val) => evaluationMap.indexOf(val) < 0
        )
        const uniqueArray = value.filter(
            (i) =>
                uniqueValues.indexOf(
                    `${i.entityGuid || i.entityGuidEnd2}_${i.action}`
                ) >= 0
        )
        if (this.evaluations.length + uniqueArray.length > 30) {
            this.evaluations.splice(0, uniqueArray.length)
        }
        this.evaluations.push(...uniqueArray)
    },
    setRoles(value) {
        this.roles = value
    },
    setDecentralizedRoles(value) {
        this.decentralizedRole = value
    },
}
