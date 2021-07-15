import { useAPI as useAPIV2 } from "~/api/useAPIv2";

const getLineageAPI = ({
  cache,
  guid,
  depth,
  direction,
}: {
  cache: string | undefined;
  guid: string;
  depth: number;
  direction: string;
}) => {
  return useAPIV2("GET_LINEAGE", "GET", {
    cache,
    pathVariables: { guid, depth, direction },
  });
};

export const Lineage = {
  getLineageAPI,
};
