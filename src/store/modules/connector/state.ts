import { Components } from "~/api/atlas/client";
import { Status } from "~/types/status.d";

export interface State extends Status {
  data: Components.Schemas.AtlasSearchResult;
  assetType: string;
  limit: number;
  offset: number;
}

export const state: State = {
  data: {},
  assetType: "AtlanBot",
  limit: 10000,
  offset: 0,
  loading: false,
  error: undefined,
};
