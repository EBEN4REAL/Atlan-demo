const DEV_PREFIX_URL = "https://bots.atlan.com";
/**
 * @param {string} apiPath - base path for api, should start with `/`
 * @param {string} overRideDevPrefix - if you want to override `DEV_PREFIX_URL` and use something else like localhost:5008
 */
export function getApiPath(apiPath) {
  const env = process.env.NODE_ENV;
  switch (env) {
    case "development":
      return `${DEV_PREFIX_URL}/api/${apiPath}`;
    default:
      return `/api/${apiPath}`;
  }
}

export const ServiceURL = (serviceName, tenant, path = "") => {
  return `${getApiPath(serviceName)}/tenants/${tenant}${path}`;
};

export const ServiceURLWithoutTenant = (serviceName, path = "") => {
  return `${getApiPath(serviceName)}${path}`;
};

export const getSSRApiPath = (domain, apiPath) => {
  const env = process.env.NODE_ENV;
  switch (env) {
    case "development":
      return `${DEV_PREFIX_URL}/api/${apiPath}`;
    default:
      return `${domain}/api/${apiPath}`;
  }
};
