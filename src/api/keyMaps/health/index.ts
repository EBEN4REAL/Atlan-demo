import { getHealthPath } from "~/api";

export const PING_HEKA = "PING_HEKA";
export const PING_USER = "PING_USER";

const health: Record<string, (...params: any) => string> = {
  [PING_HEKA]: () => getHealthPath("heka/api/query", "/debug/health"),
  [PING_USER]: () => getHealthPath("auth", "/debug/health"),
};

export default health;
