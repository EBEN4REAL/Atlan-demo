import { computed } from "vue"
import useSWRV, { IConfig } from "swrv";
import swrvState from "~/composables/utils/swrvState";
import { fetcher, getAPIPath } from "~/api";

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
    const apiList = computed(() => data.value?.results?.records ?? []);
    const AdminrolesId = computed(() => rolesData.value?.results.filter((role: any) => role.name === "$admin")[0].id ?? "")

    return {
        apiList,
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
        searchAPI,
        resetSearch
    }
}