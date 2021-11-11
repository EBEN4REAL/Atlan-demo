const getters = {
    getError(state) {
        return state.errorCaptured
    },
    getErrorVisible(state) {
        return state.isErrorVisible
    },
}
export default getters
