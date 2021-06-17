import { useAPI } from "~/api/useAPI";
import swrvState from "~/composables/utils/swrvState";
import { computed } from "vue"
import { fetcher, getAPIPath } from "~/api";
import useSWRV, { IConfig } from "swrv";
import { DELETE_API_KEY, GET_API_KEYS } from "~/api/keyMaps/auth/apiKeys";

export default function useAPIKeys(config?: IConfig) {
    const param = {
        limit: 100,
        offset: 0,
        filter: {},
        sort: "-created_at",
    };

    const {
        data,
        error,
        mutate: mutateApiList,
        isValidating,
    } = useSWRV(
        [
            getAPIPath("auth", `/accesstokens`),
            param,
            {}
        ],
        fetcher,
        config,
    );

    const {
        data: rolesData,
        error: rolesError,
        mutate: getRoleList,
        isValidating: isRoleValidate,
    } = useSWRV(
        [
            getAPIPath("auth", `/roles`),
            param,
            {}
        ],
        fetcher,
        config,
    );

    const createNewAPI = (body: any) => {
        useAPI(GET_API_KEYS, "POST", { cache: false, body });
    }

    const deleteAPIKey = (id: string) => {
        useAPI(DELETE_API_KEY, "POST", { pathVariables: { id }, cache: false });
    }

    const getUpdatedAPI = () => {
        mutateApiList();
    }

    const searchAPI = (searchText: string) => {
        param.filter = searchText.length ? { name: { $ilike: `${searchText}%` } } : {};
        mutateApiList();
    }

    const resetSearch = () => {
        param.filter = {};
        mutateApiList();
    }

    const { state, STATES } = swrvState(data, error, isValidating);
    const { state: roleState, STATES: roleSTATES } = swrvState(rolesData, rolesError, isRoleValidate);
    var apiList = computed(() => data.value?.results?.records ?? []);
    const AdminrolesId = computed(() => rolesData.value?.results.filter((role: any) => role.name === "$admin")[0].id ?? "")

    return {
        apiList: apiList,
        mutateApiList,
        state,
        STATES,
        rolesData,
        getUpdatedAPI,
        getRoleList,
        isRoleValidate,
        AdminrolesId,
        roleState,
        roleSTATES,
        createNewAPI,
        deleteAPIKey,
        searchAPI,
        resetSearch
    }
}