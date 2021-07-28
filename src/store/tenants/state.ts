import { Components } from "~/api/auth/client";

export interface State {
  tenant: Components.Schemas.RealmRepresentation;
  isAuthenticated: boolean
  token: any
}

export const state: State = {
  tenant: {},
  isAuthenticated: false,
  token: {},
};
