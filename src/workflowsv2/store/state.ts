export interface State {
    activePackageMap: Record<string, number>
    packageMeta: Record<string, any>
}

export const state: State = {
    activePackageMap: {},
    packageMeta: {},
}
