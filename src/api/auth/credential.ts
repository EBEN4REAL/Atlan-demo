import { Ref } from 'vue'
import { AxiosRequestConfig } from "axios";
import { AsyncStateOptions } from '@vueuse/core'
import { Components } from "./client";
import { useAPIAsyncState } from '../../services/api/useAPI';
import { KeyMaps } from '../keyMap';


const UpdateCredential = (
  id: string,
  body?: any,
  options?: AxiosRequestConfig,
  asyncOpts?: AsyncStateOptions
) => useAPIAsyncState<any>(KeyMaps.credential.UPDATE_CREDENTIAL_BY_ID, "POST", {
  options,
  body,
  pathVariables: { id }
}, asyncOpts);

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


// eslint-disable-next-line import/prefer-default-export
export const Credential = {
  UpdateCredential,
  TestCredential,
  TestCredentialByID,
};
