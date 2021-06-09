import { computed, ComputedRef, Ref, ref, watch } from 'vue';
import { Components } from '~/api/atlas/client';
import { SearchBasic, URL } from '~/api/atlas/searchbasic';
import { BaseAttributes, ConnectionAttributes } from '~/constant/projection';
import { ConnectionType } from '~/types/atlas/connection';
import swrvState from '../utils/swrvState';
import useSWRV from 'swrv';

export default function fetchSearchList(dependent: any, body: Ref<Components.Schemas.SearchParameters>) {

    const { data, error, mutate, isValidating } = useSWRV([URL.SEARCHBASIC, body.value, {}], () => {
        if (dependent.value) {
            return SearchBasic.Basic(body.value, {})
        }
        else {
            return {}
        }
    }, {
        revalidateOnFocus: false,
        dedupingInterval: 1,
    });
    const { state, STATES } = swrvState(data, error, isValidating);
    const list: ComputedRef<ConnectionType[] | undefined> = computed(() => {
        console.log(data);
        return <ConnectionType[] | undefined>data.value?.entities;
    });
    const item: ComputedRef<ConnectionType | undefined> = computed(() => {
        if (list.value) {
            if (list.value.length > 0) {
                return list.value[0];
            }
        }
        return {} as ConnectionType;
    });
    const totalCount = computed(() => {
        return data.value?.approximateCount;
    })
    const listCount = computed(() => {
        return data?.value?.entities?.length;
    });

    return {
        data,
        body,
        list,
        item,
        totalCount,
        listCount,
        error,
        state,
        STATES,
        mutate
    }
}