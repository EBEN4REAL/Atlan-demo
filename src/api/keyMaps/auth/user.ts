import { getAPIPath } from "~/api";

export const LIST_USERS = "LIST_USERS";
export const GET_USER_SESSIONS = "GET_USER_SESSIONS";
export const SIGN_OUT_ALL_SESSIONS = "SIGN_OUT_ALL_SESSIONS";
export const SIGN_OUT_SESSION_BY_ID = "SIGN_OUT_SESSION_BY_ID";
export const GET_USER_ACCESS_LOGS = "GET_USER_ACCESS_LOGS";
export const GET_USER = "GET_USER";
export const UPDATE_USER = "UPDATE_USER";

const userMap: Record<string, (...params: any) => string> = {
  [LIST_USERS]: () => getAPIPath("auth", "/users"),
  [GET_USER]: () => getAPIPath("auth", "/users"),
  [UPDATE_USER]: ({ id }) => getAPIPath("auth", `/users/${id}`),
  [GET_USER_SESSIONS]: ({ id }) => getAPIPath("auth", `/users/${id}/sessions`),
  [SIGN_OUT_ALL_SESSIONS]: ({ id }) =>
    getAPIPath("auth", `/users/${id}/sessions/delete`),
  [SIGN_OUT_SESSION_BY_ID]: ({ id }) =>
    getAPIPath("auth", `/users/sessions/${id}/delete`),
  [GET_USER_ACCESS_LOGS]: ({ id }) => getAPIPath("auth", `/users/${id}/events`),
};

export default userMap;
