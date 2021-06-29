import { computed, ComputedRef, Ref } from 'vue';

import { SearchBasic } from '~/api/atlas/searchbasic';

import swrvState from '../utils/swrvState';
import useSWRV from 'swrv';

import { CancelTokenSource } from 'axios';

import { SearchParameters } from '~/types/atlas/attributes';

export default function fetchSearchList(dependent: any, body: Ref<SearchParameters>, paramCancelToken?: Ref<CancelTokenSource>) {

    const { data, error, mutate, isValidating } = useSWRV(["", body.value, {}], () => {

        console.log("dependent", dependent.value);
        if (dependent.value) {
            return SearchBasic.Basic(body.value, {
                cancelToken: paramCancelToken?.value.token
            });
        }
        else {
            return {}
        }
    }, {
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
        aggregations,
        error,
        errorMessage,
        state,
        STATES,
        mutate
    }
}