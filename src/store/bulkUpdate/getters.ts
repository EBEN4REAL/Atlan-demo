const getters = {
    getShowNotification(state) {
        return state.showNotification
    },
    getUpdateStatus(state) {
        return state.updateStatus
    },
    getBulkSelectedAssets(state) {
        return state.getBulkSelectedAssets
    },
    getFinalStatusLabel(state) {
        if (state.getFinalStatus === 'loading')
            return `Updating ${state.bulkSelectedAssets.length} assets`
        if (state.getFinalStatus === 'success')
            return `${state.bulkSelectedAssets.length} assets updated`
        if (state.getFinalStatus === 'error')
            return `Failed to update ${state.bulkSelectedAssets.length} assets`
        return ''
    },
    getStatusOwnersStatus(state) {
        return state.updateStatus.updateStatusOwners.status
    },
    getLinkClassificationsStatus(state) {
        return state.updateStatus.linkClassifications.status
    },
    getLinkTermsStatus(state) {
        return state.updateStatus.linkTerms.status
    },
    getFinalStatus(state) {
        // TODO: there has to be a better way to do this
        if (
            state.getStatusOwnersStatus === 'loading' ||
            state.getLinkClassificationsStatus === 'loading' ||
            state.updateStatus.linkClassifications.status === 'loading'
        )
            return 'loading'
        if (
            state.getStatusOwnersStatus === 'error' ||
            state.getLinkClassificationsStatus === 'error' ||
            state.updateStatus.linkClassifications.status === 'error'
        )
            return 'error'
        if (
            state.getStatusOwnersStatus === 'success' &&
            state.getLinkClassificationsStatus === 'success' &&
            state.updateStatus.linkClassifications.status === 'success'
        )
            return 'success'
        return ''
    },
    getChangedStatus(state) {
        return state.updateStatus.updateStatusOwners.meta.changedStatus
    },
    getAddedOwners(state) {
        return state.updateStatus.updateStatusOwners.meta.addedOwners
    },
    getRemovedOwners(state) {
        return state.updateStatus.updateStatusOwners.meta.removedOwners
    },
    getStatusLabel(state) {
        if (state.getStatusOwnersStatus === 'loading')
            return `Updating certification`
        if (state.getStatusOwnersStatus === 'success')
            return `Updated certification`
        if (state.getStatusOwnersStatus === 'error')
            return `Failed to update certification`
        return ''
    },
    getOwnersLabel(state) {
        if (state.getStatusOwnersStatus === 'loading') return `Updating owners`
        if (state.getStatusOwnersStatus === 'success') return `Updated owners`
        if (state.getStatusOwnersStatus === 'error')
            return `Failed to update owners`
        return ''
    },
    getClassificationsLabel(state) {
        if (state.getLinkClassificationsStatus === 'loading')
            return `Updating classifications`
        if (state.getLinkClassificationsStatus === 'success')
            return `Updated classifications`
        if (state.getLinkClassificationsStatus === 'error')
            return `Failed to update classifications`
        return ''
    },
    getTermsLabel(state) {
        if (state.getLinkTermsStatus === 'loading') return `Updating terms`
        if (state.getLinkTermsStatus === 'success') return `Updated terms`
        if (state.getLinkTermsStatus === 'error')
            return `Failed to update terms`
        return ''
    },
}
export default getters
