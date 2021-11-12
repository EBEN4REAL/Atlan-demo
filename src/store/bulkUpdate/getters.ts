import { pluralizeString } from '~/utils/string'

const getters = {
    getChangedState(state) {
        const changedState = { ...state.updateStatus }
        if (state.updateStatus && Object.keys(state.updateStatus).length)
            Object.keys(state.updateStatus).forEach((key) => {
                if (!state.updateStatus[key].didChange) delete changedState[key]
            })
        return changedState
    },
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
            return `Updating ${
                state.bulkSelectedAssets.length
            } ${pluralizeString(
                'asset',
                state.bulkSelectedAssets.length,
                false
            )}`
        if (state.getFinalStatus === 'success')
            return `${state.bulkSelectedAssets.length} ${pluralizeString(
                'asset',
                state.bulkSelectedAssets.length,
                false
            )} updated`
        if (state.getFinalStatus === 'error')
            return `Failed to update ${
                state.bulkSelectedAssets.length
            } ${pluralizeString(
                'asset',
                state.bulkSelectedAssets.length,
                false
            )}`
        return ''
    },
    getCertificationStatus(state) {
        return state.updateStatus.updateCertification.status
    },
    getOwnersStatus(state) {
        return state.updateStatus.updateOwners.status
    },
    getLinkClassificationsStatus(state) {
        return state.updateStatus.linkClassifications.status
    },
    getLinkTermsStatus(state) {
        return state.updateStatus.linkTerms.status
    },
    getFinalStatus(state) {
        let calculatedStatus = ''
        const changedState = { ...state.getChangedState }
        if (changedState && Object.keys(changedState).length) {
            Object.keys(changedState).forEach((key) => {
                const statusObject = changedState[key]
                if (!calculatedStatus) calculatedStatus = statusObject.status
                else if (
                    calculatedStatus === 'loading' ||
                    statusObject.status === 'loading'
                )
                    calculatedStatus = 'loading'
                else if (
                    calculatedStatus === 'error' ||
                    statusObject.status === 'error'
                )
                    calculatedStatus = 'error'
                else if (
                    calculatedStatus === 'success' &&
                    statusObject.status === 'success'
                )
                    calculatedStatus = 'success'
            })
        }
        return calculatedStatus
    },
    getStatusLabel(state) {
        if (state.getCertificationStatus === 'loading')
            return `Updating certification`
        if (state.getCertificationStatus === 'success')
            return `Updated certification`
        if (state.getCertificationStatus === 'error')
            return `Failed to update certification`
        return ''
    },
    getOwnersLabel(state) {
        if (state.getOwnersStatus === 'loading') return `Updating owners`
        if (state.getOwnersStatus === 'success') return `Updated owners`
        if (state.getOwnersStatus === 'error') return `Failed to update owners`
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
