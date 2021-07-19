import { useAPI } from "~/api/useAPI";
import { Ref } from "vue";

const getClassificationList = ({ cache }: { cache: boolean }) => {
  return useAPI("GET_CLASSIFICATION_LIST", "GET", {
    cache,
  });
};

const createClassification = ({
  cache,
  payload,
}: {
  cache: boolean;
  payload: {
    attributeDefs: Array<any>;
    description: string;
    name: string;
    superTypes: Array<any>;
  };
}) => {
  return useAPI("CREATE_CLASSIFICATION", "POST", {
    cache,
    body: payload,
  });
};
const updateClassification = ({
  cache,
  params,
}: {
  cache: boolean;
  params: any;
}) => {
  console.log(params, "request");
  const payload = {
    classificationDefs: [{ ...params }],
  };
  return useAPI("UPDATE_CLASSIFICATION", "PUT", {
    cache,
    body: payload,
  });
};

const archiveClassification = ({
  cache,
  typeName,
}: {
  cache: string | undefined;
  typeName: string;
}) => {
  return useAPI("ARCHIVE_CLASSIFICATION", "DELETE", {
    cache,
    pathVariables: { typeName },
  });
};

const linkClassification = ({
  cache,
  entityGuid,
  payload,
}: {
  cache: string | undefined;
  entityGuid: boolean;
  payload: Ref<{
    attributes: Object;
    propagate: boolean;
    removePropagationsOnEntityDelete: boolean;
    typeName: string;
    validityPeriods: Array<any>;
  }>;
}) => {
  return useAPI("LINK_CLASSIFICATION", "POST", {
    cache,
    body: payload,
    pathVariables: { entityGuid },
  });
};
export const Classification = {
  linkClassification,
  getClassificationList,
  createClassification,
  updateClassification,
  archiveClassification,
};
