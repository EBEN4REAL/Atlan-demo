import { computed, ComputedRef, Ref, ref, watch } from 'vue';
import { Components } from '~/api/atlas/client';
import { SearchBasic, URL } from '~/api/atlas/searchbasic';
import { BaseAttributes, ConnectionAttributes } from '~/constant/projection';
import { ConnectionType } from '~/types/atlas/connection';
import swrvState from '../utils/swrvState';
import useSWRV from 'swrv';
import LocalStorageCache from 'swrv/dist/cache/adapters/localStorage'

export default function fetchSearchList(dependent: any, body: Ref<Components.Schemas.SearchParameters>) {

    const { data, error, mutate, isValidating } = useSWRV([URL.SEARCHBASIC, body.value, {}], () => {
        if (dependent.value) {
            return SearchBasic.Basic(body.value, {})
        }
        else {
            return {}
        }
    }, {
        cache: new LocalStorageCache(),
        revalidateOnFocus: false,
        dedupingInterval: 1,
    });
    const { state, STATES } = swrvState(data, error, isValidating);
    const totalCount = computed(() => {
        return data.value?.approximateCount;
    })
    const listCount = computed(() => {
        return data?.value?.entities?.length;
    });

    return {
        data,
        body,
        totalCount,
        listCount,
        error,
        state,
        STATES,
        mutate
    }
}