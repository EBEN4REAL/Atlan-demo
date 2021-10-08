
import { State } from './state';

export type Getters = {
    getBusinessMetadataListProjections(): string[],
    // eslint-disable-next-line no-unused-vars
    getBusinessMetadataList(state: State): object[] | null,
    // eslint-disable-next-line no-unused-vars
    getBusinessMetadataListError(state: State): string | null,
    // eslint-disable-next-line no-unused-vars
    getBusinessMetadataListLoading(state: State): boolean;
    // eslint-disable-next-line no-unused-vars
    getBusinessMetadataListLoaded(state: State): boolean;
};

export const getters: Getters = {
    getBusinessMetadataList(state) {
        return state.businessMetadataList;
    },
    getBusinessMetadataListProjections() {
        const reqBmAttrNames: string[] = [];
        this.getBusinessMetadataList?.forEach(bm => {
            if (bm.attributeDefs && bm.attributeDefs.length && !bm.isArchived) {
                bm.attributeDefs.forEach((attr: { name: any; }) => {
                    reqBmAttrNames.push(`${bm.name}.${attr.name}`);
                });
            }
        });
        return reqBmAttrNames;
    },
    getBusinessMetadataListError(state) {
        return state.businessMetadataListError
    },
    getBusinessMetadataListLoading(state) {
        return state.businessMetadataListLoading
    },
    getBusinessMetadataListLoaded(state) {
        return state.businessMetadataListLoaded
    }
};
