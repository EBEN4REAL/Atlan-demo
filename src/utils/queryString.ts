export const generateQueryStringParamsFromObj = (params = {}) => {
  const queryString = Object.keys(params)
    .map((key) => {
      if (!Array.isArray(params[key])) return `${key}=${params[key]}`;
      else {
        return params[key].map((val) => `${key}=${val}`).join("&");
      }
    })
    .join("&");
  return queryString;
};
