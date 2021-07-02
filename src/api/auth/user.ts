import { getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
import { useAPI } from "~/api/useAPI";
import { useAPI as useAPIv2 } from "~/api/useAPIv2";
import {
  GET_USER_SESSIONS,
  SIGN_OUT_ALL_SESSIONS,
  SIGN_OUT_SESSION_BY_ID,
  GET_USER_ACCESS_LOGS,
  UPDATE_USER,
} from "~/api/keyMaps/auth/user";
const serviceAlias = "auth";

export const URL = {
  UserList: "/users",
};

const ListV2 = (params?: any, options?: AxiosRequestConfig) => {
  return getAxiosClient().get(getAPIPath(serviceAlias, URL.UserList), {
    params,
    ...options,
  });
};
//Sessions
const GetUserSessions = (id: string, params?: any, options?: any) => {
  return useAPI(GET_USER_SESSIONS, "GET", {
    params,
    options,
    pathVariables: { id },
  });
};
const SignOutAllSessions = (id: string) => {
  return getAxiosClient().post(
    getAPIPath(serviceAlias, `/users/${id}/sessions/delete`)
  );
  // return useAPI(SIGN_OUT_ALL_SESSIONS, "POST", {
  //   params,
  //   options,
  //   pathVariables: { id },
  //   cache: false,
  // });
};
const SignOutSessionById = (id: string) => {
  return getAxiosClient().post(
    getAPIPath(serviceAlias, `/users/sessions/${id}/delete`)
  );
  // return useAPI(SIGN_OUT_SESSION_BY_ID, "POST", {
  //   params,
  //   options,
  //   pathVariables: { id },
  //   cache: false,
  // });
};
const GetUserAccessLogs = (id: string, params?: any, options?: any) => {
  return useAPI(GET_USER_ACCESS_LOGS, "GET", {
    params,
    options,
    pathVariables: { id },
  });
};
const UpdateUser = (id: string, body?: any, options?: any) => {
  return getAxiosClient().post(
    getAPIPath(serviceAlias, `/users/${id}`),
    body,
    options
  );
};
const UpdateUserV2 = (id: string, body, options) => {
  const { data, error, isLoading } = useAPIv2(UPDATE_USER, "POST", {
    // const { data, mutate, error, isReady } = useAPIv2(UPDATE_USER, "POST", {
    cache: "",
    options,
    body,
    pathVariables: { id },
  });
  return { data, error, isLoading };
  // return { data, mutate, error, isReady };
};
const UpdateUserRole = (id: string, body?: any, options?: any) => {
  return getAxiosClient().post(
    getAPIPath(serviceAlias, `/users/${id}/roles/update`),
    body,
    options
  );
};
const AddGroups = (userId: string, body: any, options?: AxiosRequestConfig) => {
  return getAxiosClient().post(
    getAPIPath(serviceAlias, `/users/${userId}/groups`),
    body,
    options
  );
};
const ResendVerificationEmail = (
  userId: string,
  body?: any,
  options?: AxiosRequestConfig
) => {
  return getAxiosClient().post(
    getAPIPath(serviceAlias, `/users/${userId}/resendinvite`),
    body,
    options
  );
};
// revoking invitation per se is not possible currently, so we will delete the invited user instead. Important to never use this endpoint for active (enabled/disabled) users. Just using this for invites.
const RevokeInvitation = (
  userId: string,
  body?: any,
  options?: AxiosRequestConfig
) => {
  return getAxiosClient().post(
    getAPIPath(serviceAlias, `/users/${userId}/delete`),
    body,
    options
  );
};
const InviteUsers = (body?: any, options?: AxiosRequestConfig) =>
  getAxiosClient().post(getAPIPath(serviceAlias, `/users`), body, options);

export const User = {
  ListV2,
  GetUserSessions,
  SignOutAllSessions,
  SignOutSessionById,
  GetUserAccessLogs,
  UpdateUser,
  UpdateUserRole,
  AddGroups,
  ResendVerificationEmail,
  RevokeInvitation,
  InviteUsers,
  UpdateUserV2,
};
