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
  UPDATE_USER_ROLE,
  ADD_USER_TO_GROUPS,
  RESEND_INVITATION_EMAIL,
  REVOKE_INVITATION,
  INVITE_USERS,
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
  const { data, mutate, error, isReady, isLoading } = useAPIv2(
    SIGN_OUT_ALL_SESSIONS,
    "POST",
    {
      pathVariables: { id },
    }
  );
  return { data, mutate, error, isReady, isLoading };
};
const SignOutSessionById = (id: string) => {
  const { data, mutate, error, isReady, isLoading } = useAPIv2(
    SIGN_OUT_SESSION_BY_ID,
    "POST",
    {
      pathVariables: { id },
    }
  );
  return { data, mutate, error, isReady, isLoading };
};
const GetUserAccessLogs = (id: string, params?: any, options?: any) => {
  return useAPI(GET_USER_ACCESS_LOGS, "GET", {
    params,
    options,
    pathVariables: { id },
  });
};
const UpdateUserV1 = (id: string, body?: any, options?: any) => {
  return getAxiosClient().post(
    getAPIPath(serviceAlias, `/users/${id}`),
    body,
    options
  );
};
const UpdateUser = (id: string, body) => {
  const { data, mutate, error, isReady, isLoading } = useAPIv2(
    UPDATE_USER,
    "POST",
    {
      body,
      pathVariables: { id },
    }
  );
  return { data, mutate, error, isReady, isLoading };
};
const UpdateUserRole = (id: string, body?: any) => {
  const { data, mutate, error, isReady, isLoading } = useAPIv2(
    UPDATE_USER_ROLE,
    "POST",
    {
      body,
      pathVariables: { id },
    }
  );
  return { data, mutate, error, isReady, isLoading };
};
const AddGroups = (id: string, body: any) => {
  const { data, mutate, error, isReady, isLoading } = useAPIv2(
    ADD_USER_TO_GROUPS,
    "POST",
    {
      body,
      pathVariables: { id },
    }
  );
  return { data, mutate, error, isReady, isLoading };
};
const ResendVerificationEmail = (id: string) => {
  const { data, mutate, error, isReady, isLoading } = useAPIv2(
    RESEND_INVITATION_EMAIL,
    "POST",
    {
      pathVariables: { id },
    }
  );
  return { data, mutate, error, isReady, isLoading };
};
const RevokeInvitation = (id: string) => {
  const { data, mutate, error, isReady, isLoading } = useAPIv2(
    REVOKE_INVITATION,
    "POST",
    {
      pathVariables: { id },
    }
  );
  return { data, mutate, error, isReady, isLoading };
};
const InviteUsers = (body: any) => {
  const { data, mutate, error, isReady, isLoading } = useAPIv2(
    INVITE_USERS,
    "POST",
    {
      body,
    }
  );
  return { data, mutate, error, isReady, isLoading };
};

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
  UpdateUserV1,
};
