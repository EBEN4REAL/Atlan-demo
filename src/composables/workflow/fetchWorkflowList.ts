import useSWRV from 'swrv';
import swrvState from '../utils/swrvState';
import { Workflows, URL } from '~/api/argo/workflow';

export default function fetchWorkflowList(cachekey: string, dependent: any, paramsdefault: any, isArchive: boolean) {
    const { data, error, mutate, isValidating } = useSWRV([cachekey, paramsdefault?.value, {}], () => {
        if (dependent.value && isArchive) {
            return Workflows.ArchivedList(paramsdefault.value);
        }
        if (dependent.value) {
            return Workflows.List(paramsdefault.value);
        }
        
            return {}
        
    }, {
        revalidateOnFocus: false,
        dedupingInterval: 1,
    });

    const phase = (item: any) => item?.status?.phase;

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