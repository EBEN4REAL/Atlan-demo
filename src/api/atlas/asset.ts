import { useAPI } from "~/api/useAPI";
import { getBasicQuery } from "~/api/atlas/utils";
const basicSearch = ({
  cache,
  options = {
    searchType: "BASIC",
  },
}: {
  cache: boolean;
  options: any;
}) => {
  const params = getBasicQuery(options);
  return useAPI("BASIC_SEARCH", "POST", {
    params,
    cache,
  });
};

export const Asset = {
  basicSearch,
};
