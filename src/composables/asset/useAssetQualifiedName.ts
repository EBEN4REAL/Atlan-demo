import { computed, ComputedRef, Ref, ref, watch } from 'vue';
import useAssetItemConstants from '~/composables/asset/useAssetItemConstants';

const ASSET_TYPES_LIST = [
  {
    id: "AtlanTable",
    label: "Table",
    icon: "far fa-table text-success",
    parents: [
      "AtlanIntegration",
      "AtlanServer",
      "AtlanDatabase",
      "AtlanSchema"
    ],
    childrens: ["AtlanColumn"]
  },
  {
    id: "AtlanSavedQuery",
    label: "Query",
    icon: "far fa-code",
    parents: [
      "AtlanIntegration",
      "AtlanServer",
      "AtlanDatabase",
      "AtlanSchema",
      "AtlanTable"
    ],
    childrens: []
  },
  {
    id: "AtlanView",
    label: "View",
    icon: "far fa-table text-success",
    parents: [
      "AtlanIntegration",
      "AtlanServer",
      "AtlanDatabase",
      "AtlanSchema"
    ],
    childrens: ["AtlanColumn"]
  },
  {
    id: "AtlanColumn",
    label: "Column",
    icon: "far fa-columns text-success",
    parents: [
      "AtlanIntegration",
      "AtlanServer",
      "AtlanDatabase",
      "AtlanSchema",
      ["AtlanTable", "AtlanView"]
    ],
    childrens: []
  },
  {
    id: "AtlanSchema",
    label: "Schema",
    icon: "far fa-network-wired text-success",
    parents: ["AtlanIntegration", "AtlanServer", "AtlanDatabase"],
    childrens: [["AtlanTable", "AtlanView"]]
  },
  {
    id: "AtlanDatabase",
    label: "Database",
    icon: "far fa-database text-success",
    parents: ["AtlanIntegration", "AtlanServer"],
    childrens: ["AtlanSchema"]
  },
  {
    id: "AtlanBICollection",
    label: "Collection",
    icon: "far fa-folder",
    parents: ["AtlanIntegration", "AtlanServer"],
    childrens: ["AtlanBIDashboard"]
  },
  {
    id: "AtlanBIDashboard",
    label: "Dashboard",
    icon: "far fa-user-chart",
    parents: ["AtlanIntegration", "AtlanServer", "AtlanBICollection"],
    childrens: []
  },
  {
    id: "AtlanBIWidget",
    label: "Widget",
    icon: "far fa-chart-pie-alt",
    parents: [
      "AtlanIntegration",
      "AtlanServer",
      "AtlanBICollection",
      "AtlanBIDashboard"
    ],
    childrens: []
  },
  {
    id: "AtlanServer",
    label: "Server",
    icon: "far fa-server",
    parents: ["AtlanIntegration"],
    childrens: []
  },
  {
    id: "AtlanIntegration",
    label: "Source",
    iconClass: "far fa-link text-database",
    icon: "far fa-link",
    parents: [],
    childrens: []
  },
  {
    id: "AtlanProcess",
    label: "Process",
    parents: [],
    childrens: []
  }
];

export default function useAssetQualifiedName() {
  // * Composables 
  const { iconsMappingByType } = useAssetItemConstants();

  // * Methods
  const getIconForAssetType = (type: string) => {
    const icon = iconsMappingByType[type];
    return icon || "far fa-table text-table";
  };

  const getAssetNameFromQualfiedName = (qualifiedName: any) => {
    const qualifiedNamePathParts = (qualifiedName || "").split("/");
    if (qualifiedNamePathParts && qualifiedNamePathParts.length) {
      return qualifiedNamePathParts[qualifiedNamePathParts.length - 1];
    }
    return "";
  };

  const getAssetParents = (asset: { attributes: { tableQualifiedName: any; qualifiedName: any; integrationType: string; table: { typeName: string; }; }; typeName: string; }, getMin = true) => {
    if (asset && asset.attributes) {
      const found = ASSET_TYPES_LIST.find(
        item => item.id.toLowerCase() === asset.typeName.toLowerCase()
      );
      const qualifiedName =
        asset.typeName === "AtlanSavedQuery"
          ? asset.attributes.tableQualifiedName
          : asset.attributes.qualifiedName;
      const qualifiedNamePathParts = (qualifiedName || "").split("/");
      if (asset.attributes.integrationType === "DELTA_LAKE") {
        qualifiedNamePathParts.splice(1, 1);
      }
      const qualifiedNameParts: { parentType: string; parent: any; icon: any; }[] = [];
      if (found) {
        found.parents.forEach((parent, index) => {
          if (
            typeof parent === "object" &&
            asset.attributes.table &&
            asset.attributes.table.typeName === "AtlanView"
          ) {
            const rAsset = ASSET_TYPES_LIST.find(
              item => item.id.toLowerCase() === parent[1].toLowerCase()
            );
            if (rAsset) {
              qualifiedNameParts.push({
                parentType: rAsset.label,
                parent: qualifiedNamePathParts[index],
                icon: getIconForAssetType(rAsset.label.toLowerCase())
              });
            }
          } else if (typeof parent === "object") {
            const Asset = ASSET_TYPES_LIST.find(
              item => item.id.toLowerCase() === parent[0].toLowerCase()
            );
            qualifiedNameParts.push({
              parentType: Asset.label,
              parent: qualifiedNamePathParts[index],
              icon: getIconForAssetType(Asset.label.toLowerCase())
            });
          } else if (asset.typeName === "AtlanSavedQuery") {
            if (parent === "AtlanTable") {
              const rAsset = ASSET_TYPES_LIST.find(
                item => item.id.toLowerCase() === parent.toLowerCase()
              );
              qualifiedNameParts.push({
                parentType: rAsset.label,
                parent: qualifiedNamePathParts[index],
                icon: getIconForAssetType(rAsset.label.toLowerCase())
              });
            }
          } else if (
            getMin
              ? parent !== "AtlanIntegration" && parent !== "AtlanServer"
              : true
          ) {
            const rAsset = ASSET_TYPES_LIST.find(
              item => item.id.toLowerCase() === parent.toLowerCase()
            );
            qualifiedNameParts.push({
              parentType: rAsset.label,
              parent: qualifiedNamePathParts[index],
              icon: getIconForAssetType(rAsset.label.toLowerCase())
            });
          }
        });
        return qualifiedNameParts;
      }
      return [];
    }
    return [];
  };

  const getApplicableEntitiesForBmAttributes = () => {
    return (
      ASSET_TYPES_LIST.filter(entity => entity.id !== "AtlanServer") ||
      []
    );
  }

  return {
    ASSET_TYPES_LIST, getAssetNameFromQualfiedName, getAssetParents, getApplicableEntitiesForBmAttributes
  }
}