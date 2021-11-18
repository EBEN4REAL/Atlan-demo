export const getters = {
    getTenant(state) {
        return state.tenant;
    },
    getIdentityProviders(state) {
        return state.tenant.identityProviders;
    }
}
