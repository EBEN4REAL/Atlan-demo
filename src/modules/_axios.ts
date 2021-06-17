import { UserModule } from "~/types/vitessg";
import { getEnv, getBasePath } from "~/modules/__env";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import VueAxios from "vue-axios";
import { cacheAdapterEnhancer } from "axios-extensions";

const authInterceptor = (app: any) => {
  return (config: AxiosRequestConfig) => {
    config.headers[
      "Authorization"
    ] = `Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ6N3R2VlY0X1R1RWVOaU15UEx3RVE3YmVxVVRkMnE5LVkyc2VtczFDR1k0In0.eyJleHAiOjE2MjM5NjQzNjYsImlhdCI6MTYyMzk0Mjc2NiwiYXV0aF90aW1lIjoxNjIzOTIxMDczLCJqdGkiOiI0MmMzOTQzMi02NDkzLTQxNmMtOTBiMS02MWI0Njc0NzZmZGIiLCJpc3MiOiJodHRwczovL2JvdHMuYXRsYW4uY29tL2F1dGgvcmVhbG1zL2RlZmF1bHQiLCJhdWQiOlsicmVhbG0tbWFuYWdlbWVudCIsImFjY291bnQiXSwic3ViIjoiNTRlMDNjMTAtYTlhYy00ZDYwLWJjZjgtNWU1OGUyM2UzMTUzIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYXRsYW4td2ViIiwic2Vzc2lvbl9zdGF0ZSI6IjEwY2FmOWJmLTg0ZGQtNGRhNy1hZGEzLTU0MmE3NjMzNGFjMCIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiJHN0ZXdhcmQiLCIkY2xvdWQiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIiwiJG1lbWJlciIsIiRhZG1pbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7InJlYWxtLW1hbmFnZW1lbnQiOnsicm9sZXMiOlsidmlldy1pZGVudGl0eS1wcm92aWRlcnMiLCJ2aWV3LXJlYWxtIiwibWFuYWdlLWlkZW50aXR5LXByb3ZpZGVycyIsImltcGVyc29uYXRpb24iLCJyZWFsbS1hZG1pbiIsImNyZWF0ZS1jbGllbnQiLCJtYW5hZ2UtdXNlcnMiLCJxdWVyeS1yZWFsbXMiLCJ2aWV3LWF1dGhvcml6YXRpb24iLCJxdWVyeS1jbGllbnRzIiwicXVlcnktdXNlcnMiLCJtYW5hZ2UtZXZlbnRzIiwibWFuYWdlLXJlYWxtIiwidmlldy1ldmVudHMiLCJ2aWV3LXVzZXJzIiwidmlldy1jbGllbnRzIiwibWFuYWdlLWF1dGhvcml6YXRpb24iLCJtYW5hZ2UtY2xpZW50cyIsInF1ZXJ5LWdyb3VwcyJdfSwiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSBlbWFpbCIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJyb2xlcyI6WyIkc3Rld2FyZCIsIiRjbG91ZCIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCIkbWVtYmVyIiwiJGFkbWluIl0sIm5hbWUiOiJOaXR5YW5hbiBHb2hhaW4iLCJncm91cHMiOlsiYmFtIiwiZGEiXSwicmVhbG0iOiJkZWZhdWx0IiwicHJlZmVycmVkX3VzZXJuYW1lIjoibml0eWFuYW5kYV8xIiwiZ2l2ZW5fbmFtZSI6Ik5pdHlhbmFuIiwiZmFtaWx5X25hbWUiOiJHb2hhaW4iLCJ1c2VySWQiOiI1NGUwM2MxMC1hOWFjLTRkNjAtYmNmOC01ZTU4ZTIzZTMxNTMiLCJlbWFpbCI6Im5pdHlhbmFuZGFAYXRsYW4uY29tIiwidXNlcm5hbWUiOiJuaXR5YW5hbmRhXzEifQ.UGlaj8Vn0PsrA0veGdEuRMfYmtKSrQTPCk5MJAqOATMaE3JB58dNZ7-xhLGWa6CC9JxucH90uXCmYwgubt1nYFGt4CsdkQJPODlwj0YcMdVfVT2DNg9onWZpCw4zN5pGGsYRDgqDm4d1fDz9PlM-yrntHNK3tlWiNv5s-N-vun-Zs--Ye2n8_pRCM2X3KRT5IPYGqFLBWWy9a-wAS2anzETn5hC0nUrbP5QzasAds8ExsDQbl6dXPdl2QuxovHeGGUi7jETAt6_FKesp4ElBAHIucNMYea7OFoF3DMF9aCPC98prs3QNOf8feWeedoWrWh676AJWdptao1uAG5Y9tQ
    `;
    return config;
  };
};

export let axiosClient: AxiosInstance = null;

const errorInterceptor = (error: any) => {
  // check if it's a server error
  if (!error.response) {
    return Promise.reject(error);
  }
  // all the other error responses
  switch (error.response.status) {
    case 400:
      console.error(error.response.status, error.message);
      break;
    case 401: // authentication error, logout the user
      localStorage.removeItem("token");
      break;
    default:
      console.error(error.response.status, error.message);
  }
  return Promise.reject(error);
};

// Interceptor for responses
const responseInterceptor = (response: any) => {
  // switch (response.status) {
  //   case 200:
  //     // yay!
  //     break;
  //   // any other cases
  //   default:
  //   // default case
  // }

  return response.data;
};

// export function getBasePath() {
//   const env = process.env.NODE_ENV;
//   const devBaseUrl = getEnv().DEV_API_BASE_URL;
//   switch (env) {
//     case "production":
//       return `${window.location.origin}/api`;
//     case "staging":
//       return `${devBaseUrl}/api`;
//     default:
//       return `${devBaseUrl}/api`;
//   }
// }

// https://github.com/antfu/vite-plugin-pwa#automatic-reload-when-new-content-available
export const install: UserModule = ({ app }) => {
  const cacheConfig = {
    enabledByDefault: false,
    cacheFlag: "cache",
  };
  axiosClient = axios.create({
    baseURL: `${getBasePath()}/api`,
    timeout: getEnv().DEFAULT_REQUEST_TIMEOUT,
    headers: {
      "Content-Type": "application/json",
    },
    adapter: cacheAdapterEnhancer(axios.defaults.adapter, cacheConfig),
  });
  axiosClient.interceptors.request.use(authInterceptor(app));
  axiosClient.interceptors.response.use(responseInterceptor, errorInterceptor);

  app.config.globalProperties.$axios = axios;

  app.use(VueAxios, axiosClient);
};
