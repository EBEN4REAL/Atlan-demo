export interface State {
    bulkSelectedAssets: any
    updateStatus: any
}

export const state: State = {
    bulkSelectedAssets: [],
    updateStatus: {
        updateStatusOwners: { status: '', meta: {} },
        linkTerms: { status: '', meta: {} },
        linkClassifications: { status: '', meta: {} },
    },
    showNotification: false,
}
