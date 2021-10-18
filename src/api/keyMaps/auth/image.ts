import { getAPIPath } from "~/api";

export const UPLOAD_IMAGE = "UPLOAD_IMAGE";
export const GET_IMAGE = "GET_IMAGE";


const avatarMap: Record<string, (...params: any) => string> = {
  [UPLOAD_IMAGE]: () => getAPIPath("service", "/images"),
  [GET_IMAGE]: ({ id }) => getAPIPath("service", `/images/${id}`),
};

export default avatarMap;
