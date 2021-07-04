import { ConnectionType } from "~/types/atlas/connection";

export type Status = {
  isValidating?: boolean,
  isLoading?: boolean,
  isSuccess?: boolean,
  isStaleError?: boolean,
  isError?: boolean,
  error: any
}

export interface State {
  data: any;
  status: Status
}

export const state: State = {
  data: {},
  status: {
    isLoading: false,
    isSuccess: false,
    isStaleError: false,
    isError: false,
    error: null,
    isValidating: false
  }
};
