import { useAPI } from "~/api/useAPIv2";

const pingUser = () => {
  return useAPI("PING_USER", "GET", { cache: "true" });
};

export const Health = {
  pingUser,
};
