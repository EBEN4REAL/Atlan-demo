export const ETL_BUSINESS_METADATA_ATTRIBUTES = [
  "ETL.Last Run Date",
  "ETL.Job Link",
  "ETL.Last Run Status",
];

export const CUSTOM_RELATIONSHIP_ATTRIBUTES_TABLE = ["fact", "dimension"];

export const PRIMARY_KEY_RELATIONSHIP_ATTRIBUTE_NAME = "primary key";
export const FOREIGN_KEY_RELATIONSHIP_ATTRIBUTE_NAME = "foreign key";

export const CUSTOM_RELATIONSHIP_ATTRIBUTES_COLUMN = [
  PRIMARY_KEY_RELATIONSHIP_ATTRIBUTE_NAME,
  FOREIGN_KEY_RELATIONSHIP_ATTRIBUTE_NAME,
];

export const LINEAGE_DUMMY_ASSET_HIDE_FILTER_CRITERIA = {
  attributeName: "updatedSource",
  attributeValue: "lineage",
  operator: "neq",
};
export const projection = [
  "bookmarks",
  "description",
  "userDescription",
  "customDescription",
  "category",
  "messsage",
  "name",
  "displayName",
  "rowCount",
  "source",
  "sourceType",
  "integration",
  "integrationType",
  "status",
  "statusDetail",
  "statusMeta",
  "table",
  "type",
  "typeName",
  "updatedAt",
  "updatedBy",
  "lastSyncedAt",
  "lastSyncedBy",
  "dataType",
  "order",
  "isPrimary",
  "experts",
  "owners",
  "ownerUsers",
  "expertUsers",
  "colCount",
  "accessCount",
  /* BI Assets */
  "previewImageId",
  "previewImageId",
  "url",
  "metadata",
  ...ETL_BUSINESS_METADATA_ATTRIBUTES,
];

export const DEFAULT_ASSET_TYPES = [
  "AtlanTable",
  "AtlanView",
  "AtlanDatabase",
  "AtlanSchema",
  "AtlanIntegration",
  "AtlanColumn",
  "AtlanBIWidget",
  "AtlanBIDashboard",
  "AtlanBICollection",
  "AtlanBIExplore",
  "AtlanBIModel",
];

export const SEARCH_RELEVANCE_MIN_SCORE = 100;

export const getSearchTextFilters = (searchText) => {
  // TODO: Add more filter breakdowns
  const options = {
    query: searchText,
  };
  return options;
};

export const getFormattedSearchQuery = (originalQuery) => {
  if (originalQuery) {
    const searchQuery = originalQuery.trim();

    const pattern = searchQuery
      .split(" ")
      .map((x) => {
        return `(*${x}*)`;
      })
      .join("");
    return `${pattern}`;
  }
  return "";
};

