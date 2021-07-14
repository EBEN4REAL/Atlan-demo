import {
  AdvancedAttributeList,
  OperatorList,
} from "~/constant/advancedAttributes";

export interface criterion {
  attributeName: string;
  attributeValue?: string | undefined;
  operator?: string | undefined;
}
export function encodeRouterQueryFromFilterOptions(options: any) {
  const routerQuery: {
    searchText: string;
    limit: string;
    filters: string;
  } = {
    searchText: "",
    limit: "",
    filters: "",
  };

  if (options.searchText) {
    routerQuery.searchText = options.searchText;
  }

  if (options.filters) {
    const filterKeys = Object.keys(options.filters);
    const filtersString: Array<string> = [];
    filterKeys.forEach((filterKey) => {
      let filterKeyValue = options.filters[filterKey];
      switch (filterKey) {
        case "classifications": {
          filterKeyValue = options.filters[filterKey].criterion;
          let tempNames: Array<string | undefined> = [];
          filterKeyValue.forEach((e: criterion) => {
            if (e.attributeName === "__classificationNames") {
              tempNames.push(e.attributeValue);
            }
          });
          filterKeyValue = tempNames.join(",");
          break;
        }
        case "status": {
          filterKeyValue = options.filters[filterKey].criterion;
          filterKeyValue = filterKeyValue
            .map((e: criterion) => e.attributeValue)
            .join(",");
          break;
        }
        case "owners": {
          filterKeyValue = options.filters[filterKey].criterion;
          filterKeyValue = filterKeyValue
            .map((e: criterion) => `${e.attributeName}:${e.attributeValue}`)
            .join(",");
          break;
        }
        case "advanced": {
          filterKeyValue = options.filters[filterKey].criterion;
          filterKeyValue = filterKeyValue
            .map(
              (e: criterion) =>
                (e.attributeName ? e.attributeName + ":" : "") +
                (e.attributeValue ? e.attributeValue + ":" : "") +
                (e.operator ? e.operator + ":" : "")
            )
            .join(",");
          filterKeyValue = filterKeyValue.slice(0, -1);

          break;
        }
      }
      // TODO include business met data and other filters
      if (options.filters[filterKey].criterion.length > 0) {
        const temp = `${filterKey}::${filterKeyValue}`;
        if (temp) {
          filtersString.push(temp);
        }
      }
    });
    if (filtersString.length) {
      routerQuery.filters = filtersString.join(":::");
    }
  }

  // if (options.sortBy) {
  //   routerQuery.sortBy = options.sortBy;
  // }

  // if (options.sortOrder) {
  //   routerQuery.sortOrder = options.sortOrder;
  // }

  if (options.limit) {
    routerQuery.limit = options.limit;
  }
  console.log("setRouterQuery -> routerQuery", routerQuery);
  return routerQuery;
}
export function decodeRouterQueryFromFilterOptions(router) {
  const filters = router.currentRoute.value.query?.filters;
  const searchText = router.currentRoute.value.query?.searchText;
  const limit = router.currentRoute.value.query?.limit;
  const facetsFiltersStrings = filters?.split(":::");
  const facetsFilters: filterMapType = {
    status: {
      checked: [],
      condition: "OR",
      criterion: [],
    },
    classifications: {
      checked: [],
      condition: "OR",
      criterion: [],
    },
    owners: {
      userValue: "",
      groupValue: "",
      condition: "OR",
      criterion: [],
    },
    advanced: {
      list: [],
      condition: "OR",
      criterion: [],
    },
  };

  facetsFiltersStrings?.forEach((facetFilterString: string) => {
    const facetFilter = facetFilterString.split("::");
    const facetFilterName = facetFilter[0]; // name
    const facetFilterValuesString = facetFilter[1]; //verified,draft
    let criterion: Array<criterion> = [];
    switch (facetFilterName) {
      case "status": {
        const facetFilterValues = facetFilterValuesString.split(",");
        facetFilterValues.forEach((facetFilterValue) => {
          criterion.push({
            attributeName: "assetStatus",
            attributeValue: facetFilterValue,
            operator: "eq",
          });
        });
        facetsFilters.status.criterion = criterion;
        facetsFilters.status.checked = facetFilterValues;
        break;
      }
      case "classifications": {
        const facetFilterValues = facetFilterValuesString.split(",");
        console.log(facetFilterValues, "classifications");
        facetFilterValues.forEach((facetFilterValue) => {
          criterion.push({
            attributeName: "__classificationNames",
            attributeValue: facetFilterValue,
            operator: "eq",
          });
          criterion.push({
            attributeName: "__propagatedClassificationNames",
            attributeValue: facetFilterValue,
            operator: "eq",
          });
        });
        facetsFilters.classifications.criterion = criterion;
        facetsFilters.classifications.checked = facetFilterValues;
        break;
      }
      case "owners": {
        const facetFilterValues = facetFilterValuesString.split(",");
        facetFilterValues.forEach((facetFilterValue) => {
          const subFacetFilterValues = facetFilterValue.split(":");
          if (subFacetFilterValues[0] === "ownerUsers") {
            criterion.push({
              attributeName: "ownerUsers",
              attributeValue: subFacetFilterValues[1],
              operator: "contains",
            });
            facetsFilters.owners.userValue = subFacetFilterValues[1];
          } else {
            criterion.push({
              attributeName: "ownerGroups",
              attributeValue: subFacetFilterValues[1],
              operator: "contains",
            });
            facetsFilters.owners.groupValue = subFacetFilterValues[1];
          }
        });
        facetsFilters.owners.criterion = criterion;
        break;
      }
      case "advanced": {
        const facetFilterValues = facetFilterValuesString.split(",");
        let options: Array<any> = [];
        AdvancedAttributeList.forEach((item) => {
          let temp = item;
          temp.children = OperatorList.filter((op) =>
            op.allowedType.includes(item.type)
          );
          options.push(temp);
        });
        try {
          let tmp: {
            isInput: boolean | undefined;
            operand: string;
            type: string;
            operator: Array<string>;
          };
          facetFilterValues.forEach((facetFilterValue) => {
            tmp = { isInput: false, operand: "", type: "", operator: [] };
            const subFacetFilterValues = facetFilterValue.split(":");
            let attributeName: string, attributeValue: any, operator: any;
            attributeName = subFacetFilterValues[0];
            if (subFacetFilterValues.length > 0)
              attributeValue = subFacetFilterValues[1];
            if (subFacetFilterValues.length > 1)
              operator = subFacetFilterValues[2];

            const found = options.find((op) => op.value === attributeName);
            tmp.type = found?.type;
            const foundOperator = OperatorList.find(
              (op) => op.value === operator
            );
            tmp.isInput = foundOperator?.isInput;
            tmp.operand = attributeValue;
            let operatorArray = [];
            operatorArray.push(attributeName);
            if (operator) operatorArray.push(operator);
            tmp.operator = operatorArray;

            criterion.push({
              attributeName,
              attributeValue,
              operator,
            });
          });
          facetsFilters.advanced.criterion = criterion;
          facetsFilters.advanced.list.push(tmp);
        } catch (err) {
          console.log(err);
        }
        break;
      }
    }
  });
  return {
    facetsFilters,
    searchText,
    limit,
  };
}
