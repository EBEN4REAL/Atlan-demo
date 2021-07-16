// eslint-disable-next-line import/no-cycle

import { State } from "./state";
import { Components } from "~/api/auth/client";

export type Getters = {
    getTenant(state: State): Components.Schemas.RealmRepresentation;
    getIdentityProviders(state: State): Array<any> | undefined
};

export const getters: Getters = {
    getTenant(state) {
        return state.tenant;
    },
    getIdentityProviders(state) {
        return state.tenant.identityProviders;
    }
};
