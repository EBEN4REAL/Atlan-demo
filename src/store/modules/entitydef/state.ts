import { Components } from "~/api/atlas/client";
import { Status } from "~/types/status.d";

export interface State extends Status {
  data: Components.Schemas.AtlasTypesDef;
}

export const state: State = {
  data: {},
  loading: false,
  error: undefined,
};
