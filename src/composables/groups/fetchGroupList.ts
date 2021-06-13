import swrvState from '../utils/swrvState';
import useSWRV from 'swrv';
import { Components } from '~/api/auth/client';

import { Group, URL } from '~/api/auth/group';
import { computed } from 'vue';

export default function fetchGroupList(dependent: any, paramsdefault?: any) {

    const { data, error, mutate, isValidating } = useSWRV([URL.GroupList, paramsdefault?.value, {}], () => {
        if (dependent.value) {
            return Group.ListV2(paramsdefault?.value);
        }
        else {
            return {}
        }
    }, {
        revalidateOnFocus: false,
    });
    const { state, STATES } = swrvState(data, error, isValidating);

    const list = computed(() => {
        return data.value?.records;
    });
    const total = computed(() => {
        return data.value?.total_record;
    });
    const filtered = computed(() => {
        return data.value?.filter_record;
    });

    return {
        list,
        filtered,
        total,
        data,
        error,
        state,
        STATES,
        mutate
    }
}