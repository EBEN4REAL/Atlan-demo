import { useAPI } from "~/api/useAPI";

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
  classificationName,
}: {
  cache: boolean;
  classificationName: string;
}) => {
  return useAPI("ARCHIVE_CLASSIFICATION", "DELETE", {
    cache,
    pathVariables: { classificationName },
  });
};

export const Classification = {
  getClassificationList,
  createClassification,
  updateClassification,
  archiveClassification,
};
