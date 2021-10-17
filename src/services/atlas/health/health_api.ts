import { useAPI } from "~/services/api/useAPI";

const pingUser = () => useAPI("PING_USER", "GET", { cache: "true" });

export const Health = {
  pingUser,
};
