import { Components } from "~/api/user/client";
import { Status } from "~/types/status.d";

export interface State extends Status {
  data: Components.Schemas.RealmRepresentation;
}

export const state: State = {
  data: {},
  loading: false,
  error: undefined,
};
