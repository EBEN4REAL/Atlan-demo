import { Components } from "~/api/atlas/client";
import { Status } from "~/types/status.d";

export interface SearchParameters extends Components.Schemas.SearchParameters {
  [key: string]: any;
  minScore?: number;
}

export interface State extends Status {
  data: Components.Schemas.AtlasSearchResult;
  searchParameters?: SearchParameters;
}

export const state: State = {
  data: {},
  loading: false,
  error: undefined,
  cancelToken: undefined,
  searchParameters: {
    typeName: "AtlanTable",
    excludeDeletedEntities: true,
    includeClassificationAttributes: true,
    includeSubClassifications: true,
    includeSubTypes: true,
    limit: 50,
    offset: 0,
    entityFilters: {},
  },
};
