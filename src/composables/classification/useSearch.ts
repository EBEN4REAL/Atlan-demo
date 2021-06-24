import { Classification } from "~/api/atlas/classification";

const options = {
  staticOptions: {
    searchType: "BASIC",
    typeName: "AtlanAsset",
    excludeDeletedEntities: true,
    includeClassificationAttributes: true,
    includeSubClassifications: true,
    includeSubTypes: true,
    termName: this.selectedTerm.qualifiedName || null,
  },
  ...(this.selectedTerm.qualifiedName || this.classificationName
    ? {
        filters: {
          ...assetFilters, // {integrationType:[],status:[],typeName:[]}
          ...(this.selectedTerm.qualifiedName
            ? {
                termName: [this.selectedTerm.qualifiedName],
              }
            : {}),
          ...(this.classificationName
            ? { classification: [this.classificationName] }
            : {}),
        },
      }
    : {}),
  limit: this.limit || 20,
  skip: this.skip || 0,
  searchText: this.searchText || "",
  attributes: [
    "createTime",
    "db",
    "lastAccessTime",
    "integrationType",
    "tableType",
    "term",
    "rowCount",
    "classifications",
    "classificationNames",
    "bytes",
    "schema",
    "description",
    "userDescription",
    "customDescription",
    "updatedAt",
    "clustering_key",
    "dataType",
    "meanings",
    "table",
    "colCount",
    "displayName",
    // saved query
    "status",
    "queryString",
    "createdBy",
    "tableQualifiedName",
    "lastSyncedAt",
  ],
};

export function useSearch() {
  const { data: assetsData, error: assetsError } = Classification.basicSearch({
    cache: false,
    options: {
      ...options,
      filters: this.getActualFilters(options.filters) || {},
    },
  });

  watch([assetsData, assetsError], () => {
    if (assetsData.value) {
    } else if (assetsError.value) {
      console.log(assetsError.value.message, assetsError);
    }
  });
}
