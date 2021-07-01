import { getAPIPath } from "~/api";

export const UPLOAD_IMAGE = "UPLOAD_IMAGE";
export const GET_IMAGE = "GET_IMAGE";


const avatarMap: Record<string, (...params: any) => string> = {
  [UPLOAD_IMAGE]: () => getAPIPath("auth", "/images"),
  [GET_IMAGE]: ({ id }) => getAPIPath("auth", `/images/${id}`),
};

export default avatarMap;
