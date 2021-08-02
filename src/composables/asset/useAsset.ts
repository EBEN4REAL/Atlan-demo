import { projection } from "~/api/atlas/utils";
import { BaseAttributes, BasicSearchAttributes } from '~/constant/projection';
import { Search } from "~/api/atlas/search";
import { watch, ref } from "vue";

export default function useAsset({
  entityId,
  isUpdateStatus = true,
  fetchRelationships = false,
  fetchAssetByAttibute = "__guid",
}) {
  const entityFilters = {
    condition: "AND",
    criterion: [
      {
        attributeName: fetchAssetByAttibute || "__guid",
        attributeValue: entityId,
        operator: "eq",
      },
    ],
  };

  const options = {
    typeName: "AtlanAsset",
    excludeDeletedEntities: true,
    includeClassificationAttributes: true,
    includeSubClassifications: true,
    includeSubTypes: true,
    attributes: [
      ...projection,
      //   ...BUSINESS_METADATA_GET_ATTRIBUTE_PROJECTION,
      //   ...CUSTOM_RELATIONSHIP_ATTRIBUTES_TABLE,
      //   ...CUSTOM_RELATIONSHIP_ATTRIBUTES_COLUMN,
      "files",
      "table",
      "database",
      "atlanSchema",
      "profileSchedule",
      "isProfileScheduled",
      "order",
      "extra",
      "metadata",
      "commits",
      "assetStatus",
      "__modifiedBy",
      ...BaseAttributes,
      ...BasicSearchAttributes
    ],
    entityFilters,
  };
  console.log("here", options, Search.BasicSearch);

  const { response, error, mutate, isValidating } = Search.BasicSearch(
    options,
    {},
    {
      revalidateOnFocus: false,
    }
  );
  return {
    response,
    error,
    loading: isValidating,
    mutate,
  };
}
