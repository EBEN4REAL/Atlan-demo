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

export const Classification = {
  getClassificationList,
  createClassification,
};
