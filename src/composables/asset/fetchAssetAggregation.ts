
import { SearchParameters } from '~/types/atlas/attributes';

import { SearchBasic } from '~/api/atlas/searchbasic';

import { useAsyncState } from '@vueuse/core';
import { Ref } from 'vue';
import { CancelTokenSource } from 'axios';



export default function fetchAssetAggregation(body: Ref<SearchParameters>, cancelToken: Ref<CancelTokenSource>) {

    const { state, execute, isReady, error } = useAsyncState(() => SearchBasic.Basic(body.value, {
        cancelToken: cancelToken?.value.token
    }), {}, {
        immediate: false
    });
    return {
        state, execute, isReady, error
    }
}