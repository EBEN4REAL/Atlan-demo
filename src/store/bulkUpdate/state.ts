export interface State {
    bulkSelectedAssets: any
    updateStatus: any
    showNotification: boolean
    isBulkMode: boolean
}

export const state: State = {
    bulkSelectedAssets: [],
    updateStatus: {
        updateStatusOwners: { status: '', didChange: false, changeLog: {} },
        linkTerms: { status: '', didChange: false, changeLog: {} },
        linkClassifications: { status: '', didChange: false, changeLog: {} },
    },
    showNotification: false,
    isBulkMode: false,
}
