import { useAPI } from "~/api/useAPIv2";

const pingHeka = () => {
  return useAPI("PING_HEKA", "GET", {});
};
const pingUser = () => {
  return useAPI("PING_USER", "GET", {});
};

export const Health = {
  pingHeka,
  pingUser,
};
