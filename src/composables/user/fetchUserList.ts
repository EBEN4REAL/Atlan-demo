import swrvState from '../utils/swrvState';
import useSWRV from 'swrv';
import { Components } from '~/api/auth/client';

import { User, URL } from '~/api/auth/user';
import { computed } from 'vue';

export default function fetchUserList(dependent: any, paramsdefault?: any) {



    const { data, error, mutate, isValidating } = useSWRV([URL.UserList, paramsdefault?.value, {}], () => {
        if (dependent.value) {
            return User.ListV2(paramsdefault?.value);
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