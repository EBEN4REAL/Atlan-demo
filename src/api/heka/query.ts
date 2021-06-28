import { getAPIPath, getAxiosClient } from "~/api";
import { AxiosRequestConfig } from "axios";
const serviceAlias = "heka/api/query";


//heka/api/query/tenants/default/sql/stream?sql=c2VsZWN0ICogZnJvbSAiV0VCX1NBTEVTIiBsaW1pdCAyMDA%3D&defaultSchema=SNOWFLAKE_SAMPLE_DATA.TPCDS_SF10TCL&dataSourceName=default%2Fsnowflake%2Famit-test-connection


const getData = (params?: any, options?: AxiosRequestConfig) => {
    return getAxiosClient().get(getAPIPath(serviceAlias, "/sql/stream?sql=c2VsZWN0ICogZnJvbSAiV0VCX1NBTEVTIiBsaW1pdCAyMDA%3D&defaultSchema=SNOWFLAKE_SAMPLE_DATA.TPCDS_SF10TCL&dataSourceName=default%2Fsnowflake%2Famit-test-connection")), {
      params,
      ...options,
    };
};

export const Query = {
    getData,
  };
  