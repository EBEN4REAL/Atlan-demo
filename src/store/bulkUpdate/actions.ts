const actions = {
    setUpdateStatus(status) {
        this.updateStatus = { ...status }
    },
    setBulkSelectedAssets(list) {
        this.bulkSelectedAssets = [...list]
    },
    setShowNotifcation(value) {
        this.showNotification = value
    },
}
export default actions
