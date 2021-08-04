import useSWRV, { IConfig } from "swrv";
import swrvState from "~/composables/utils/swrvState";
import { fetcher, getAPIPath } from "~/api";

export default function useAPuseAssetRelationShip(guid: string, config?: IConfig) {
    const attributes = [
        "name",
        "description",
        "userDescription",
        "customDescription",
        "dataType",
        "isPrimary",
        "order",
        "metadata",
        "relativePinOrder",
        "primary key",
        "foreign key",
        "tenantId"
    ]
    const paramsObj: any = {
        limit: 1000,
        offset: 0,
        relation: "columns",
        includeClassificationAttributes: true,
        guid,
        excludeDeletedEntities: true,
    };

    const finalParams = new URLSearchParams();
    const keys = Object.keys(paramsObj);
    attributes.forEach((val: string) => {
        finalParams.append("attributes", val);
    });
    keys.forEach(key => {
        finalParams.append(key, paramsObj[key]);
    });

    console.log(finalParams.toString())

    const {
        data,
        error,
        mutate,
        isValidating,
    } = useSWRV(
        [
            getAPIPath("auth/atlas", `/search/relationship?${finalParams.toString()}`),
            {},
            {}
        ],
        fetcher,
        config,
    );

    const { state, STATES } = swrvState(data, error, isValidating);
    return {
        relationship: data,
        mutate,
        state,
        STATES,
    }
}