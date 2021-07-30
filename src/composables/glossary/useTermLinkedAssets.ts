import { ref } from "vue";
import { useAPI } from "~/api/useAPI"

import { GET_TERM_LINKED_ASSETS } from "~/api/keyMaps/glossary"

import { projection } from "~/api/atlas/utils";
import { BaseAttributes, BasicSearchAttributes } from '~/constant/projection';

import { Components } from '~/api/atlas/client'

export default function useTermLinkedAssets() {
  const termQualifiedName = ref<string>();
  const requestQuery = ref<string>();

  const body = ref({
    termName: termQualifiedName.value,
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
      // "files",
      // "table",
      // "database",
      "atlanSchema",
      // "profileSchedule",
      // "isProfileScheduled",
      // "order",
      // "extra",
      // "metadata",
      // "commits",
      "assetStatus",
      ...BaseAttributes,
      ...BasicSearchAttributes
    ],
    query: requestQuery
  });

  const { data: linkedAssets, error, isValidating: isLoading, mutate } = useAPI<Components.Schemas.AtlasSearchResult>(GET_TERM_LINKED_ASSETS, 'POST', {
    cache: true,
    body,
    dependantFetchingKey: termQualifiedName,
    options: {
      revalidateOnFocus: false
    }
  })

  const fetchLinkedAssets = (termName: string, query?:string) => {
    body.value.termName = termName;
    termQualifiedName.value = termName;

    body.value.query =  query ?? '';
    requestQuery.value = query ?? '';

    if (termName || query)
      mutate();
  }

  return {
    linkedAssets,
    error,
    isLoading,
    fetchLinkedAssets,
  };
}
