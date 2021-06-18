import { computed, ComputedRef, Ref, ref, watch } from "vue";

export default function useAssetItemConstants() {
    // * data
    const typeNameMapping = {
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
    };
    const iconsMappingByType = {
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
    };
    const typeNameReadableNameMapping = {
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
    };
    const popularTypes = ["AtlanTable", "AtlanColumn", "AtlanBIDashboard", "AtlanView"];
    const internalTypes = ["AtlanProcess"];

    // * Computed
    const assetTypeFilterItems = computed(() => {
        return Object.keys(typeNameMapping)
            .filter(typeName => !internalTypes.includes(typeName))
            .map(typeName => {
                return {
                    name: typeNameReadableNameMapping[typeNameMapping[typeName]] || "",
                    alias: typeName,
                    isPopular: popularTypes.includes(typeName),
                    iconClass: iconsMappingByType[typeNameMapping[typeName]],
                };
            });
    });

    // * Methods
    const getNameFromType = (type: string | number) => {
        const name = typeNameMapping[type];
        return name;
    };

    const getIconClassByType = (type: any) => {
        const name = getNameFromType(type);
        return iconsMappingByType[name];
    };

    const getReadableNameFromType = (type: any) => {
        const name = getNameFromType(type);
        return typeNameReadableNameMapping[name];
    };

    const getStatusIcon = (status: string) => {
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
        typeNameMapping,
        iconsMappingByType,
        typeNameReadableNameMapping,
        popularTypes,
        internalTypes,
        assetTypeFilterItems,
        getIconClassByType,
        getReadableNameFromType,
        getStatusIcon,
    };
}
