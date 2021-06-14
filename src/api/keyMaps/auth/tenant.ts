import { getAPIPath } from "~/api";
import { getSSRApiPath, ServiceURL } from "~/services";

export const GET_TENANT = "GET_TENANT";
export const TEST_SMTP_CONFIG = "TEST_SMTP_CONFIG";
export const UPDATE_SMTP = "UPDATE_SMTP";

<<<<<<< HEAD
const tenantMap: Record<string, string> = {
  [GET_TENANT]: getAPIPath("auth", ""),
  [TEST_SMTP_CONFIG]: getAPIPath("auth", "/smtp/test"),
  [UPDATE_SMTP]: getAPIPath("auth", ""),
};
=======
const tenantMap: Record<string, (...params:any) => string> = {
    [GET_TENANT]: () =>  getAPIPath('auth', "")
}
>>>>>>> main

export default tenantMap;