export const getBasicQuery = (params, savingFilter = false) => {
  console.log("getBasicQuery -> params", params);
  const isAtlasUseLegacySearch =
    typeof window !== "undefined" &&
    window.ATLAS_USE_LEGACY_SEARCH &&
    typeof window.ATLAS_USE_LEGACY_SEARCH !== "undefined" &&
    window.ATLAS_USE_LEGACY_SEARCH === "true";

  const options = {
    ...params.staticOptions,
    limit: params.limit,
    offset: params.skip,
    attributes: params.businessMetadataAttributesProjection
      ? [...projection, ...params.businessMetadataAttributesProjection]
      : projection,
    ...(isAtlasUseLegacySearch
      ? {}
      : {
          minScore: SEARCH_RELEVANCE_MIN_SCORE,
        }),
  };

  if (params.attributes) {
    options.attributes = params.attributes;
  }

  const searchTextFilters = getSearchTextFilters(params.searchText);

  // searchText
  let searchQuery = "";
  if (searchTextFilters.query !== "") {
    const { query } = searchTextFilters;
    if (isAtlasUseLegacySearch) {
      searchQuery = getFormattedSearchQuery(query);
    } else {
      searchQuery = (query || "").trim();
    }
  }
  // relpace spaces with "?" so it returns results for "store_sales" when searched for "store sales"
  // searchQuery = searchQuery.replace(/\s/g, "?");
  options.query = searchQuery;

  // additional attributes
  if (params.keys && params.keys.length) {
    params.keys.forEach((key) => options.attributes.push(key));
  }

  // filters
  const entityFilters = {
    condition: "AND",
    criterion: [],
  };
  const filterObject = params.filters || {};
  const filterKeys = Object.keys(filterObject);

  // filter: classification
  // classification: "PII"
  if (filterKeys.indexOf("classification") >= 0) {
    const classificationFilter = filterObject.classification || [];
    if (classificationFilter.length) {
      const classificationEntityFilter = {
        condition: "OR",
        criterion: [],
      };
      classificationFilter.forEach((classification) => {
        classificationEntityFilter.criterion = [
          ...classificationEntityFilter.criterion,
          {
            attributeName: "__classificationNames",
            attributeValue: classification,
            operator: "=",
          },
          {
            attributeName: "__propagatedClassificationNames",
            attributeValue: classification,
            operator: "=",
          },
        ];
      });
      entityFilters.criterion.push(classificationEntityFilter);
    }
  }

  // filter: glossary
  if (filterKeys.indexOf("termName") >= 0) {
    const termNameFilter = filterObject.termName || [];
    if (termNameFilter.length) {
      // eslint-disable-next-line prefer-destructuring
      options.termName = termNameFilter[0];
    }
  }

  // filter: typeName
  let typeNameFilter = [];
  if (options.typeName === "AtlanAsset") {
    typeNameFilter = DEFAULT_ASSET_TYPES;
  }
  if (filterKeys.indexOf("typeName") >= 0) {
    typeNameFilter = filterObject.typeName || [];
  }
  const typeNameFilterObj = {
    condition: "OR",
    criterion: [],
  };
  typeNameFilterObj.criterion = typeNameFilter.map((typeName) => {
    return {
      attributeName: "typeName",
      attributeValue: typeName,
      operator: "eq",
    };
  });
  if (typeNameFilterObj.criterion.length) {
    entityFilters.criterion.push(typeNameFilterObj);
  }

  // filter: savedFilters
  if (filterKeys.indexOf("savedFilters") >= 0) {
    const savedFiltersValues = filterObject.savedFilters || [];
    savedFiltersValues.forEach((savedFilter) => {
      console.log("savedFiltersValues -> savedFilter", savedFilter);
      const savedEntityFilters = savedFilter
        ? savedFilter.entityFilters || {}
        : {};
      if (
        savedEntityFilters &&
        savedEntityFilters.criterion &&
        savedEntityFilters.criterion.length
      ) {
        entityFilters.criterion = entityFilters.criterion.concat(
          savedEntityFilters.criterion.map((c) => {
            // ? remove the attributes required for savedFilter UI when applying saved
            if (c?.attributeName === "BM")
              return { condition: c.condition, criterion: c.criterion };
            return c;
          })
        );
      }
      const savedFiltersQuery = savedFilter ? savedFilter.query || "" : "";
      if (savedFiltersQuery) {
        options.query = options.query
          ? `(${options.query} | ${savedFiltersQuery})`
          : savedFiltersQuery;
      }
      if (savedFilter.termName) {
        options.termName = savedFilter.termName;
      }
    });
  }

  // other filter keys
  filterKeys.forEach((filterKey) => {
    if (
      filterKey !== "typeName" &&
      filterKey !== "savedFilters" &&
      filterKey !== "classification" &&
      filterKey !== "termName"
    ) {
      console.log("getBasicQuery -> filterKey", filterKey);
      const filterValues = filterObject[filterKey] || [];
      const filterValuesObj = {
        condition: "OR",
        criterion: [],
      };
      if (filterKey === "businessMetadata") {
        if (savingFilter) {
          // ? using the attributeValues filed to keep track of Bm and Bm. attribute while saving
          filterValuesObj.attributeName = "BM";
          const BMNames = filterValues.map((v) => {
            return { bm: v.bm, attr: v.attributes[0].name };
          });
          filterValuesObj.attributeValue = JSON.stringify(BMNames);
        }
        filterValuesObj.criterion = filterValues.map((filterValue) => {
          return {
            attributeName: `${filterValue.bm}.${filterValue.attributes[0].name}`,
            attributeValue: filterValue.attributes[0].value,
            operator: filterValue.attributes[0].operator,
          };
        });
      } else {
        let filterValue = filterValues || [];
        // Edge case assets have status as undefined and some has status set NO_STATUS so need to search both in filter
        if (filterValue.includes("NO_STATUS")) {
          filterValue = [...filterValue, "isNull"];
        }
        filterValuesObj.criterion = filterValue.map((value) => {
          if (value === "isNull")
            return {
              attributeName: filterKey,
              attributeValue: "",
              operator: "isNull",
            };
          return {
            attributeName: filterKey,
            attributeValue: value,
            operator: "eq",
          };
        });
      }
      if (filterValuesObj.criterion.length) {
        entityFilters.criterion.push(filterValuesObj);
      }
    }
  });

  // owned by me
  // const ownedByMeObj = {
  //   condition: "OR",
  //   criterion: []
  // };
  // if (params.showOwnedByMe) {
  //   criterion.push({
  //     attributeName: "owners",
  //     attributeValue: "<user-id>",
  //     operator: "eq"
  //   });
  // }
  // if (ownedByMeObj.criterion.length) {
  //   entityFilters.criterion.push(ownedByMeObj);
  // }

  if (
    isAtlasUseLegacySearch &&
    params.filters &&
    params.filters.termName &&
    params.filters.termName.length &&
    params.searchText
  ) {
    /**
     * Adding this entity filter till we figure out to make this work in free text search
     * Also adding lowercase and uppercase filter, as contains is cae sensitive
     * */

    entityFilters.criterion.push({
      condition: "OR",
      criterion: [
        {
          attributeName: "name",
          attributeValue: params.searchText,
          operator: "contains",
        },
        {
          attributeName: "name",
          attributeValue: params.searchText.toUpperCase(),
          operator: "contains",
        },
        {
          attributeName: "name",
          attributeValue: params.searchText.toLowerCase(),
          operator: "contains",
        },
        {
          attributeName: "name",
          attributeValue: params.searchText
            .split(" ")
            .map((w) => w[0].toUpperCase() + w.substr(1).toLowerCase())
            .join(" "),
          operator: "contains",
        },
      ],
    });
  }

  if (
    params.customEntityFilter &&
    params.customEntityFilter.criterion.length > 0
  ) {
    entityFilters.criterion.push(params.customEntityFilter);
  }
  entityFilters.criterion.push(LINEAGE_DUMMY_ASSET_HIDE_FILTER_CRITERIA);

  if (entityFilters.criterion.length) {
    options.entityFilters = entityFilters;
  }

  // sort by and sort order
  if (params.sortBy) {
    options.sortBy = params.sortBy;
    const sortOrder = params.sortOrder || "asc";
    if (sortOrder === "desc") {
      options.sortOrder = "DESCENDING";
    } else {
      options.sortOrder = "ASCENDING";
    }
  }
  return options;
};
