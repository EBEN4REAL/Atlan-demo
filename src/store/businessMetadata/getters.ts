// eslint-disable-next-line import/no-cycle

import { State } from './state';

export type Getters = {
    getBusinessMetadataListProjections(): string[],
    getBusinessMetadataList(state: State): object[] | null,
    getBusinessMetadataListError(state: State): string | null,
    getBusinessMetadataListLoading(state: State): boolean;
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
    }
};
