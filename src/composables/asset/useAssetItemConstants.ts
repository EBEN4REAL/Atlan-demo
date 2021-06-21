import { computed } from "vue";

export default function useAssetItemConstants() {
  const assetItemsconstants: any = {
    typeNameMapping: {
      AtlanTable: "table",
      AtlanColumn: "column",
      AtlanBIDashboard: "biDashboard",
      AtlanView: "view",
      AtlanDatabase: "database",
      AtlanSchema: "schema",
      AtlanBICollection: "biCollection",
      AtlanBIWidget: "biWidget",
      AtlanBIExplore: "biExplore",
      // AtlanBIModel: "biModel",
      AtlanProcess: "process",
      AtlanIntegration: "integration",
      AtlanSavedQuery: "query",
    },
    iconsMappingByType: {
      integration: "far fa-link text-database",
      column: "far fa-columns text-column",
      process: "far fa-code",
      table: "far fa-table text-table",
      view: "far fa-th-list text-view",
      database: "far fa-database",
      schema: "far fa-box",
      biCollection: "far fa-folder",
      biDashboard: "far fa-user-chart",
      biWidget: "far fa-chart-pie-alt",
      biExplore: "far fa-eye",
      biModel: "far fa-compass",
      query: "far fa-code",
    },
    typeNameReadableNameMapping: {
      integration: "Integration",
      column: "Column",
      process: "Process",
      view: "View",
      database: "Database",
      table: "Table",
      schema: "Schema",
      biCollection: "BI Collection",
      biDashboard: "BI Dashboard",
      biWidget: "BI Widget",
      biExplore: "BI Explore",
      biModel: "BI Model",
      query: "Query",
    },
    popularTypes: [
      "AtlanTable",
      "AtlanColumn",
      "AtlanBIDashboard",
      "AtlanView",
    ],
    internalTypes: ["AtlanProcess"],
  };

  const assetTypeFilterItems = computed(() => {
    return Object.keys(assetItemsconstants.typeNameMapping)
      .filter(
        (typeName) => !assetItemsconstants.internalTypes.includes(typeName)
      )
      .map((typeName) => {
        return {
          name:
            assetItemsconstants.typeNameReadableNameMapping[
              assetItemsconstants.typeNameMapping[typeName]
            ] || "",
          alias: typeName,
          isPopular: assetItemsconstants.popularTypes.includes(typeName),
          iconClass:
            assetItemsconstants.iconsMappingByType[
              assetItemsconstants.typeNameMapping[typeName]
            ],
        };
      });
  });

  const getNameFromType = (type) => {
    const name = assetItemsconstants.typeNameMapping[type];
    return name;
  };
  const getIconClassByType = (type) => {
    const name = assetItemsconstants.getNameFromType(type);
    return assetItemsconstants.iconsMappingByType[name];
  };
  const getReadableNameFromType = (type) => {
    const name = assetItemsconstants.getNameFromType(type);
    return assetItemsconstants.typeNameReadableNameMapping[name];
  };

  const getStatusIcon = (status) => {
    if (status === "VERIFIED") {
      return "fas fa-badge-check table-ready";
    } else if (status === "WORK_IN_PROGRESS") {
      return "fas fa-exclamation-triangle text-warning";
    } else if (status === "ISSUE") {
      return "fas fa-exclamation-triangle text-danger";
    } else if (status === "LOCKED") {
      return "fas fa-lock text-dark";
    } else if (status === "DEPRECATED") {
      return "fas fa-archive text-muted";
    }
    return "";
  };

  return {
    assetItemsconstants,
    assetTypeFilterItems,
    getNameFromType,
    getIconClassByType,
    getReadableNameFromType,
    getStatusIcon,
  };
}
