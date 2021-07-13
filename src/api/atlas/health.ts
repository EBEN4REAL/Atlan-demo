import { useAPI } from "~/api/useAPI";

const pingUser = () => {
  return useAPI("PING_USER", "GET", { cache: "true" });
};

export const Health = {
  pingUser,
};
