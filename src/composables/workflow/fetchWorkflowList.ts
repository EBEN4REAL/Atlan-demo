import swrvState from '../utils/swrvState';
import useSWRV from 'swrv';
import { Workflows, URL } from '~/api/argo/workflow';

export default function fetchWorkflowList(cachekey: string, dependent: any, paramsdefault: any, isArchive: boolean) {
    const { data, error, mutate, isValidating } = useSWRV([cachekey, paramsdefault.value, {}], () => {
        if (dependent.value && isArchive) {
            return Workflows.ArchivedList(paramsdefault.value);
        }
        else if (dependent.value) {
            return Workflows.List(paramsdefault.value);
        }
        else {
            return {}
        }
    }, {
        revalidateOnFocus: false,
        dedupingInterval: 1,
    });

    const phase = (item: any) => {
        return item?.status?.phase;
    };

    const { state, STATES } = swrvState(data, error, isValidating);
    return {
        data,
        error,
        state,
        STATES,
        mutate,
        phase,
    }
}