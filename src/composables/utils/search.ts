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
        revalidateOnFocus: false,
        dedupingInterval: 1,
    });

    const handleLoadMore = () => {
        let newOffset = body?.value.limit + body?.value.offset;
        body.value.offset = newOffset;
        mutate();
    };


    const { state, STATES } = swrvState(data, error, isValidating);
    const totalCount = computed(() => {
        return data.value?.approximateCount;
    })
    const listCount = computed(() => {
        return data?.value?.entities?.length;
    });

    const aggregations = computed(() => {
        return data?.value?.aggregations;
    });

    const errorMessage = computed(() => {
        if (error?.value.response?.data?.errorMessage) {
            return error?.value.response?.data?.errorMessage;
        } else {
            return "Something went wrong.";
        }
    });

    const list: ComputedRef = computed(() => {
        return data?.value?.entities || [];
    });




    return {
        data,
        body,
        list,
        totalCount,
        listCount,
        handleLoadMore,
        aggregations,
        error,
        errorMessage,
        state,
        STATES,
        mutate
    }
}