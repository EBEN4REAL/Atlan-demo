import { CancelTokenSource } from "axios";

export type Status = {
  loading: boolean;
  error?: any;
  cancelToken?: CancelTokenSource;
};
