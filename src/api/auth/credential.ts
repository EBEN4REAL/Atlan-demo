import { Ref } from 'vue'
import { AxiosRequestConfig } from "axios";
import { Components } from "./client";
import { useAPIAsyncState, useAPIPromise } from '../useAPI';
import { KeyMaps } from '../keyMap';
import { AsyncStateOptions, useAsyncState } from '@vueuse/core'




// TODO remove
// const UpdateCredential = (
//   id: String,
//   body?: any,
//   options?: AxiosRequestConfig
// ) => getAxiosClient().post(
//   getAPIPath(serviceAlias, `${URL.UPDATECRDENTIAL}/${id}`),
//   body,
//   options
// );

const UpdateCredential = (
  id: string,
  body?: any,
  options?: AxiosRequestConfig,
) => useAPIAsyncState<any>(KeyMaps.credential.CREDENTIAL_TEST_BY_ID, "POST", {
  options,
  pathVariables: { id }
});



const TestCredential = (
  body?: Ref<Components.Schemas.ConnectionTest>,
  options?: AxiosRequestConfig,
  asyncOpts?: AsyncStateOptions

) => useAPIAsyncState<any>(KeyMaps.credential.CREDENTIAL_TEST, "POST", {
  body,
  options,
}, asyncOpts);

const TestCredentialByID = (
  id: string,
  options?: AxiosRequestConfig,
  asyncOpts?: AsyncStateOptions | undefined
) => useAPIAsyncState<any>(KeyMaps.credential.CREDENTIAL_TEST_BY_ID, "POST",
  {
    options,
    pathVariables: { id }
  }, asyncOpts);

// const TestCredentialByID = (
//   id: string,
//   options?: AxiosRequestConfig,
// ) => useAPIPromise(KeyMaps.credential.CREDENTIAL_TEST_BY_ID({ id }), "POST", {
//   options,
// });


// eslint-disable-next-line import/prefer-default-export
export const Credential = {
  UpdateCredential,
  TestCredential,
  TestCredentialByID,
};
