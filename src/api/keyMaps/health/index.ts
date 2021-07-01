import { getHealthPath } from "~/api";

export const PING_USER = "PING_USER";

const health: Record<string, (...params: any) => string> = {
  [PING_USER]: () => getHealthPath("auth", "/debug/health"),
};

export default health;
