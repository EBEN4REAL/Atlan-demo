import { computed, ComputedRef, Ref, ref, watch } from 'vue';
import useAssetItemConstants from '~/composables/asset/useAssetItemConstants';

// const newTypes = ["Asset", "AtlanAsset", "AtlasServer", "Bot", "Catalog", "Column", "Connection", "Credential", "Database", "DataSet", "ddl", "Infrastructure", "Internal", "Job", "MaterialisedView", "Path", "Procedure", "Process", "ProcessExecution", "Referenceable", "Schema", "Table", "TableauDashboard", "TableauProject", "TableauSite", "TableauWorkbook", "TableauWorksheet", "TablePartition", "View"]

const ASSET_TYPES_LIST = [
  {
    "id": "Asset",
    "label": "Asset",
    "parents": [],
    "childrens": []
  },
  {
    "id": "AtlanAsset",
    "label": "AtlanAsset",
    "parents": [],
    "childrens": []
  },
  {
    "id": "AtlasServer",
    "label": "AtlasServer",
    "parents": [],
    "childrens": []
  },
  {
    "id": "Bot",
    "label": "Bot",
    "parents": [],
    "childrens": []
  },
  {
    "id": "Catalog",
    "label": "Catalog",
    "parents": [],
    "childrens": []
  },
  {
    "id": "Column",
    "label": "Column",
    "parents": [],
    "childrens": []
  },
  {
    "id": "Connection",
    "label": "Connection",
    "parents": [],
    "childrens": []
  },
  {
    "id": "Credential",
    "label": "Credential",
    "parents": [],
    "childrens": []
  },
  {
    "id": "Database",
    "label": "Database",
    "parents": [],
    "childrens": []
  },
  {
    "id": "DataSet",
    "label": "DataSet",
    "parents": [],
    "childrens": []
  },
  {
    "id": "ddl",
    "label": "ddl",
    "parents": [],
    "childrens": []
  },
  {
    "id": "Infrastructure",
    "label": "Infrastructure",
    "parents": [],
    "childrens": []
  },
  {
    "id": "Internal",
    "label": "Internal",
    "parents": [],
    "childrens": []
  },
  {
    "id": "Job",
    "label": "Job",
    "parents": [],
    "childrens": []
  },
  {
    "id": "MaterialisedView",
    "label": "MaterialisedView",
    "parents": [],
    "childrens": []
  },
  {
    "id": "Path",
    "label": "Path",
    "parents": [],
    "childrens": []
  },
  {
    "id": "Procedure",
    "label": "Procedure",
    "parents": [],
    "childrens": []
  },
  {
    "id": "Process",
    "label": "Process",
    "parents": [],
    "childrens": []
  },
  {
    "id": "ProcessExecution",
    "label": "ProcessExecution",
    "parents": [],
    "childrens": []
  },
  {
    "id": "Referenceable",
    "label": "Referenceable",
    "parents": [],
    "childrens": []
  },
  {
    "id": "Schema",
    "label": "Schema",
    "parents": [],
    "childrens": []
  },
  {
    "id": "Table",
    "label": "Table",
    "parents": [],
    "childrens": []
  },
  {
    "id": "TableauDashboard",
    "label": "TableauDashboard",
    "parents": [],
    "childrens": []
  },
  {
    "id": "TableauProject",
    "label": "TableauProject",
    "parents": [],
    "childrens": []
  },
  {
    "id": "TableauSite",
    "label": "TableauSite",
    "parents": [],
    "childrens": []
  },
  {
    "id": "TableauWorkbook",
    "label": "TableauWorkbook",
    "parents": [],
    "childrens": []
  },
  {
    "id": "TableauWorksheet",
    "label": "TableauWorksheet",
    "parents": [],
    "childrens": []
  },
  {
    "id": "TablePartition",
    "label": "TablePartition",
    "parents": [],
    "childrens": []
  },
  {
    "id": "View",
    "label": "View",
    "parents": [],
    "childrens": []
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
      ASSET_TYPES_LIST.filter(entity => entity.id !== "AtlasServer") ||
      []
    );
  }

  return {
    ASSET_TYPES_LIST, getAssetNameFromQualfiedName, getAssetParents, getApplicableEntitiesForBmAttributes
  }
}