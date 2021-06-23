import { useAPI } from "~/api/useAPIv2";

const pingHeka = () => {
  return useAPI("PING_HEKA", "GET", { cache: "true" });
};
const pingUser = () => {
  return useAPI("PING_USER", "GET", { cache: "true" });
};

export const Health = {
  pingHeka,
  pingUser,
};
