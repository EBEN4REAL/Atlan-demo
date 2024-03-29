import { State } from './state'

export interface Actions extends State {
    setToken(value: any): void
    setPermissions(value: any): void
    setEvaluations(value: any): void
    setSecondaryEvaluations(value: any): void
    setColumnEvaluations(value: any): void
    setFailed(value: any): void
    setPending(value: any): void
    setIsAuthenticated(value: any): void
    setUserDetails(): void
    setRoles(value: any): void
    setDefaultRoles(value: any): void
    setDecentralizedRoles(value: any): void
    setPersonas(value: any): void
    setPurposes(value: any): void
    setGroups(value: any): void
}

export const actions: Actions = {
    setToken(value) {
        this.token = value?.token
        this.decodedToken = value?.decodedToken
    },
    setUserDetails() {
        console.log('decodedToken', this.decodedToken)
        this.name = this.decodedToken.name
        this.firstName = this.decodedToken.given_name
        this.lastName = this.decodedToken.family_name
        this.email = this.decodedToken.email
        this.id = this.decodedToken.userId
        this.username = this.decodedToken.username
        this.createdAt = this.decodedToken.createdAt
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
                `${
                    evaluation.entityGuid ||
                    evaluation.entityGuidEnd1 ||
                    evaluation.entityGuidEnd2
                }_${evaluation.action}`
        )
        const evaluationMap = this.evaluations.map(
            (evaluation) =>
                `${
                    evaluation.entityGuid ||
                    evaluation.entityGuidEnd1 ||
                    evaluation.entityGuidEnd2
                }_${evaluation.action}`
        )
        const uniqueValues = valueMap.filter(
            (val) => evaluationMap.indexOf(val) < 0
        )
        const uniqueArray = value.filter(
            (i) =>
                uniqueValues.indexOf(
                    `${i.entityGuid || i.entityGuidEnd1 || i.entityGuidEnd2}_${
                        i.action
                    }`
                ) >= 0
        )
        /* This is a hack to prevent the list from growing too large. */
        //  ! below line is limitting evaluation array size to 29 items, glossary needs more than this,
        if (this.evaluations.length + uniqueArray.length > 30) {
            this.evaluations.splice(0, uniqueArray.length)
        }
        this.evaluations.push(...uniqueArray)
    },
    // For asset drawers and widgets that require temporary evaluations
    // - to keep it separate from main evaluations
    setSecondaryEvaluations(value) {
        const valueMap = value.map(
            (evaluation) =>
                `${
                    evaluation.entityGuid ||
                    evaluation.entityGuidEnd1 ||
                    evaluation.entityGuidEnd2
                }_${evaluation.action}`
        )
        const evaluationMap = this.secondaryEvaluations.map(
            (evaluation) =>
                `${
                    evaluation.entityGuid ||
                    evaluation.entityGuidEnd1 ||
                    evaluation.entityGuidEnd2
                }_${evaluation.action}`
        )
        const uniqueValues = valueMap.filter(
            (val) => evaluationMap.indexOf(val) < 0
        )
        const uniqueArray = value.filter(
            (i) =>
                uniqueValues.indexOf(
                    `${i.entityGuid || i.entityGuidEnd1 || i.entityGuidEnd2}_${
                        i.action
                    }`
                ) >= 0
        )
        if (this.secondaryEvaluations.length + uniqueArray.length > 80) {
            this.secondaryEvaluations.splice(0, uniqueArray.length)
        }
        this.secondaryEvaluations.push(...uniqueArray)
        if (this.secondaryEvaluations.length + uniqueArray.length > 80) {
            value.forEach((el) => {
                const found = this.secondaryEvaluations.find(
                    (i) =>
                        `${
                            i.entityGuid || i.entityGuidEnd1 || i.entityGuidEnd2
                        }_${i.action}` ===
                        `${
                            el.entityGuid ||
                            el.entityGuidEnd1 ||
                            el.entityGuidEnd2
                        }_${el.action}`
                )
                if (!found) {
                    this.secondaryEvaluations.push(el)
                }
            })
        }
    },

    // For columns widget in asset profile - to keep it separate from main evaluations
    // FIXME: Merge this with secondary evaluations with proper changes

    setColumnEvaluations(value) {
        const valueMap = value.map(
            (evaluation) =>
                `${evaluation.entityId || evaluation.entityIdEnd2}_${
                    evaluation.action
                }`
        )
        const evaluationMap = this.columnEvaluations.map(
            (evaluation) =>
                `${evaluation.entityGuid || evaluation.entityIdEnd2}_${
                    evaluation.action
                }`
        )
        const uniqueValues = valueMap.filter(
            (val) => evaluationMap.indexOf(val) < 0
        )
        const uniqueArray = value.filter(
            (i) =>
                uniqueValues.indexOf(
                    `${i.entityId || i.entityIdEnd2}_${i.action}`
                ) >= 0
        )
        if (this.columnEvaluations.length + uniqueArray.length > 1000) {
            this.columnEvaluations.splice(0, uniqueArray.length)
        }
        this.columnEvaluations.push(...uniqueArray)
        if (this.columnEvaluations.length + uniqueArray.length > 1000) {
            value.forEach((el) => {
                const found = this.columnEvaluations.find(
                    (i) =>
                        `${i.entityId || i.entityIdEnd2}_${i.action}` ===
                        `${el.entityId || el.entityIdEnd2}_${el.action}`
                )
                if (!found) {
                    this.columnEvaluations.push(el)
                }
            })
        }
    },

    setRoles(value) {
        this.roles = value
    },
    setDefaultRoles(value) {
        this.defaultRoles = value
    },
    setDecentralizedRoles(value) {
        this.decentralizedRoles = value
    },
    setPersonas(value) {
        this.personas = value
    },
    setPurposes(value) {
        this.purposes = value
    },
    setGroups(value) {
        this.groups = value
    },
}
