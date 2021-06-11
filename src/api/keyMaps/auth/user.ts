import { getAPIPath } from "~/api";

export const LIST_USERS = 'LIST_USERS'
export const GET_USER = 'GET_USER'

const userMap: Record<string, string> = {
    [LIST_USERS]: getAPIPath("auth", "/users/v2"),
    [GET_USER]: getAPIPath("auth", "/users/example"),
}

export default userMap;